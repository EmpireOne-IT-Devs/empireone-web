<?php

namespace App\Models\Engagement;

use Illuminate\Database\Eloquent\Model;

class EngagementPostEventSurvey extends Model
{
    protected $fillable = [
        'engagement_post_event_id',
        'user_id',
        'title',
        'description',
        'status',
        'published_at',
        'closed_at',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'closed_at'    => 'datetime',
        ];
    }

    public function post()
    {
        return $this->belongsTo(EngagementPostEvent::class, 'engagement_post_event_id');
    }

    public function questions()
    {
        return $this->hasMany(EngagementPostEventQuestion::class, 'engagement_post_event_survey_id')
            ->orderBy('sort_order');
    }

    public function responses()
    {
        return $this->hasMany(EngagementPostEventSurveyResponse::class, 'engagement_post_event_survey_id');
    }
}
