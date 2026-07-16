<?php

namespace App\Models\Engagement;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EngagementPostEventFile extends Model
{
    protected $fillable = [
        'engagement_post_event_id',
        'name',
        'url',
    ];

    public function postEvent(): BelongsTo
    {
        return $this->belongsTo(EngagementPostEvent::class, 'engagement_post_event_id');
    }
}