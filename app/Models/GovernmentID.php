<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GovernmentID extends Model
{
    protected $fillable = [
        'app_id',
        'id_type',
        'id_number',
    ];
}
