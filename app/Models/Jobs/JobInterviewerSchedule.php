<?php

namespace App\Models\Jobs;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class JobInterviewerSchedule extends Model
{
    protected $fillable = [
        'interviewer_id',
        'day_of_week_from',
        'day_of_week_to',
        'start_time',
        'end_time',
        'break_time_start',
        'break_time_end'
    ];

    public function interviewer(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'interviewer_id');
    }
}
