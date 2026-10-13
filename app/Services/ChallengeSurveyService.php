<?php

namespace App\Services;

use App\Models\Engagement\EngagementPostEventSurvey;
use App\Models\Engagement\EngagementRewardChallenge;
use App\Models\Engagement\EngagementRewardChallengeParticipant;
use Illuminate\Support\Facades\DB;

class ChallengeSurveyService
{
    public const REWARD_POINTS = 15;

    public function submit(EngagementRewardChallenge $challenge, int $userId, array $answers): EngagementRewardChallengeParticipant
    {
        return DB::transaction(function () use ($challenge, $userId, $answers) {
            $participant = EngagementRewardChallengeParticipant::query()
                ->where('reward_challenge_id', $challenge->id)
                ->where('user_id', $userId)
                ->lockForUpdate()
                ->firstOrFail();
            $challenge = EngagementRewardChallenge::query()
                ->lockForUpdate()
                ->findOrFail($challenge->id);
            abort_unless($challenge->survey_required, 409, 'This challenge does not require a survey.');
            $survey = $challenge->survey()->with('questions')->firstOrFail();

            $existingResponse = $survey->responses()
                ->where('user_id', $userId)
                ->whereNotNull('submitted_at')
                ->lockForUpdate()
                ->first();

            if ($existingResponse) {
                if ($participant->survey_rewarded_at === null) {
                    $participant->update([
                        'survey_points_awarded' => self::REWARD_POINTS,
                        'survey_rewarded_at' => $existingResponse->submitted_at,
                    ]);
                    app(ChallengeCompletionService::class)->finalizeLocked($participant);
                }

                return $participant->load('surveyResponse');
            }

            abort_unless($participant->canAnswerSurvey($challenge), 422, 'Complete the challenge proof requirements before answering its survey.');
            abort_unless($survey->status === 'published', 422, 'This challenge survey is not open for responses.');
            abort_if($survey->questions->isEmpty(), 409, 'This challenge survey has no questions.');

            $response = $survey->responses()->create([
                'reward_challenge_participant_id' => $participant->id,
                'user_id' => $userId,
                'submitted_at' => now(),
            ]);

            foreach ($survey->questions as $question) {
                $answer = $answers[$question->id] ?? null;
                if ($answer !== null && $answer !== '') {
                    $response->answers()->create([
                        'engagement_post_event_question_id' => $question->id,
                        'user_id' => $userId,
                        'answer' => (string) $answer,
                    ]);
                }
            }

            $participant->update([
                'survey_points_awarded' => self::REWARD_POINTS,
                'survey_rewarded_at' => now(),
            ]);
            app(ChallengeCompletionService::class)->finalizeLocked($participant);
            $survey->refreshSentimentOverview();

            return $participant->load('surveyResponse');
        });
    }

    private const QUESTIONS = [
        ['How satisfied were you with the event?', 'rating', true],
        ['How satisfied were you with the activities? (Schedule)', 'rating', true],
        ['How satisfied were you with the activities? (Food)', 'rating', true],
        ['How satisfied were you with the activities? (Program)', 'rating', true],
        ['What was the highlight of the event for you?', 'paragraph', false],
        ['What is one thing we could change to make this event even better next time?', 'paragraph', false],
        ['Are there any specific topics or activities you’d like to see in the future?', 'paragraph', false],
    ];

    public function createForChallenge(EngagementRewardChallenge $challenge): EngagementPostEventSurvey
    {
        return DB::transaction(function () use ($challenge) {
            $lockedChallenge = EngagementRewardChallenge::query()
                ->lockForUpdate()
                ->findOrFail($challenge->getKey());

            $survey = $lockedChallenge->survey()->first();

            if (! $survey) {
                $survey = $lockedChallenge->survey()->create([
                    'user_id' => $lockedChallenge->created_by,
                    'title' => mb_substr($lockedChallenge->title.' - Feedback Survey', 0, 255),
                    'status' => 'published',
                    'published_at' => now(),
                ]);

                foreach (self::QUESTIONS as $index => [$text, $type, $required]) {
                    $survey->questions()->create([
                        'user_id' => $lockedChallenge->created_by,
                        'question' => $text,
                        'type' => $type,
                        'is_required' => $required,
                        'sort_order' => $index,
                    ]);
                }
            }

            $lockedChallenge->update(['survey_required' => true]);
            $challenge->setAttribute('survey_required', true);
            $challenge->setRelation('survey', $survey);

            return $survey->load('questions.options');
        });
    }
}
