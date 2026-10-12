<?php

namespace App\Policies;

use App\Models\Engagement\EngagementPostEventSurvey;
use App\Models\Engagement\EngagementRewardChallengeParticipant;
use App\Models\User;

class ChallengeSurveyPolicy
{
    public function view(User $user, EngagementPostEventSurvey $survey): bool
    {
        return $survey->reward_challenge_id !== null
            && $survey->challenge?->survey_required
            && EngagementRewardChallengeParticipant::query()
                ->where('reward_challenge_id', $survey->reward_challenge_id)
                ->where('user_id', $user->id)
                ->exists();
    }

    public function submit(User $user, EngagementPostEventSurvey $survey): bool
    {
        return $this->view($user, $survey);
    }
}
