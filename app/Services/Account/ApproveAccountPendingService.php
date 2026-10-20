<?php

namespace App\Services\Account;

use App\Models\Account\AccountEmployee;
use App\Models\Account\AccountPending;
use App\Models\Account\AccountPersonalInformation;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ApproveAccountPendingService
{
    public function approve(AccountPending $accountPending, User $approver): AccountPending
    {
        $initialPassword = config('accounts.pending_employee_initial_password');

        if (!is_string($initialPassword) || trim($initialPassword) === '') {
            abort(
                503,
                'The employee account initial password is not configured. Set ACCOUNT_PENDING_INITIAL_PASSWORD on the server.',
            );
        }

        return DB::transaction(function () use ($accountPending, $approver, $initialPassword) {
            $pending = AccountPending::query()
                ->lockForUpdate()
                ->findOrFail($accountPending->getKey());

            if ($pending->status !== 'pending') {
                throw ValidationException::withMessages([
                    'account_pending' => 'This registration has already been approved.',
                ]);
            }

            if (User::query()->where('email', $pending->employee_email)->exists()) {
                throw ValidationException::withMessages([
                    'employee_email' => 'An account already exists for this email address.',
                ]);
            }

            if (AccountEmployee::query()->where('employee_id', $pending->eid)->exists()) {
                throw ValidationException::withMessages([
                    'eid' => 'An employee account already exists for this EID.',
                ]);
            }

            $nameParts = preg_split(
                '/\s+/',
                trim($pending->full_name),
                -1,
                PREG_SPLIT_NO_EMPTY,
            ) ?: [];
            $firstName = array_shift($nameParts) ?? '';
            $lastName = count($nameParts) > 0 ? array_pop($nameParts) : null;

            $user = User::create([
                'name' => $pending->full_name,
                'email' => $pending->employee_email,
                'password' => $initialPassword,
                'role' => User::ROLE_EMPLOYEE,
            ]);

            AccountPersonalInformation::create([
                'user_id' => $user->id,
                'first_name' => $firstName,
                'middle_name' => count($nameParts) > 0 ? implode(' ', $nameParts) : null,
                'last_name' => $lastName,
            ]);

            AccountEmployee::create([
                'user_id' => $user->id,
                'employee_id' => $pending->eid,
                'location_id' => $pending->location_id,
                'position' => $pending->position,
            ]);

            $pending->update([
                'status' => 'approved',
                'approved_by_user_id' => $approver->id,
                'approved_at' => now(),
                'user_id' => $user->id,
            ]);

            return $pending->fresh(['location', 'approvedBy', 'user']);
        });
    }
}
