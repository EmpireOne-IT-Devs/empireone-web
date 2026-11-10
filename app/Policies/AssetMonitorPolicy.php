<?php

namespace App\Policies;

use App\Models\AssetInventory\AssetMonitor;
use App\Models\User;

class AssetMonitorPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function view(User $user, AssetMonitor $assetMonitor): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function create(User $user): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function update(User $user, AssetMonitor $assetMonitor): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function delete(User $user, AssetMonitor $assetMonitor): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function import(User $user): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }
}