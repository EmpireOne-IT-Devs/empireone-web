<?php

namespace App\Policies;

use App\Models\AssetInventory\AssetPart;
use App\Models\User;

class AssetPartPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function view(User $user, AssetPart $assetPart): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function create(User $user): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function update(User $user, AssetPart $assetPart): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function delete(User $user, AssetPart $assetPart): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function import(User $user): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }
}