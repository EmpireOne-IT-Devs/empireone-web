<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EcfTier extends Model
{

    protected $fillable = [
        'account_id',
        'name',
        'original',
        'role',
        'responsibility',
        'payout_details',
        'amount'
    ];
}
