<?php

namespace App\Models\Activities;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class ActivityPollVote extends Model
{
    protected $fillable = [
        'activity_post_id',
        'activity_poll_option_id',
        'user_id',
    ];

    public function post()
    {
        return $this->belongsTo(ActivityPost::class, 'activity_post_id');
    }

    public function option()
    {
        return $this->belongsTo(ActivityPollOption::class, 'activity_poll_option_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
