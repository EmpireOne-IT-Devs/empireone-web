<?php

namespace App\Services;

use App\Models\Account\AccountEmployee;
use App\Models\COERequest;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class COERequestService
{
    public const LIMIT_HOURS = 24;

    public function lastRequestedAt(User $user): ?Carbon
    {
        return COERequest::where('user_id', $user->id)
            ->latest('requested_at')
            ->value('requested_at');
    }

    public function nextAvailableAt(User $user): ?Carbon
    {
        $next = $this->lastRequestedAt($user)?->copy()->addHours(self::LIMIT_HOURS);

        return $next && $next->isFuture() ? $next : null;
    }

    /** Returns null when the 24-hour limit blocks a new request. */
    public function create(User $user, string $purpose): ?COERequest
    {
        return DB::transaction(function () use ($user, $purpose) {
            // Serializes concurrent requests from the same user.
            User::whereKey($user->id)->lockForUpdate()->first();

            if ($this->nextAvailableAt($user)) {
                return null;
            }

            return COERequest::create([
                'user_id' => $user->id,
                'employee_id' => AccountEmployee::where('user_id', $user->id)->value('employee_id'),
                'purpose' => $purpose,
                'requested_at' => now(),
            ]);
        });
    }
}
