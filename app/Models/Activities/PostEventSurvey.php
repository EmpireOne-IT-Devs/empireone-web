<?php

namespace App\Models\Activities;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class PostEventSurvey extends Model
{
    protected $fillable = [
        'activity_post_id',
        'user_id',
        'title',
        'description',
        'status',
        'published_at',
        'closed_at',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'closed_at'    => 'datetime',
            'is_required'  => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function activityPost()
    {
        return $this->belongsTo(ActivityPost::class, 'activity_post_id');
    }

    public function questions()
    {
        return $this->hasMany(PostEventSurveyQuestion::class, 'post_event_survey_id')
            ->orderBy('sort_order');
    }
}
