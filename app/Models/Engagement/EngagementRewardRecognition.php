<?php

namespace App\Models\Engagement;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class EngagementRewardRecognition extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'employee_id',
        'department_id',
        'account_id',
        'award_category',
        'company_value',
        'message',
        'engagement_post_event_reacts_id',
        'status',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    /**
     * Employee who created the recognition.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Employee being recognized.
     */
    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }
}