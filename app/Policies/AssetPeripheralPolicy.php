<?php

namespace App\Policies;

use App\Models\AssetInventory\AssetPeripheral;
use App\Models\User;

class AssetPeripheralPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function view(User $user, AssetPeripheral $assetPeripheral): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function create(User $user): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function update(User $user, AssetPeripheral $assetPeripheral): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function delete(User $user, AssetPeripheral $assetPeripheral): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function import(User $user): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }
}