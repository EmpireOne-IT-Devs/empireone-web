<?php

namespace App\Models\EmpireOneHealth;

use Illuminate\Database\Eloquent\Model;

class EmpireOneHealthBooking extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'notes',
    ];
}
