<?php

namespace App\Http\Controllers\API\Activities;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class ActivityBirthdayController extends Controller
{
    /**
     * GET /api/activities/upcoming_birthdays
     *
     * Returns ALL admin and employee users whose birthday falls in the current
     * calendar month, sorted ascending by birthday day.
     *
     * Intentionally queries from User (not AccountEmployee) so that every person
     * whose date_of_birth is recorded appears — regardless of whether their
     * employee record is fully set up (no employee_id requirement, no status gate).
     *
     * Applicants (role 3) are excluded — they are not staff.
     */
    public function upcoming_birthdays(): JsonResponse
    {
        $currentMonth = now()->month;

        $users = User::query()
            // Only staff roles — exclude applicants (role 3)
            ->whereIn('role', [User::ROLE_ADMIN, User::ROLE_EMPLOYEE])
            ->whereHas('personal_information', function ($query) use ($currentMonth) {
                // date_of_birth stored as YYYY-MM-DD from HTML date inputs.
                // MySQL MONTH() casts that string correctly without STR_TO_DATE.
                $query->whereNotNull('date_of_birth')
                      ->whereRaw('MONTH(date_of_birth) = ?', [$currentMonth]);
            })
            ->with([
                // personal_information: only the fields needed for the response
                'personal_information:id,user_id,first_name,middle_name,last_name,suffix,profile_picture,date_of_birth',
                // account_employee already eager-loads department via its model definition
                'account_employee',
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
                    'avatar'          => $user->avatar,
                    'profile_picture' => $info->profile_picture,
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
}

