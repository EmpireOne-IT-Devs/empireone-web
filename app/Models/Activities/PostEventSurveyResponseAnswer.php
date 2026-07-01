<?php

namespace App\Models\Activities;

use Illuminate\Database\Eloquent\Model;

class PostEventSurveyResponseAnswer extends Model
{
    protected $fillable = [
        'post_event_survey_response_id',
        'post_event_survey_question_id',
        'answer_text',
    ];

    public function response()
    {
        return $this->belongsTo(PostEventSurveyResponse::class, 'post_event_survey_response_id');
    }

    public function question()
    {
        return $this->belongsTo(PostEventSurveyQuestion::class, 'post_event_survey_question_id');
    }
}
