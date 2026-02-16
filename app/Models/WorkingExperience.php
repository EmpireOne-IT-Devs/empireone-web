<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkingExperience extends Model
{
    protected $fillable = [
        'user_id',
        'company_name',
        'position',
        'start_date',
        'end_date',
        'job_description',
        'status',
    ];
}
