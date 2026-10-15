<?php

namespace App\Models\Engagement;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EngagementRewardChallengeDailyLog extends Model
{
    use HasFactory;

    protected $table = 'engagement_reward_challenge_daily_logs';

    protected $fillable = [
        'reward_challenge_participant_id',
        'team_submission_id',
        'log_date',
        'submission_path',
        'submission_media',
        'challenge_description',
        'status',
        'submitted_at',
        'reviewed_at',
        'reviewed_by',
        'review_note',
        'bonus_points',
    ];

    protected function casts(): array
    {
        return [
            'log_date' => 'date',
            'submitted_at' => 'datetime',
            'reviewed_at' => 'datetime',
            'bonus_points' => 'integer',
            'submission_media' => 'array',
        ];
    }

    public function participant(): BelongsTo
    {
        return $this->belongsTo(EngagementRewardChallengeParticipant::class, 'reward_challenge_participant_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function teamSubmission(): BelongsTo
    {
        return $this->belongsTo(EngagementRewardChallengeTeamSubmission::class, 'team_submission_id');
    }
}
