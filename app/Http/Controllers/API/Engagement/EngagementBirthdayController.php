<?php

namespace App\Http\Controllers\API\Engagement;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class EngagementBirthdayController extends Controller
{
    public function upcoming_birthdays(): JsonResponse
    {
        $currentMonth = now()->month;

        $users = User::query()
            ->whereIn('role', [User::ROLE_ADMIN, User::ROLE_EMPLOYEE])
            ->whereHas('personal_information', function ($query) use ($currentMonth) {
                $query->whereNotNull('date_of_birth')
                      ->whereRaw('MONTH(date_of_birth) = ?', [$currentMonth]);
            })
            ->with([
                'personal_information:id,user_id,first_name,middle_name,last_name,suffix,date_of_birth',
                'account_employee.location',
            ])
            ->get()
            ->map(function ($user) {
                $info = $user->personal_information;

                if (! $info || ! $info->date_of_birth) {
                    return null;
                }

                try {
                    $date = Carbon::parse($info->date_of_birth);
                } catch (\Exception) {
                    return null;
                }

                $firstName = $info->first_name ?? '';
                $lastName  = $info->last_name  ?? '';

                $fullName = trim(
                    collect([$firstName, $info->middle_name, $lastName, $info->suffix])
                        ->filter()
                        ->join(' ')
                );

                $employee = $user->account_employee;

                return [
                    'user_id'         => $user->id,
                    'employee_id'     => $employee?->employee_id,
                    'name'            => $fullName ?: ($user->name ?? ''),
                    'initials'        => strtoupper(
                                            mb_substr($firstName, 0, 1) .
                                            mb_substr($lastName,  0, 1)
                                        ),
                    'department'      => $employee?->department?->name,
                    'position'        => $employee?->position,
                    'location'        => $employee?->location?->name,
                    'avatar'          => $user->avatar,
                    'profile_picture' => $user->avatar,
                    'date_of_birth'   => $info->date_of_birth,
                    'birthday_label'  => $date->format('M d'),
                    'birthday_month'  => $date->month,
                    'birthday_day'    => $date->day,
                    'is_today'        => $date->day === now()->day,
                ];
            })
            ->filter()
            ->sortBy(fn ($item) => $item['birthday_day'])
            ->values();

        return response()->json([
            'status' => 'success',
            'month'  => now()->format('F'),
            'count'  => $users->count(),
            'data'   => $users,
        ], 200);
    }

    /**
     * Employees whose hire date (account_employee.started_at) falls in the
     * requested month/year and whose anniversary has already occurred (or is
     * today) — only enforced when the requested period is the current one.
     * Optionally scoped to a site/location via `location_id`.
     */
    public function upcoming_work_anniversaries(Request $request): JsonResponse
    {
        $now = now();
        $currentMonth = $now->month;
        $currentYear = $now->year;
        $today = $now->copy()->startOfDay();

        $validated = $request->validate([
            'year' => ['nullable', 'integer', 'min:2000', 'max:2100'],
            'month' => ['nullable', 'integer', 'min:1', 'max:12'],
            'location_id' => ['nullable', 'integer'],
        ]);

        // Query params always arrive as strings; cast so strict comparisons below work.
        $filterYear = isset($validated['year']) ? (int) $validated['year'] : $currentYear;
        $filterMonth = isset($validated['month']) ? (int) $validated['month'] : $currentMonth;
        $locationId = isset($validated['location_id']) ? (int) $validated['location_id'] : null;
        $isCurrentPeriod = $filterYear === $currentYear && $filterMonth === $currentMonth;

        $users = User::query()
            ->whereIn('role', [User::ROLE_ADMIN, User::ROLE_EMPLOYEE])
            ->whereHas('account_employee', function ($query) use ($locationId) {
                $query->whereNotNull('started_at');

                if ($locationId) {
                    $query->where('location_id', $locationId);
                }
            })
            ->with([
                'personal_information:id,user_id,first_name,middle_name,last_name,suffix',
                'account_employee.department',
                'account_employee.location',
            ])
            ->get()
            ->map(function ($user) use ($filterMonth, $filterYear, $today, $isCurrentPeriod) {
                $employee = $user->account_employee;

                if (! $employee || ! $employee->started_at) {
                    return null;
                }

                try {
                    $hireDate = Carbon::parse($employee->started_at)->startOfDay();
                } catch (\Exception) {
                    return null;
                }

                if ($hireDate->month !== $filterMonth) {
                    return null;
                }

                $years = $filterYear - $hireDate->year;

                if ($years < 1) {
                    return null;
                }

                $anniversaryDate = $hireDate->copy()->year($filterYear);

                if ($isCurrentPeriod && $anniversaryDate->greaterThan($today)) {
                    return null;
                }

                $info = $user->personal_information;
                $firstName = $info->first_name ?? '';
                $lastName = $info->last_name ?? '';

                $fullName = trim(
                    collect([$firstName, $info->middle_name ?? null, $lastName, $info->suffix ?? null])
                        ->filter()
                        ->join(' ')
                );

                return [
                    'user_id'            => $user->id,
                    'employee_id'        => $employee->employee_id,
                    'name'               => $fullName ?: ($user->name ?? ''),
                    'initials'           => strtoupper(
                                                mb_substr($firstName, 0, 1) .
                                                mb_substr($lastName, 0, 1)
                                            ),
                    'department'         => $employee->department?->name,
                    'position'           => $employee->position,
                    'location'           => $employee->location?->name,
                    'avatar'             => $user->avatar,
                    'profile_picture'    => $user->avatar,
                    'hire_date'          => $hireDate->toDateString(),
                    'anniversary_date'   => $anniversaryDate->toDateString(),
                    'anniversary_day'    => $anniversaryDate->day,
                    'anniversary_years'  => $years,
                    'anniversary_label'  => $this->ordinal($years).' Work Anniversary',
                    'is_today'           => $anniversaryDate->isSameDay($today),
                ];
            })
            ->filter()
            ->sortBy(fn ($item) => $item['anniversary_day'])
            ->values();

        return response()->json([
            'status' => 'success',
            'month'  => Carbon::create($filterYear, $filterMonth, 1)->format('F'),
            'year'   => $filterYear,
            'count'  => $users->count(),
            'data'   => $users,
        ], 200);
    }

    private function ordinal(int $number): string
    {
        if (in_array($number % 100, [11, 12, 13], true)) {
            return $number.'th';
        }

        return $number.match ($number % 10) {
            1 => 'st',
            2 => 'nd',
            3 => 'rd',
            default => 'th',
        };
    }
}
