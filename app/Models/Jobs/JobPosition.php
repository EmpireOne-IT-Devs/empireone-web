<?php

namespace App\Models\Jobs;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class JobPosition extends Model
{
    protected $fillable = [
        'title',
        'department_id',
    ];

    public function job_requisition(): HasOne
    {
        return $this->hasOne(JobRequisition::class, 'title', 'title');
    }
}
