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
    ];

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
}
