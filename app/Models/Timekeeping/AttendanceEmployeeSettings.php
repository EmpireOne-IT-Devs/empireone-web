<?php

namespace App\Models\Timekeeping;

use Illuminate\Database\Eloquent\Model;

class AttendanceEmployeeSettings extends Model
{
    protected $fillable = [
        'user_id',
        'employee_id',
        'day',
        'time_in',
        'time_out',
        'break_minutes',
        'is_day_off',
    ];

    public static function forEmployeeAndDay(int $userId, string $day): ?self
    {
        return static::where('user_id', $userId)->where('day', $day)->first();
    }
}
