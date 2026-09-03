<?php

namespace App\Models\Jobs;

use App\Models\Account;
use App\Models\Account\AccountEmployee;
use App\Models\Account\AccountPersonalInformation;
use App\Models\ER\EREmployeeChangeForm;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class JobApplication extends Model
{
    protected $fillable = [
        'user_id',
        'interviewer_id',
        'job_posting_id',
        'removed_by',
        'transferred_to',
        'threadId',
        'screening_status',
        'interview_status',
        'final_status',
        'referral_id',
        'source',
        'interview_type'
    ];

    public function referral(): HasOne
    {
        return $this->hasOne(AccountPersonalInformation::class, 'user_id', 'referral_id');
    }

    public function employee(): HasOne
    {
        return $this->hasOne(AccountEmployee::class, 'user_id', 'referral_id')->with(['department', 'account']);
    }

    public function applicants(): HasMany
    {
        return $this->hasMany(JobPosting::class, 'id', 'job_posting_id')->with(['applicant', 'personal_information', 'job_requisition']);
    }
    public function schedule(): HasOne
    {
        return $this->hasOne(JobApplicantSchedule::class, 'application_id', 'id');
    }
    public function applicant(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'user_id')->with(['personal_information', 'cover_letter', 'resume', 'account_employee', 'working_experience', 'skills']);
    }
    public function personal_information(): HasOne
    {
        return $this->hasOne(AccountPersonalInformation::class, 'user_id', 'user_id');
    }
    public function change_form(): HasOne
    {
        return $this->hasOne(EREmployeeChangeForm::class, 'job_application_id', 'id');
    }
    public function job_posting(): HasOne
    {
        return $this->hasOne(JobPosting::class, 'id', 'job_posting_id')->with(['job_requisition']);
    }
    public function job_offers(): HasMany
    {
        return $this->hasMany(JobOffer::class, 'job_application_id', 'id')->with(['user', 'allowances', 'job_application']);
    }
    public function job_offer(): HasOne
    {
        return $this->hasOne(JobOffer::class, 'user_id', 'user_id')->orderBy('id', 'desc')->with(['allowances']);
    }
    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'user_id')->with(['account_employee']);
    }
}
