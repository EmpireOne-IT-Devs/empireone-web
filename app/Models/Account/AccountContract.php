<?php

namespace App\Models\Account;

use Illuminate\Database\Eloquent\Model;

class AccountContract extends Model
{
    protected $fillable = [
        'user_id',
        'employee_name',
        'employer_name',
        'contract_signed_at',
        'residence',
        'province',
        'full_address',
        'position',
        'started_at',
        'ended_at',
        'salary',
    ];
}
