<?php

namespace App\Models\Account;

use Illuminate\Database\Eloquent\Model;

class AccountDocument extends Model
{
    //
 protected $fillable = [
        'user_id',
        'name',
        'status',
        'reason',
        'type',
        'url',
    ];
}
