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
        return EngagementPostEventSurveyResponse::query()
            ->where('user_id', $this->user_id)
            ->whereNotNull('submitted_at')
            ->whereHas('survey', fn ($query) => $query
                ->where('reward_challenge_id', $challenge->id))
            ->exists();
    }

    public function canAnswerSurvey(EngagementRewardChallenge $challenge): bool
    {
        if (! $challenge->survey_required || $challenge->start_date->gt(now()->startOfDay())) {
            return false;
        }

        // The survey comes before proof submission; only team-submission members
        // are excluded because their leader answers on the team's behalf.
        return ! $this->isActiveTeamSubmissionMember($challenge);
    }

    public function hasIndividualSubmission(): bool
    {
        if ($this->required_days !== null) {
            return $this->dailyLogs()->whereNull('team_submission_id')->exists();
        }

        if ($this->submission_path === null) {
            return false;
        }

        return ! EngagementRewardChallengeTeamSubmission::query()
            ->where('reward_challenge_id', $this->reward_challenge_id)
            ->where('submission_path', $this->submission_path)
            ->where(fn ($query) => $query
                ->where('leader_id', $this->user_id)
                ->orWhereHas('members', fn ($members) => $members->where('user_id', $this->user_id)))
            ->exists();
    }

    public function hasTeamSubmission(): bool
    {
        return EngagementRewardChallengeTeamSubmission::query()
            ->where('reward_challenge_id', $this->reward_challenge_id)
            ->whereIn('status', ['submitted', 'approved'])
            ->where(fn ($query) => $query
                ->where('leader_id', $this->user_id)
                ->orWhereHas('members', fn ($members) => $members->where('user_id', $this->user_id)))
            ->exists();
    }

    private function hasActiveTeamSubmissionAsLeader(EngagementRewardChallenge $challenge): bool
    {
        return EngagementRewardChallengeTeamSubmission::query()
            ->where('reward_challenge_id', $challenge->id)
            ->where('leader_id', $this->user_id)
            ->whereIn('status', ['submitted', 'approved'])
            ->exists();
    }

    private function isActiveTeamSubmissionMember(EngagementRewardChallenge $challenge): bool
    {
        return $this->teamSubmissionMembers()
            ->whereHas('submission', fn ($query) => $query
                ->where('reward_challenge_id', $challenge->id)
                ->whereIn('status', ['submitted', 'approved']))
            ->exists();
    }

    protected $fillable = [
        'reward_challenge_id',
        'user_id',
        'status',
        'joined_at',
        'submission_path',
        'submission_media',
        'challenge_description',
        'submitted_at',
        'reviewed_at',
        'reviewed_by',
        'review_note',
        'points_awarded',
        'bonus_points',
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
            'bonus_points' => 'integer',
            'required_days' => 'integer',
            'completed_days' => 'integer',
            'proof_approved_at' => 'datetime',
            'survey_points_awarded' => 'integer',
            'survey_rewarded_at' => 'datetime',
            'submission_media' => 'array',
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

    public function teamSubmissionMembers(): HasMany
    {
        return $this->hasMany(EngagementRewardChallengeTeamSubmissionMember::class, 'participant_id');
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
            && $this->dailyLogs()
                ->whereNull('team_submission_id')
                ->where('status', 'approved')
                ->count() >= $this->required_days;
    }
}
