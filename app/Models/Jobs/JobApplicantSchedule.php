<?php

namespace App\Models\Jobs;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class JobApplicantSchedule extends Model
{
    protected $fillable = [
        'application_id',
        'interviewer_id',
        'google_calendar_event_id',
        'scheduled_date',
        'start_time',
        'end_time',
        'meeting_link',
        'status'
    ];

    public function application(): HasOne
    {
        return $this->hasOne(JobApplication::class, 'id', 'application_id')->with(['applicant','job_posting']);
    }
    public function interviewer(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'interviewer_id');
    }
}
