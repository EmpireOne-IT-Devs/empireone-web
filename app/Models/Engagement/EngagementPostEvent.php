<?php

namespace App\Models\Engagement;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class EngagementPostEvent extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'content',
        'category',
        'type',
        'headline',
        'message',
        'media_path',
        'media_type',
        'month',
        'year',
        'publish_to',
        'scheduled_at',
        'published_at',
        'drive_link', 
        'closed_at',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
            'published_at' => 'datetime',
            'closed_at'    => 'datetime',
            'year'         => 'integer',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function files()
    {
        return $this->hasMany(EngagementPostEventFile::class);
    }

    public function comments()
    {
        return $this->hasMany(EngagementPostEventComment::class);
    }

    public function reactions()
    {
        return $this->hasMany(EngagementPostEventReact::class);
    }

    public function pollOptions()
    {
        return $this->hasMany(EngagementPollOption::class, 'engagement_post_event_id')
            ->orderBy('sort_order');
    }

    public function pollVotes()
    {
        return $this->hasMany(EngagementPollVote::class, 'engagement_post_event_id');
    }
}
