<?php

namespace App\Policies;

use App\Models\AssetInventory\AssetDevice;
use App\Models\User;

class AssetDevicePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function view(User $user, AssetDevice $assetDevice): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function create(User $user): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function update(User $user, AssetDevice $assetDevice): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function delete(User $user, AssetDevice $assetDevice): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function import(User $user): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }
}
