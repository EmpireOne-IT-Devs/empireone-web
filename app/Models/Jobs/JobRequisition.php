<?php

namespace App\Models\Jobs;

use App\Models\Account;
use App\Models\Department;
use App\Models\Location;
use App\Models\User;
use App\Models\Site;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class JobRequisition extends Model
{
    protected $fillable = [
        // Foreign Keys
        'department_id',
        'user_id',
        'location_id',
        'account_id',
        'site_id',
        'recruiter_id',
        'existing_position_id',
        'interviewers', // JSON Array of User IDs

        //approver
        'approver1_id',
        'approver2_id',
        'approver3_id',

        // Job Details
        'type',
        'title',
        'employment_type',
        'number_of_positions',
        'priority',
        'salary_range',
        'target_start_date',

        // Classifications & Audiences
        'erf_classification',
        'target_audience',

        // Interviewer Details
        'interviewer1',
        'availability1',
        'interview_time1',
        'interviewer2',
        'availability2',
        'interview_time2',

        // Text Areas
        'justification_for_position',
        'qualifications',
        'responsibilities',
        'position_level',

        // Status
        'status'
    ];

    protected $casts = [
        'target_start_date' => 'date',
        'number_of_positions' => 'integer',
        'interviewers' => 'array', // 1. Automatically cast the JSON string to a PHP array
    ];
    protected $appends = ['interviewer_users'];
    /*
     * ---------------------------------------------------------
     * Custom Accessor for JSON Relationships
     * ---------------------------------------------------------
     */

    /**
     * Get the User models for the assigned interviewers.
     * Accessible via $jobRequisition->interviewer_users
     */
    public function getInterviewerUsersAttribute()
    {
        // If the JSON column is empty or null, return an empty collection
        if (empty($this->interviewers)) {
            return collect();
        }

        // Fetch all Users whose IDs are inside the interviewers array
        return JobInterviewerSchedule::whereIn('interviewer_id', $this->interviewers)->get();
    }

    /*
     * ---------------------------------------------------------
     * BelongsTo Relationships
     * ---------------------------------------------------------
     */

    public function approver1(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'approver1_id');
    }
    public function approver2(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'approver2_id');
    }
    public function approver3(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'approver3_id');
    }
    public function recruiter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recruiter_id');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id')->with(['personal_information']);
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'account_id');
    }

    /*
     * ---------------------------------------------------------
     * HasOne / HasMany Relationships
     * ---------------------------------------------------------
     */

    public function job_posting(): HasOne
    {
        return $this->hasOne(JobPosting::class, 'job_requisition_id', 'id');
    }

    public function logs(): HasMany
    {
        return $this->hasMany(JobRequisitionLog::class, 'job_requisitions_id', 'id')->with(['user']);
    }
}
