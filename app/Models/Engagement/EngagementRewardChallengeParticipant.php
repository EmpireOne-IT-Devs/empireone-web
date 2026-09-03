<?php

namespace App\Models\Engagement;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class EngagementRewardChallengeParticipant extends Pivot
{
    use HasFactory;

    protected $table = 'engagement_reward_challenge_participants';

    public $incrementing = true;

    protected $fillable = [
        'reward_challenge_id',
        'user_id',
        'status',
        'joined_at',
        'submission_path',
        'submitted_at',
        'reviewed_at',
        'reviewed_by',
        'review_note',
        'points_awarded',
    ];

    protected function casts(): array
    {
        return [
            'joined_at' => 'datetime',
            'submitted_at' => 'datetime',
            'reviewed_at' => 'datetime',
            'points_awarded' => 'integer',
        ];
    }

    public function challenge(): BelongsTo
    {
        return $this->belongsTo(EngagementRewardChallenge::class, 'reward_challenge_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
