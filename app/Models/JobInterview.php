<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobInterview extends Model
{
    protected $fillable = [
        'job_title',
        'questions_limit',
        'current_step',
        'status'
    ];
}
