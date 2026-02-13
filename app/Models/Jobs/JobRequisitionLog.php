<?php

namespace App\Models\Jobs;

use Illuminate\Database\Eloquent\Model;

class JobRequisitionLog extends Model
{
    //

    protected $fillable = [
        'job_requisitions_id',
        'user_id',
        'notes',
    ];
}
