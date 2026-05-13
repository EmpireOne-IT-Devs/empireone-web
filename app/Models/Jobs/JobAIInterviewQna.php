<?php

namespace App\Models\Jobs;

use Illuminate\Database\Eloquent\Model;

class JobAIInterviewQna extends Model
{
    protected $fillable = [
        'job_a_i_interview_id',
        'answer_video_url',
        'question',
        'user_answer'
    ];
}
