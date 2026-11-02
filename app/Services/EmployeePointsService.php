<?php

namespace App\Services;

use App\Models\Engagement\EngagementEStorePointTransaction;
use App\Models\Engagement\EngagementRewardChallengeParticipant;
use App\Models\Engagement\EngagementRewardChallengeTeamSubmission;

/**
 * Single source of truth for an employee's R&R points.
 *
 * Earned points mirror EngagementRewardChallengesController::profileSummary()
 * exactly: approved participant awards + survey points + team leader awards.
 * E-Store redemptions are tracked in their own transaction table so the
 * existing earning records are never mutated.
 */
class EmployeePointsService
{
    public function earnedPoints(int $userId): int
    {
        $total = EngagementRewardChallengeParticipant::query()
            ->where('user_id', $userId)
            ->selectRaw('SUM('.EngagementRewardChallengeParticipant::TOTAL_POINTS_SQL.') as total')
            ->value('total');

        $total += (int) EngagementRewardChallengeTeamSubmission::query()
            ->where('leader_id', $userId)
            ->sum('team_points_awarded');

        return (int) $total;
    }

    public function redeemedPoints(int $userId): int
    {
        return (int) EngagementEStorePointTransaction::query()
            ->where('user_id', $userId)
            ->where('type', EngagementEStorePointTransaction::TYPE_DEDUCTION)
            ->sum('points');
    }

    public function refundedPoints(int $userId): int
    {
        return (int) EngagementEStorePointTransaction::query()
            ->where('user_id', $userId)
            ->where('type', EngagementEStorePointTransaction::TYPE_REFUND)
            ->sum('points');
    }

    public function spendablePoints(int $userId): int
    {
        return $this->earnedPoints($userId) - $this->redeemedPoints($userId) + $this->refundedPoints($userId);
    }
}
