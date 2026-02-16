<?php

namespace App\Models\Account;

use Illuminate\Database\Eloquent\Model;

class AccountWorkingExperience extends Model
{
    protected $fillable = [
        'user_id',
        'company_name',
        'position',
        'start_date',
        'end_date',
        'job_description',
        'status',
    ];
}
