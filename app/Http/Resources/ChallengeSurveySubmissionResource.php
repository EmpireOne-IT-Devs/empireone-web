<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChallengeSurveySubmissionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'challenge_id' => $this->reward_challenge_id,
            'survey_completed' => $this->hasCompletedSurvey($this->challenge),
            'survey_completed_at' => $this->surveyResponse?->submitted_at?->toDateTimeString(),
            'participation_status' => $this->status,
            'proof_approved_at' => $this->proof_approved_at?->toDateTimeString(),
            'challenge_points_awarded' => (int) $this->points_awarded,
            'survey_points_awarded' => (int) $this->survey_points_awarded,
            'total_points_awarded' => $this->total_points_awarded,
        ];
    }
}
