<?php

namespace App\Policies;

use App\Models\AssetInventory\AssetItemRequest;
use App\Models\User;

class AssetItemRequestPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function view(User $user, AssetItemRequest $request): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function decide(User $user, string $step): bool
    {
        $email = trim((string) config('item_request.steps.'.$step.'.email'));

        return $this->viewAny($user) && $user->hasVerifiedEmail()
            && $email !== '' && strcasecmp($email, (string) $user->email) === 0;
    }
}
