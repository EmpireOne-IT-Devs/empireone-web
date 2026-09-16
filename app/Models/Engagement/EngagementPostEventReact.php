<?php

namespace App\Models\Engagement;

use Illuminate\Database\Eloquent\Model;

class EngagementPostEventReact extends Model
{
    protected $fillable = [
        'engagement_post_event_id',
        'engagement_reward_recognition_id',
        'user_id',
        'react',
    ];

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function rewardRecognition()
    {
        return $this->belongsTo(EngagementRewardRecognition::class, 'engagement_reward_recognition_id');
    }
}
