<?php

namespace App\Models\Account;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class AccountAccess extends Model
{
    protected $fillable = [
        'user_id',
        'order',
        'type'
    ];
     public function user():HasOne
    {
        return $this->hasOne(User::class, 'id', 'user_id')->with(['account_employee']);
    }
}
