<?php

namespace App\Models\Jobs;

use App\Models\Account\AccountDocument;
use App\Models\Account\AccountPersonalInformation;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Auth;

class JobPosting extends Model
{
    protected $fillable = [
        'job_requisition_id',
        'user_id',
        'target_audience',
        'status',
    ];

    public function job_requisition(): HasOne
    {
        return $this->hasOne(JobRequisition::class, 'id', 'job_requisition_id')->with(['location', 'department', 'user', 'recruiter']);
    }
    public function applications(): HasMany
    {
        return $this->hasMany(JobApplication::class, 'job_posting_id', 'id');
    }
    public function applicant(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }
    public function job_application(): HasOne
    {
        return $this->hasOne(JobApplication::class, 'job_posting_id', 'id')->with(['job_offers']);
    }
    public function personal_information(): HasOne
    {
        return $this->hasOne(AccountPersonalInformation::class, 'user_id', 'user_id');
    }
}
