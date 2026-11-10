<?php

namespace App\Policies;

use App\Models\AssetInventory\AssetOtherAsset;
use App\Models\User;

class AssetOtherAssetPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function view(User $user, AssetOtherAsset $assetOtherAsset): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function create(User $user): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function update(User $user, AssetOtherAsset $assetOtherAsset): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function delete(User $user, AssetOtherAsset $assetOtherAsset): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function import(User $user): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }
}