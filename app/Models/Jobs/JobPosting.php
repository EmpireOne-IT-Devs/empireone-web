<?php

namespace App\Models\Jobs;

use Illuminate\Database\Eloquent\Model;

class JobPosting extends Model
{
    protected $fillable = [
        'job_requisition_id',
        'application_deadline',
        'experience_required',
        'education_required',
        'status',
    ];
}
