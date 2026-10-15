<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChallengeLeaderboardEntryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this['id'],
            'participant_id' => $this['participant_id'],
            'name' => $this['name'],
            'email' => $this['email'],
            'department' => $this['department'],
            'status' => $this['status'],
            'points_awarded' => $this['points_awarded'],
            'challenge_points_awarded' => $this['challenge_points_awarded'],
            'bonus_points_awarded' => $this['bonus_points_awarded'],
            'joined_at' => $this['joined_at'],
            'submitted_at' => $this['submitted_at'],
            'member_count' => $this['member_count'] ?? null,
            'members' => $this['members'] ?? [],
            'rank' => $this['rank'],
            'is_winner' => $this['is_winner'],
            'winner_count' => $this['winner_count'],
        ];
    }
}
