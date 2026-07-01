<?php

namespace App\Models\Activities;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class PostEventSurveyResponse extends Model
{
    protected $fillable = [
        'post_event_survey_id',
        'user_id',
        'submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'submitted_at' => 'datetime',
        ];
    }

    public function survey()
    {
        return $this->belongsTo(PostEventSurvey::class, 'post_event_survey_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function answers()
    {
        return $this->hasMany(PostEventSurveyResponseAnswer::class, 'post_event_survey_response_id');
    }
}
