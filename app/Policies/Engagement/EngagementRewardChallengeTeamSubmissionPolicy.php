<?php

namespace App\Policies\Engagement;

use App\Models\Account\AccountEmployee;
use App\Models\Engagement\EngagementRewardChallenge;
use App\Models\Engagement\EngagementRewardChallengeTeamSubmission;
use App\Models\ER\ERLeader;
use App\Models\User;

class EngagementRewardChallengeTeamSubmissionPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->canReview($user);
    }

    public function create(User $user, EngagementRewardChallenge $challenge): bool
    {
        return $challenge->type === 'Team'
            && ERLeader::query()->where('user_id', $user->id)->exists();
    }

    public function review(User $user, EngagementRewardChallengeTeamSubmission $submission): bool
    {
        return $submission->getKey() !== null && $this->canReview($user);
    }

    private function canReview(User $user): bool
    {
        return $user->role === User::ROLE_ADMIN
            || \in_array((int) AccountEmployee::query()->where('user_id', $user->id)->value('department_id'), [1, 11], true);
    }
}
