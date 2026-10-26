<?php

namespace App\Policies;

use App\Models\User;

class TimeSheetPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function export(User $user): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }
}
