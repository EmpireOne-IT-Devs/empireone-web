<?php

namespace App\Services;

use App\Models\Account\AccountEmployee;
use App\Models\Timekeeping\LeaveRequest;
use Carbon\Carbon;

class LeaveCreditService
{
    /**
     * Credits are scoped to the current calendar year (Jan 1 - today): they accrue
     * monthly (annual entitlement / 12) once regularized, and reset every January.
     */
    public function summary(int $userId): array
    {
        $employee = AccountEmployee::where('user_id', $userId)->first();
        $hiredAt = $this->parseDate($employee?->started_at);
        $today = Carbon::today();
        $yearStart = $today->copy()->startOfYear();
        $yearEnd = $today->copy()->endOfYear();
        $regularizedAt = null;
        if ($employee?->status === 'Regular' && $hiredAt) {
            $regularizedAt = $hiredAt->copy()->addMonths((int) config('leave.regularization_months'));
            if ($regularizedAt->gt($today)) {
                $regularizedAt = $today->copy();
            }
        }

        $history = [];
        $earned = 0.0;

        if ($regularizedAt) {
            $creditDate = $regularizedAt->max($yearStart)->copy()->endOfMonth()->startOfDay();

            while ($creditDate->lte($today)) {
                $credit = $this->monthlyCredit($hiredAt, $creditDate);
                $earned += $credit;
                $history[] = [
                    'date' => $creditDate->format('Y-m-d h:i A'),
                    'credit' => number_format($credit, 2),
                    'note' => '',
                    'deleted' => 'No',
                ];
                $creditDate = $creditDate->copy()->addMonthNoOverflow()->endOfMonth()->startOfDay();
            }
        }

        $used = LeaveRequest::where('user_id', $userId)
            ->where('status', '!=', 'declined')
            ->whereBetween('date', [$yearStart->toDateString(), $yearEnd->toDateString()])
            ->whereIn('leave_type', config('leave.deductible_types'))
            ->count();

        return [
            'is_regular' => (bool) $regularizedAt,
            'year' => $today->year,
            'hire_date' => $hiredAt?->toDateString(),
            'regularization_date' => $regularizedAt?->toDateString(),
            'annual_entitlement' => $hiredAt ? $this->annualDays($hiredAt, $today) : 0,
            'earned' => round($earned, 2),
            'used' => $used,
            'balance' => round($earned - $used, 2),
            'history' => array_reverse($history),
        ];
    }

    public function isDeductible(string $leaveType): bool
    {
        return in_array($leaveType, config('leave.deductible_types'), true);
    }

    private function monthlyCredit(Carbon $hiredAt, Carbon $creditDate): float
    {
        return round($this->annualDays($hiredAt, $creditDate) / 12, 2);
    }

    private function annualDays(Carbon $hiredAt, Carbon $asOf): int
    {
        $years = max(0, (int) floor($hiredAt->diffInYears($asOf)));
        $days = 0;

        foreach (config('leave.annual_days_by_service_years') as $minYears => $annual) {
            if ($years >= $minYears) {
                $days = $annual;
            }
        }

        return $days;
    }

    private function parseDate(?string $value): ?Carbon
    {
        if (!$value) {
            return null;
        }

        try {
            return Carbon::parse($value)->startOfDay();
        } catch (\Throwable) {
            return null;
        }
    }
}
