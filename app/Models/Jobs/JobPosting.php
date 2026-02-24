<?php

namespace App\Models\Jobs;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class JobPosting extends Model
{
    protected $fillable = [
        'job_requisition_id',
        'user_id',
        'application_deadline',
        'experience_required',
        'education_required',
        'target_audience',
        'status',
    ];

    public function job_requisition(): HasOne
    {
        return $this->hasOne(JobRequisition::class, 'id', 'job_requisition_id')->with(['location','department']);
    }
}
