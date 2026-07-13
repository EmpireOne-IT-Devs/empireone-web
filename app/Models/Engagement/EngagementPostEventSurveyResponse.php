<?php

namespace App\Models\Engagement;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class EngagementPostEventSurveyResponse extends Model
{
    protected $fillable = [
        'engagement_post_event_survey_id',
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
        return $this->belongsTo(EngagementPostEventSurvey::class, 'engagement_post_event_survey_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function answers()
    {
        return $this->hasMany(EngagementPostEventAnswer::class, 'engagement_post_event_survey_response_id');
    }
}
