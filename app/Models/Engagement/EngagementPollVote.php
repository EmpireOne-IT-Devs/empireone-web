<?php

namespace App\Models\Engagement;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class EngagementPollVote extends Model
{
    protected $fillable = [
        'engagement_post_event_id',
        'engagement_poll_option_id',
        'user_id',
    ];

    public function post()
    {
        return $this->belongsTo(EngagementPostEvent::class, 'engagement_post_event_id');
    }

    public function option()
    {
        return $this->belongsTo(EngagementPollOption::class, 'engagement_poll_option_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
