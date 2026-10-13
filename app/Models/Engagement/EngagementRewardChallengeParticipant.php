<?php

namespace App\Models\Engagement;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\Pivot;

class EngagementRewardChallengeParticipant extends Pivot
{
    use HasFactory;

    protected $table = 'engagement_reward_challenge_participants';

    public $incrementing = true;

    public const TOTAL_POINTS_SQL = "(CASE WHEN status = 'approved' THEN COALESCE(points_awarded, 0) ELSE 0 END + COALESCE(survey_points_awarded, 0))";

    public function getTotalPointsAwardedAttribute(): int
    {
        return ($this->status === 'approved' ? (int) $this->points_awarded : 0)
            + (int) $this->survey_points_awarded;
    }

    public function hasCompletedSurvey(EngagementRewardChallenge $challenge): bool
    {
        return $this->surveyResponse()
            ->where('user_id', $this->user_id)
            ->whereNotNull('submitted_at')
            ->whereHas('survey', fn ($query) => $query->where('reward_challenge_id', $challenge->id))
            ->exists();
    }

    public function canAnswerSurvey(EngagementRewardChallenge $challenge): bool
    {
        if (! $challenge->survey_required || $challenge->start_date->gt(now()->startOfDay())) {
            return false;
        }

        return $this->required_days !== null
            ? $this->isDailyChallengeComplete()
            : ($this->submitted_at !== null
                && in_array($this->status, ['submitted', 'pending_survey', 'approved'], true));
    }

    protected $fillable = [
        'reward_challenge_id',
        'user_id',
        'status',
        'joined_at',
        'submission_path',
        'challenge_description',
        'submitted_at',
        'reviewed_at',
        'reviewed_by',
        'review_note',
        'points_awarded',
        'required_days',
        'completed_days',
        'proof_approved_at',
        'survey_points_awarded',
        'survey_rewarded_at',
    ];

    protected function casts(): array
    {
        return [
            'joined_at' => 'datetime',
            'submitted_at' => 'datetime',
            'reviewed_at' => 'datetime',
            'points_awarded' => 'integer',
            'required_days' => 'integer',
            'completed_days' => 'integer',
            'proof_approved_at' => 'datetime',
            'survey_points_awarded' => 'integer',
            'survey_rewarded_at' => 'datetime',
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

    public function dailyLogs(): HasMany
    {
        return $this->hasMany(EngagementRewardChallengeDailyLog::class, 'reward_challenge_participant_id');
    }

    public function surveyResponse(): HasOne
    {
        return $this->hasOne(EngagementPostEventSurveyResponse::class, 'reward_challenge_participant_id');
    }

    /**
     * True once the employee has logged enough approved days for a
     * multi-day challenge (or, for single-proof challenges, once approved).
     */
    public function isDailyChallengeComplete(): bool
    {
        return $this->required_days !== null
            && $this->required_days > 0
            && $this->completed_days >= $this->required_days;
    }
}
