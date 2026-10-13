<?php

namespace App\Http\Resources\Engagement;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class EngagementRewardChallengeTeamSubmissionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $challenge = $this->challenge;

        return [
            'id' => 'team-'.$this->id,
            'team_submission_id' => $this->id,
            'log_date' => $this->log_date?->toDateString(),
            'status' => $this->status,
            'submission_url' => Storage::disk('s3')->url($this->submission_path),
            'challenge_description' => $this->challenge_description,
            'submitted_at' => $this->submitted_at?->toDateTimeString(),
            'reviewed_at' => $this->reviewed_at?->toDateTimeString(),
            'review_note' => $this->review_note,
            'points_submitted' => $challenge?->points,
            'challenge' => $challenge ? [
                'id' => $challenge->id,
                'title' => $challenge->title,
                'points' => $challenge->points,
                'category' => $challenge->category,
                'type' => $challenge->type,
                'survey_required' => (bool) $challenge->survey_required,
            ] : null,
            'employees' => $this->members->map(fn ($member) => [
                'id' => $member->user_id,
                'name' => $member->full_name,
                'eoid' => $member->eoid,
                'department_id' => $member->department_id,
                'department_name' => $member->department_name,
                'account_id' => $member->account_id,
                'account_name' => $member->account_name,
                'location_id' => $member->location_id,
                'survey_completed' => $member->participant?->survey_rewarded_at !== null,
            ])->values(),
        ];
    }
}
