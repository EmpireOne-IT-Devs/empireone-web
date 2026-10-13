<?php

namespace App\Models\Engagement;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EngagementRewardChallengeTeamSubmission extends Model
{
    protected $table = 'engagement_reward_challenge_team_submissions';

    protected $fillable = [
        'reward_challenge_id',
        'leader_id',
        'log_date',
        'submission_path',
        'challenge_description',
        'status',
        'submitted_at',
        'reviewed_at',
        'reviewed_by',
        'review_note',
    ];

    protected function casts(): array
    {
        return [
            'log_date' => 'date',
            'submitted_at' => 'datetime',
            'reviewed_at' => 'datetime',
        ];
    }

    public function challenge(): BelongsTo
    {
        return $this->belongsTo(EngagementRewardChallenge::class, 'reward_challenge_id');
    }

    public function leader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'leader_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function members(): HasMany
    {
        return $this->hasMany(EngagementRewardChallengeTeamSubmissionMember::class, 'team_submission_id');
    }

    public function dailyLogs(): HasMany
    {
        return $this->hasMany(EngagementRewardChallengeDailyLog::class, 'team_submission_id');
    }
}
