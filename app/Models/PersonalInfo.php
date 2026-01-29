<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PersonalInfo extends Model
{
    protected $fillable = [
        'app_id',
        'first_name',
        'middle_name',
        'last_name',
        'suffix',
        'gender',
        'date_of_birth',
        'nationality',
        'marital_status',
        'phone_number',
        'province',
        'city',
        'barangay',
        'street',
        'zip_code',
        'emergency_contact_name',
        'emergency_contact_number',
        'emergency_contact_relationship',
    ];
}
