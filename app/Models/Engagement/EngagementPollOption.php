<?php

namespace App\Models\Engagement;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class EngagementPollOption extends Model
{
    protected $fillable = [
        'engagement_post_event_id',
        'label',
        'sort_order',
    ];

    public function post()
    {
        return $this->belongsTo(EngagementPostEvent::class, 'engagement_post_event_id');
    }

    public function votes()
    {
        return $this->hasMany(EngagementPollVote::class, 'engagement_poll_option_id');
    }
}
