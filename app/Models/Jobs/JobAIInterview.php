<?php

namespace App\Models\Jobs;

use App\Models\Account\AccountPersonalInformation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class JobAIInterview extends Model
{
    protected $fillable = [
        'user_id',
        'job_title',
        'questions_limit',
        'current_step',
        'status'
    ];
    public function applicant(): HasOne
    {
        return $this->hasOne(AccountPersonalInformation::class, 'user_id', 'user_id')->with(['user']);
    }
    public function answers(): HasMany
    {
        return $this->hasMany(JobAIInterviewQna::class, 'job_a_i_interview_id', 'id');
    }
}
