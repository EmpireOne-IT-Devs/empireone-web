<?php

namespace App\Models\Engagement;

use Illuminate\Database\Eloquent\Model;

class EngagementPostEventQuestionOption extends Model
{
    protected $fillable = [
        'engagement_post_event_question_id',
        'option_text',
        'sort_order',
    ];

    public function question()
    {
        return $this->belongsTo(EngagementPostEventQuestion::class, 'engagement_post_event_question_id');
    }
}
