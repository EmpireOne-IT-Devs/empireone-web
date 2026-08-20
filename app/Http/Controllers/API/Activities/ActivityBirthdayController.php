<?php

namespace App\Http\Controllers\API\Activities;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class ActivityBirthdayController extends Controller
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
}

