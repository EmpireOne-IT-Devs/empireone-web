<?php

namespace App\Models\Jobs;

use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    protected $fillable = [
        'user_id',
        'job_posting_id',
        'status'
    ];
}
