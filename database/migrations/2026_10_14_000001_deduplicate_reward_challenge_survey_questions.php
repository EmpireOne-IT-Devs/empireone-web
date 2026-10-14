<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::transaction(function () {
            $surveyIds = DB::table('engagement_post_event_surveys')
                ->whereNotNull('reward_challenge_id')
                ->pluck('id');

            foreach ($surveyIds as $surveyId) {
                $canonicalQuestions = [];
                $questions = DB::table('engagement_post_event_questions')
                    ->where('engagement_post_event_survey_id', $surveyId)
                    ->orderBy('id')
                    ->get();

                foreach ($questions as $question) {
                    $normalizedText = preg_replace('/\s+/u', ' ', trim((string) $question->question));
                    if ($normalizedText === null || $normalizedText === '') {
                        continue;
                    }

                    $key = mb_strtolower($normalizedText).'|'.mb_strtolower(trim((string) $question->type));
                    $canonicalQuestionId = $canonicalQuestions[$key] ?? null;

                    if ($canonicalQuestionId === null) {
                        $canonicalQuestions[$key] = $question->id;
                        continue;
                    }

                    DB::table('engagement_post_event_answers')
                        ->where('engagement_post_event_question_id', $question->id)
                        ->update(['engagement_post_event_question_id' => $canonicalQuestionId]);
                    DB::table('engagement_post_event_question_options')
                        ->where('engagement_post_event_question_id', $question->id)
                        ->update(['engagement_post_event_question_id' => $canonicalQuestionId]);

                    DB::table('engagement_post_event_questions')
                        ->where('id', $question->id)
                        ->delete();
                }
            }
        });
    }

    public function down(): void
    {
        // Duplicate question rows are removed data; restoring them would reintroduce the defect.
    }
};
