<?php

namespace App\Models\Engagement;

use Illuminate\Database\Eloquent\Model;

class EngagementPostEventComment extends Model
{
    protected $fillable = [
        'engagement_post_event_id',
        'user_id',
        'comment',
    ];

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }
}
