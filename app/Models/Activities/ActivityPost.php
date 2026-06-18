<?php

namespace App\Models\Activities;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class ActivityPost extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'headline',
        'message',
        'month',
        'year',
        'publish_to',
        'scheduled_at',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
            'published_at' => 'datetime',
            'year'         => 'integer',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
