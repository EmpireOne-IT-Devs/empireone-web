<?php

namespace App\Models\Jobs;

use App\Models\Account\AccountDocument;
use App\Models\Account\AccountEmployee;
use App\Models\Account\AccountEmployeeAllowance;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class JobOffer extends Model
{
    protected $fillable = [
        'user_id',
        'job_application_id',
        'salary',
        'declined_reason',
        'role',
        'status',
    ];

    public function job_application(): HasOne
    {
        return $this->hasOne(JobApplication::class, 'id', 'job_application_id')->with(['job_posting']);
    }
    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'user_id')->with(['personal_information']);
    }
     public function employee(): HasOne
    {
        return $this->hasOne(AccountEmployee::class, 'id', 'user_id');
    }
    public function allowances(): HasMany
    {
        return $this->hasMany(AccountEmployeeAllowance::class, 'job_offer_id', 'id');
    }
     public function documents(): HasMany
    {
        return $this->hasMany(AccountDocument::class, 'user_id', 'user_id');
    }
}
