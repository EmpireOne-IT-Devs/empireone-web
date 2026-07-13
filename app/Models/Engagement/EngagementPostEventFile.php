<?php

namespace App\Models\Engagement;

use Illuminate\Database\Eloquent\Model;

class EngagementPostEventFile extends Model
{
    protected $fillable = [
        'engagement_post_event_id',
        'name',
        'url',
    ];
}
