<?php

namespace App\Models\Activities;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class ActivityPostReaction extends Model
{
    protected $fillable = ['activity_post_id', 'user_id', 'type'];

    public function post()
    {
        return $this->belongsTo(ActivityPost::class, 'activity_post_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
