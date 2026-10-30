<?php

namespace App\Services;

use App\Models\Engagement\EngagementPostEventQuestion;
use App\Models\Engagement\EngagementPostEventSurvey;
use App\Models\Engagement\EngagementRewardChallenge;
use App\Models\Engagement\EngagementRewardChallengeParticipant;
use App\Models\Engagement\EngagementRewardChallengeTeamSubmission;
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

                $this->releaseTeamPointsAfterSurvey($challenge, $userId);

                return $participant->load('surveyResponse');
            }

            abort_unless($participant->canAnswerSurvey($challenge), 422, 'This survey is not available for your participation yet.');
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
            $this->releaseTeamPointsAfterSurvey($challenge, $userId);

            return $participant->load('surveyResponse');
        });
    }

    private function releaseTeamPointsAfterSurvey(EngagementRewardChallenge $challenge, int $leaderId): void
    {
        $submissions = EngagementRewardChallengeTeamSubmission::query()
            ->where('reward_challenge_id', $challenge->id)
            ->where('leader_id', $leaderId)
            ->where('status', 'approved')
            ->where(function ($query) {
                $query->where('pending_base_points', '>', 0)
                    ->orWhere('pending_bonus_points', '>', 0);
            })
            ->lockForUpdate()
            ->get();

        foreach ($submissions as $submission) {
            $basePoints = (int) $submission->pending_base_points;
            $bonusPoints = (int) $submission->pending_bonus_points;

            $submission->update([
                'base_points_awarded' => (int) $submission->base_points_awarded + $basePoints,
                'bonus_points_awarded' => (int) $submission->bonus_points_awarded + $bonusPoints,
                'team_points_awarded' => (int) $submission->team_points_awarded + $basePoints + $bonusPoints,
                'pending_base_points' => 0,
                'pending_bonus_points' => 0,
            ]);
        }
    }

    public function removeDuplicateQuestions(EngagementPostEventSurvey $survey): void
    {
        if ($survey->reward_challenge_id === null) {
            return;
        }

        DB::transaction(function () use ($survey) {
            $lockedSurvey = EngagementPostEventSurvey::query()
                ->lockForUpdate()
                ->findOrFail($survey->getKey());

            if ($lockedSurvey->reward_challenge_id === null) {
                return;
            }

            $this->detachForeignQuestions($lockedSurvey);
            $this->deduplicateQuestions($lockedSurvey);
        });
    }

    /**
     * Challenge questions never belong to a Post Event. Rows that do were left
     * behind by a deleted Post Event survey whose id was later reused (the
     * MyISAM survey tables do not enforce cascading foreign keys), so they are
     * unlinked from the challenge survey instead of being shown as extra questions.
     */
    private function detachForeignQuestions(EngagementPostEventSurvey $survey): void
    {
        EngagementPostEventQuestion::query()
            ->where('engagement_post_event_survey_id', $survey->getKey())
            ->where(function ($query) use ($survey) {
                $query->whereNotNull('engagement_post_event_id');
                if ($survey->created_at) {
                    $query->orWhere('created_at', '<', $survey->created_at);
                }
            })
            ->whereDoesntHave('answers')
            ->update(['engagement_post_event_survey_id' => null]);
    }

    private function deduplicateQuestions(EngagementPostEventSurvey $survey): void
    {
        $canonicalQuestions = [];

        foreach ($survey->questions()->orderBy('id')->get() as $question) {
            $normalizedText = preg_replace('/\s+/u', ' ', trim((string) $question->question));
            if ($normalizedText === null || $normalizedText === '') {
                continue;
            }

            $key = mb_strtolower($normalizedText).'|'.mb_strtolower(trim((string) $question->type));
            $canonicalQuestion = $canonicalQuestions[$key] ?? null;

            if ($canonicalQuestion === null) {
                $canonicalQuestions[$key] = $question;
                continue;
            }

            DB::table('engagement_post_event_answers')
                ->where('engagement_post_event_question_id', $question->id)
                ->update(['engagement_post_event_question_id' => $canonicalQuestion->id]);
            DB::table('engagement_post_event_question_options')
                ->where('engagement_post_event_question_id', $question->id)
                ->update(['engagement_post_event_question_id' => $canonicalQuestion->id]);

            $question->delete();
        }
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

                // A reused survey id must start without another survey's questions.
                EngagementPostEventQuestion::query()
                    ->where('engagement_post_event_survey_id', $survey->getKey())
                    ->update(['engagement_post_event_survey_id' => null]);

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

            $this->detachForeignQuestions($survey);
            $this->deduplicateQuestions($survey);
            $lockedChallenge->update(['survey_required' => true]);
            $challenge->setAttribute('survey_required', true);
            $challenge->setRelation('survey', $survey);

            return $survey->load('questions.options');
        });
    }
}
