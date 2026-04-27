<?php

namespace App\Models\Jobs;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
    /**
     * Retrieves ONLY upcoming schedules (future dates, or later times today)
     */
    public function upcoming_schedules(): HasMany
    {
        return $this->hasMany(JobApplicantSchedule::class, 'interviewer_id', 'interviewer_id')
            ->where(function ($query) {
                $query->whereDate('scheduled_date', '>', now()->toDateString())
                    ->orWhere(function ($subQuery) {
                        $subQuery->whereDate('scheduled_date', '=', now()->toDateString())
                            ->whereTime('start_time', '>=', now()->toTimeString());
                    });
            })
            ->orderBy('scheduled_date', 'asc')
            ->orderBy('start_time', 'asc');
    }
}
