<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ESignature extends Model
{
    protected $fillable = [
        'app_id',
        'signature',
    ];
}
