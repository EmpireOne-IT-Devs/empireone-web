<?php

namespace App\Policies;

use App\Models\COERequest;
use App\Models\User;

class COERequestPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function view(User $user, COERequest $coeRequest): bool
    {
        return $user->role === User::ROLE_ADMIN || $coeRequest->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, [User::ROLE_ADMIN, User::ROLE_EMPLOYEE], true);
    }

    public function update(User $user, COERequest $coeRequest): bool
    {
        return false;
    }

    public function delete(User $user, COERequest $coeRequest): bool
    {
        return false;
    }
}
