<?php

namespace App\Models\Activities;

use Illuminate\Database\Eloquent\Model;

class PostEventSurveyQuestion extends Model
{
    protected $fillable = [
        'post_event_survey_id',
        'question_text',
        'question_type',
        'is_required',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_required' => 'boolean',
            'sort_order'  => 'integer',
        ];
    }

    public function survey()
    {
        return $this->belongsTo(PostEventSurvey::class, 'post_event_survey_id');
    }

    public function options()
    {
        return $this->hasMany(PostEventSurveyQuestionOption::class, 'post_event_survey_question_id')
            ->orderBy('sort_order');
    }
}
