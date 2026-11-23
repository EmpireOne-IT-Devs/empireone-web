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

    public function decide(User $user, string $step, ?AssetItemRequest $request = null): bool
    {
        $assigned = $request?->steps()->where('key', $step)->value('assigned_user_id');
        if ($assigned === null) {
            $routeRequest = request()->route('itemRequest');
            if ($routeRequest instanceof AssetItemRequest) {
                $assigned = $routeRequest->steps()->where('key', $step)->value('assigned_user_id');
            }
        }
        if ($assigned !== null) {
            return $this->viewAny($user) && $user->hasVerifiedEmail()
                && (string) $assigned === (string) $user->getKey()
                && $this->usableEogsEmail($user);
        }
        $email = trim((string) config('item_request.steps.'.$step.'.email'));

        return $this->viewAny($user) && $user->hasVerifiedEmail()
            && $email !== '' && strcasecmp($email, (string) $user->email) === 0;
    }

    private function usableEogsEmail(User $user): bool
    {
        $email = trim((string) $user->account_employee?->eogs_email);
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }
}
