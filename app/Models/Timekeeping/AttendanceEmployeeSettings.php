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
        'is_day_off',
    ];
}
