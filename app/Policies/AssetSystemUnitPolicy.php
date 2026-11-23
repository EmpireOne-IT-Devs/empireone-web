<?php

namespace App\Policies;

use App\Models\AssetInventory\AssetSystemUnit;
use App\Models\User;

class AssetSystemUnitPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function view(User $user, AssetSystemUnit $assetSystemUnit): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function create(User $user): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function update(User $user, AssetSystemUnit $assetSystemUnit): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function delete(User $user, AssetSystemUnit $assetSystemUnit): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }
}
