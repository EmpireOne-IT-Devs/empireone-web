<?php

namespace App\Models\Activities;

use Illuminate\Database\Eloquent\Model;

class PostEventSurveyQuestionOption extends Model
{
    protected $fillable = [
        'post_event_survey_question_id',
        'option_text',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    public function question()
    {
        return $this->belongsTo(PostEventSurveyQuestion::class, 'post_event_survey_question_id');
    }
}
