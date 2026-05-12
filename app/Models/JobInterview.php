<?php

namespace App\Models;

use App\Models\Account\AccountPersonalInformation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class JobInterview extends Model
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
        return $this->hasMany(JobInterviewQnas::class, 'interview_id', 'id');
    }
}
