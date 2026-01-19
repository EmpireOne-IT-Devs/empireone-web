<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobPosting extends Model
{
    protected $fillable = [
        'title',
        'department',
        'location',
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
