<?php

namespace App\Models\Jobs;

use Illuminate\Database\Eloquent\Model;

class JobPosting extends Model
{
    protected $fillable = [
        'title',
        'department',
        'location_id',
        'site_id',
        'employment_type',
        'salary',
        'status',
        'application_deadline',
        'description',
        'requirements',
        'experience_required',
        'education_required',
    ];
}
