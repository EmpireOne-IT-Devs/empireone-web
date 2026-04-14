<?php

namespace App\Models\Jobs;

use App\Models\Account;
use App\Models\Department;
use App\Models\Location;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class JobRequisition extends Model
{

    protected $fillable = [
        'department_id',
        'user_id',
        'location_id',
        'account_id',
        'site_id',
        'recruiter_id',
        'type',
        'title',
        'employment_type',
        'number_of_positions',
        'priority',
        'salary_range',
        'target_start_date',
        'interviewer',
        'sub_interviewer',
        'interview_date',
        'interview_time',
        'justification_for_position',
        'qualifications',
        'responsibilities',
        'status'
    ];

    protected $casts = [
        'target_start_date' => 'date',
        'interview_date' => 'date',
        'number_of_positions' => 'integer',
    ];

    public function recruiter(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'recruiter_id');
    }
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }
    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'user_id')->with(['personal_information']);
    }
    public function job_posting(): HasOne
    {
        return $this->hasOne(JobPosting::class, 'job_requisition_id', 'id');
    }
    public function logs(): HasMany
    {
        return $this->hasMany(JobRequisitionLog::class, 'job_requisitions_id', 'id')->with(['user']);
    }
    public function account(): HasOne
    {
        return $this->hasOne(Account::class, 'id', 'account_id');
    }
}
