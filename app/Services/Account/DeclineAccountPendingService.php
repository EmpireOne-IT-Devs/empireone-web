<?php

namespace App\Services\Account;

use App\Models\Account\AccountPending;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class DeclineAccountPendingService
{
    public function decline(AccountPending $accountPending, User $decliner): AccountPending
    {
        return DB::transaction(function () use ($accountPending, $decliner) {
            $pending = AccountPending::query()
                ->lockForUpdate()
                ->findOrFail($accountPending->getKey());

            if ($pending->status !== 'pending') {
                throw ValidationException::withMessages([
                    'account_pending' => 'This registration has already been reviewed.',
                ]);
            }

            $pending->update([
                'status' => 'declined',
                'declined_by_user_id' => $decliner->id,
                'declined_at' => now(),
            ]);

            return $pending->fresh(['location', 'declinedBy']);
        });
    }
}
