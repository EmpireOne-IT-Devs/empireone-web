<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobRequisition extends Model
{
    protected $fillable = [
        'position_type',
        'position_title',
        'department',
        'location',
        'employment_type',
        'number_of_positions',
        'priority',
        'salary_range',
        'target_start_date',
        'justification_for_position',
        'required_qualifications',
        'key_responsibilities',
    ];
}
