<?php

namespace App\Policies\Engagement;

use App\Models\Engagement\EngagementEStoreRedemption;
use App\Models\User;

class EngagementEStoreRedemptionPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, [User::ROLE_ADMIN, User::ROLE_EMPLOYEE], true);
    }

    public function view(User $user, EngagementEStoreRedemption $redemption): bool
    {
        return $user->role === User::ROLE_ADMIN || $redemption->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, [User::ROLE_ADMIN, User::ROLE_EMPLOYEE], true)
            && $user->account_employee !== null;
    }

    public function cancel(User $user, EngagementEStoreRedemption $redemption): bool
    {
        return $redemption->user_id === $user->id
            && $redemption->status === EngagementEStoreRedemption::STATUS_PENDING;
    }

    public function viewAnyAdmin(User $user): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function approve(User $user): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function process(User $user): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function complete(User $user): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function reject(User $user): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function adminCancel(User $user): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }
}
