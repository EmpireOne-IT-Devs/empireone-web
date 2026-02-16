<?php

namespace App\Models\Account;

use Illuminate\Database\Eloquent\Model;

class AccountSkills extends Model
{
    protected $fillable = [
        'user_id',
        'skill',
        'percentage',
    ];
}
