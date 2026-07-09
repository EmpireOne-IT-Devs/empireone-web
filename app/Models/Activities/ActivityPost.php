<?php

namespace App\Models\Activities;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
class ActivityPost extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'category',
        'headline',
        'message',
        'media_path',
        'media_type',
        'month',
        'year',
        'publish_to',
        'scheduled_at',
        'published_at',
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

    public function pollOptions()
    {
        return $this->hasMany(ActivityPollOption::class, 'activity_post_id')
            ->orderBy('sort_order');
    }

    public function pollVotes()
    {
        return $this->hasMany(ActivityPollVote::class, 'activity_post_id');
    }

    public function reactions()
    {
        return $this->hasMany(ActivityPostReaction::class, 'activity_post_id');
    }

    public function comments()
    {
        return $this->hasMany(ActivityPostComment::class, 'activity_post_id');
    }
}
