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

    protected $table = 'reward_challenges';

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
            'account_reward_challenge',
            'reward_challenge_id',
            'account_id',
        )->withTimestamps();
    }

    public function departments(): BelongsToMany
    {
        return $this->belongsToMany(
            Department::class,
            'department_reward_challenge',
            'reward_challenge_id',
            'department_id',
        )->withTimestamps();
    }
}