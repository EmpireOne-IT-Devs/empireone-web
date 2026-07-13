<?php

namespace App\Models\Engagement;

use Illuminate\Database\Eloquent\Model;

class EngagementPostEventQuestion extends Model
{
    protected $fillable = [
        'engagement_post_event_id',
        'engagement_post_event_survey_id',
        'user_id',
        'question',
        'choices',
        'type',
        'is_required',
        'sort_order',
    ];

    public function survey()
    {
        return $this->belongsTo(EngagementPostEventSurvey::class, 'engagement_post_event_survey_id');
    }

    public function options()
    {
        return $this->hasMany(EngagementPostEventQuestionOption::class, 'engagement_post_event_question_id')
            ->orderBy('sort_order');
    }

    public function answers()
    {
        return $this->hasMany(EngagementPostEventAnswer::class, 'engagement_post_event_question_id');
    }
}
