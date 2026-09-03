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
        'banner_path',
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
            ->withPivot(['status', 'joined_at', 'submission_path', 'submitted_at', 'reviewed_at', 'reviewed_by', 'review_note'])
            ->withTimestamps();
    }

    /**
     * Whether an employee (identified by their department/account) can join this challenge.
     */
    public function isEligibleForEmployee(?int $departmentId, ?int $accountId): bool
    {
        if ($this->all_employees) {
            return true;
        }

        return ($departmentId && $this->departments->contains('id', $departmentId))
            || ($accountId && $this->accounts->contains('id', $accountId));
    }
}