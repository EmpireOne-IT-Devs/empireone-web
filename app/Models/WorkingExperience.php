<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkingExperience extends Model
{
    protected $fillable = [
        'app_id',
        'company_name',
        'position',
        'start_date',
        'end_date',
        'job_description',
    ];
}
