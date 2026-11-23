<?php

namespace App\Policies;

use App\Models\AssetInventory\AssetPurchaseRequest;
use App\Models\AssetInventory\AssetPurchaseRequestStep;
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
        if (AssetPurchaseRequestStep::query()->where('assigned_user_id', $user->getKey())
            ->where('status', 'pending')->exists()) {
            return $this->viewAny($user) && $user->hasVerifiedEmail() && $this->usableEogsEmail($user);
        }
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

    public function decide(User $user, string $step, ?AssetPurchaseRequest $request = null): bool
    {
        $assigned = $request?->steps()->where('key', $step)->value('assigned_user_id');
        if ($assigned === null) {
            $routeRequest = request()->route('purchaseRequest');
            if ($routeRequest instanceof AssetPurchaseRequest) {
                $assigned = $routeRequest->steps()->where('key', $step)->value('assigned_user_id');
            }
        }
        if ($assigned !== null) {
            return $this->viewAny($user) && $user->hasVerifiedEmail()
                && (string) $assigned === (string) $user->getKey()
                && $this->usableEogsEmail($user);
        }
        $email = config('purchase_request.steps.'.$step.'.email');

        return $this->viewAny($user) && $user->hasVerifiedEmail()
            && is_string($email) && trim($email) !== ''
            && strcasecmp(trim($email), (string) $user->email) === 0;
    }

    private function usableEogsEmail(User $user): bool
    {
        $email = trim((string) $user->account_employee?->eogs_email);
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }
}
