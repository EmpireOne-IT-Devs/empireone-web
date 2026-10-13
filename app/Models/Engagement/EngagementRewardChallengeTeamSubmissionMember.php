<?php

namespace App\Models\Engagement;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EngagementRewardChallengeTeamSubmissionMember extends Model
{
    protected $table = 'engagement_reward_challenge_team_submission_members';

    protected $fillable = [
        'team_submission_id',
        'participant_id',
        'user_id',
        'full_name',
        'eoid',
        'department_id',
        'department_name',
        'account_id',
        'account_name',
        'location_id',
    ];

    public function submission(): BelongsTo
    {
        return $this->belongsTo(EngagementRewardChallengeTeamSubmission::class, 'team_submission_id');
    }

    public function participant(): BelongsTo
    {
        return $this->belongsTo(EngagementRewardChallengeParticipant::class, 'participant_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
