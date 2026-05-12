<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobInterviewQnas extends Model
{
    protected $fillable = [
        'interview_id',
        'answer_audio_url',
        'question',
        'user_answer'
    ];
}
