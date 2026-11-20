<?php

namespace App\Policies;

use App\Models\AssetInventory\AssetLiabilityForm;
use App\Models\User;

class AssetLiabilityFormPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function view(User $user, AssetLiabilityForm $form): bool
    {
        return $this->viewAny($user) || $this->acknowledge($user, $form);
    }

    public function recordPaper(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function downloadPaperScan(User $user, AssetLiabilityForm $form): bool
    {
        return $this->recordPaper($user) && $form->source === AssetLiabilityForm::SOURCE_PAPER;
    }

    public function acknowledge(User $user, AssetLiabilityForm $form): bool
    {
        return $form->source !== AssetLiabilityForm::SOURCE_PAPER
            && in_array($user->role, [User::ROLE_ADMIN, User::ROLE_EMPLOYEE], true)
            && $user->hasVerifiedEmail()
            && (string) $form->assignee_id === (string) $user->getKey();
    }

    public function resend(User $user, AssetLiabilityForm $form): bool
    {
        return $this->viewAny($user);
    }

    public function void(User $user, AssetLiabilityForm $form): bool
    {
        return $this->viewAny($user);
    }
}
