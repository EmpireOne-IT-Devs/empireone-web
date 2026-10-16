<?php

namespace App\Models\Account;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

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
    public function account(): HasOne
    {
        return $this->hasOne(AccountEmployee::class, 'user_id', 'user_id')->with(['personal_information']);
    }
}
