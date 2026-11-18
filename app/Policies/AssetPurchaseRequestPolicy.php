<?php

namespace App\Policies;

use App\Models\AssetInventory\AssetPurchaseRequest;
use App\Models\User;

class AssetPurchaseRequestPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function create(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function reviewAny(User $user): bool
    {
        foreach (array_keys(config('purchase_request.steps')) as $step) {
            if ($this->decide($user, $step)) {
                return true;
            }
        }

        return false;
    }

    public function view(User $user, AssetPurchaseRequest $request): bool
    {
        return $this->viewAny($user)
            && ((string) $request->requester_id === (string) $user->getKey() || $this->reviewAny($user));
    }

    public function decide(User $user, string $step): bool
    {
        $email = config('purchase_request.steps.'.$step.'.email');

        return $this->viewAny($user) && $user->hasVerifiedEmail()
            && is_string($email) && trim($email) !== ''
            && strcasecmp(trim($email), (string) $user->email) === 0;
    }
}
