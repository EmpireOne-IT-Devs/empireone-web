<?php

namespace App\Models\EmpireOneHealth;

use Illuminate\Database\Eloquent\Model;
use App\Models\EmpireOneHealth\EmpireOneHealthBooking;

class EmpireOneHealthAppointmentDetails extends Model
{
    protected $fillable = [
        'appointment_id',
        'company_name',
        'source',
        'looking_for',
        'privacy_policy_agreed',
    ];

    function appointment()
    {
        return $this->hasOne(EmpireOneHealthBooking::class, 'id', 'appointment_id');
    }
}
