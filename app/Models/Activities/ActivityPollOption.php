<?php

namespace App\Models\Activities;

use Illuminate\Database\Eloquent\Model;

class ActivityPollOption extends Model
{
    protected $fillable = [
        'activity_post_id',
        'label',
        'sort_order',
    ];

    public function post()
    {
        return $this->belongsTo(ActivityPost::class, 'activity_post_id');
    }

    public function votes()
    {
        return $this->hasMany(ActivityPollVote::class, 'activity_poll_option_id');
    }
}
