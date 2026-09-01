<?php

namespace App\Models;

use App\Models\Account\AccountEmployee;
use App\Models\EcfTier;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Account extends Model
{
    protected $fillable = [
        'name',
    ];

    public function ecfs(): HasMany
    {
        return $this->hasMany(EcfTier::class, 'account_id', 'id');
    }

    public function employees(): HasMany
    {
        return $this->hasMany(AccountEmployee::class, 'account_id', 'id');
    }
}
