<?php

namespace App\Models\Jobs;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class JobApplication extends Model
{
    protected $fillable = [
        'user_id',
        'job_posting_id',
        'transferred_to',
        'threadId',
        'screening_status',
        'interview_status',
        'final_status',
        'referral_id',
        'source',
    ];

    public function applicants(): HasMany
    {
        return $this->hasMany(JobPosting::class, 'id', 'job_posting_id')->with(['applicant', 'personal_information', 'job_requisition']);
    }
    public function applicant(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'user_id')->with(['personal_information', 'cover_letter', 'resume', 'account_employee', 'working_experience', 'skills']);
    }
    public function job_posting(): HasOne
    {
        return $this->hasOne(JobPosting::class, 'id', 'job_posting_id')->with(['job_requisition']);
    }
    public function job_offers(): HasMany
    {
        return $this->hasMany(JobOffer::class, 'job_application_id', 'id')->with(['user', 'allowances', 'job_application']);
    }
}
