<?php

namespace App\Models\Jobs;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class JobApplication extends Model
{
    protected $fillable = [
        'user_id',
        'job_posting_id',
        'status'
    ];



    public function applicants(): HasMany
    {
        return $this->hasMany(JobPosting::class, 'id', 'job_posting_id')->with(['applicant', 'personal_information']);
    }
    public function job_posting(): HasOne
    {
        return $this->hasOne(JobPosting::class, 'id', 'job_posting_id')->with(['job_requisition']);
    }
}
