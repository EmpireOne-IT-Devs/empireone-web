<?php

namespace App\Models\Jobs;

use Illuminate\Database\Eloquent\Model;

class JobOffer extends Model
{
    protected $fillable = [
        'user_id',
        'job_application_id',
        'salary',
        'declined_reason',
        'role',
        'status',
    ];
}
