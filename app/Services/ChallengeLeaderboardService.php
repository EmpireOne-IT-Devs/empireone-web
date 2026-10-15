<?php

namespace App\Services;

use App\Models\Engagement\EngagementRewardChallengeTeamSubmission;
use App\Models\User;
use Illuminate\Support\Collection;

class ChallengeLeaderboardService
{
    public function build(
        Collection $participants,
        Collection $teamSubmissions,
        array $teamParticipantIds,
    ): array {
        $individualEntries = $participants
            ->reject(fn (User $user) => in_array(
                (int) $user->pivot->id,
                $teamParticipantIds,
                true,
            ))
            ->map(fn (User $user) => $this->individualEntry($user));

        $teamEntries = $teamSubmissions
            ->groupBy('leader_id')
            ->map(fn (Collection $submissions) => $this->teamEntry($submissions));

        return [
            'individual' => $this->rankEntries($individualEntries)->all(),
            'team' => $this->rankEntries($teamEntries)->all(),
        ];
    }

    private function individualEntry(User $user): array
    {
        $participant = $user->pivot;
        $approved = $participant->status === 'approved';
        $points = $approved ? (int) $participant->points_awarded : 0;
        $bonusPoints = $approved ? (int) $participant->bonus_points : 0;

        return [
            'id' => (int) $participant->id,
            'participant_id' => (int) $participant->id,
            'name' => $user->name,
            'email' => $user->email,
            'department' => $user->department?->name,
            'status' => $participant->status,
            'points_awarded' => $points,
            'challenge_points_awarded' => max(0, $points - $bonusPoints),
            'bonus_points_awarded' => $bonusPoints,
            'joined_at' => $participant->joined_at?->toDateTimeString(),
            'submitted_at' => $participant->submitted_at?->toDateTimeString(),
        ];
    }

    private function teamEntry(Collection $submissions): array
    {
        /** @var EngagementRewardChallengeTeamSubmission $latestSubmission */
        $latestSubmission = $submissions->first();
        $approvedSubmissions = $submissions->where('status', 'approved');
        $points = (int) $approvedSubmissions->sum('team_points_awarded');
        $basePoints = (int) $approvedSubmissions->sum('base_points_awarded');
        $bonusPoints = (int) $approvedSubmissions->sum('bonus_points_awarded');
        $leader = $latestSubmission->leader;
        $members = $submissions
            ->flatMap(fn (EngagementRewardChallengeTeamSubmission $submission) => $submission->members)
            ->unique('user_id')
            ->values();
        $joinedAt = $members
            ->pluck('participant.joined_at')
            ->filter()
            ->min();
        $departments = $members
            ->pluck('department_name')
            ->filter()
            ->unique()
            ->values();

        return [
            'id' => 'team-'.$latestSubmission->leader_id,
            'participant_id' => (int) $latestSubmission->leader_id,
            'name' => 'Team: '.($leader?->name ?? 'Unknown leader'),
            'email' => $leader?->email,
            'department' => $departments->implode(', ') ?: null,
            'status' => $points > 0 ? 'approved' : $latestSubmission->status,
            'points_awarded' => $points,
            'challenge_points_awarded' => $basePoints,
            'bonus_points_awarded' => $bonusPoints,
            'joined_at' => $joinedAt ? (string) $joinedAt : null,
            'submitted_at' => $latestSubmission->submitted_at?->toDateTimeString(),
            'member_count' => $members->count(),
            'members' => $members->pluck('full_name')->values()->all(),
        ];
    }

    private function rankEntries(Collection $entries): Collection
    {
        $rankedEntries = $entries
            ->sort(function (array $left, array $right) {
                $pointsOrder = $right['points_awarded'] <=> $left['points_awarded'];
                if ($pointsOrder !== 0) {
                    return $pointsOrder;
                }

                return strcasecmp($left['name'], $right['name']);
            })
            ->values();
        $topPoints = (int) ($rankedEntries->first()['points_awarded'] ?? 0);
        $winnerCount = $topPoints > 0
            ? $rankedEntries->where('points_awarded', $topPoints)->count()
            : 0;
        $previousPoints = null;
        $previousRank = null;

        return $rankedEntries->map(function (array $entry, int $index) use (
            $topPoints,
            $winnerCount,
            &$previousPoints,
            &$previousRank,
        ) {
            $points = (int) $entry['points_awarded'];
            $rank = null;

            if ($points > 0) {
                $rank = $points === $previousPoints ? $previousRank : $index + 1;
                $previousPoints = $points;
                $previousRank = $rank;
            }

            return [
                ...$entry,
                'rank' => $rank,
                'is_winner' => $topPoints > 0 && $points === $topPoints,
                'winner_count' => $winnerCount,
            ];
        });
    }

}
