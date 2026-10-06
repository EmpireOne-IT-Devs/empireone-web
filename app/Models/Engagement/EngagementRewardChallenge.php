<?php

namespace App\Models\Engagement;

use App\Models\Account;
use App\Models\Department;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class EngagementRewardChallenge extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'engagement_reward_challenges';

    protected $fillable = [
        'created_by',
        'title',
        'description',
        'type',
        'category',
        'points',
        'duration_days',
        'banner_path',
        'banner_position_x',
        'banner_position_y',
        'all_employees',
        'max_participants',
        'start_date',
        'deadline',
        'card_color',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'points' => 'integer',
            'duration_days' => 'integer',
            'banner_position_x' => 'integer',
            'banner_position_y' => 'integer',
            'all_employees' => 'boolean',
            'max_participants' => 'integer',
            'start_date' => 'date',
            'deadline' => 'date',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function accounts(): BelongsToMany
    {
        return $this->belongsToMany(
            Account::class,
            'engagement_account_reward_challenge',
            'reward_challenge_id',
            'account_id',
        )->withTimestamps();
    }

    public function departments(): BelongsToMany
    {
        return $this->belongsToMany(
            Department::class,
            'engagement_department_reward_challenge',
            'reward_challenge_id',
            'department_id',
        )->withTimestamps();
    }

    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            'engagement_reward_challenge_participants',
            'reward_challenge_id',
            'user_id',
        )
            ->using(EngagementRewardChallengeParticipant::class)
            ->withPivot(['id', 'status', 'joined_at', 'submission_path', 'challenge_description', 'submitted_at', 'reviewed_at', 'reviewed_by', 'review_note', 'points_awarded', 'required_days', 'completed_days'])
            ->withTimestamps();
    }

    public function isEligibleForEmployee(?int $departmentId, ?int $accountId): bool
    {
        if ($this->all_employees) {
            return true;
        }

        return ($departmentId && $this->departments->contains('id', $departmentId))
            || ($accountId && $this->accounts->contains('id', $accountId));
    }

    /**
     * Multi-day challenges let an employee submit one proof per calendar day
     * instead of a single one-off submission.
     */
    public function isDailyChallenge(): bool
    {
        return (int) $this->duration_days > 1;
    }

    /**
     * Last calendar day an employee may still submit a daily proof —
     * whichever comes first between the challenge's own day count and its
     * overall deadline.
     */
    public function dailyWindowEndDate(): \Illuminate\Support\Carbon
    {
        $byDuration = $this->start_date->copy()->addDays(max(0, (int) $this->duration_days - 1));

        return $byDuration->lt($this->deadline) ? $byDuration : $this->deadline->copy();
    }
}