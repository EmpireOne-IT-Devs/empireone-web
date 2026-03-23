<?php

namespace App\Models\Account;

use Illuminate\Database\Eloquent\Model;

class AccountEmployeeAllowance extends Model
{
    protected $fillable = [
        'user_id',
        'job_offer_id',
        'allowance',
        'allowance_type',
        'status',
    ];
}
