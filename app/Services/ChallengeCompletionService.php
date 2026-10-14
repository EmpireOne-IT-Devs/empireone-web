<?php

namespace App\Services;

use App\Models\Engagement\EngagementRewardChallengeParticipant;
use Illuminate\Support\Facades\DB;

class ChallengeCompletionService
{
    public function finalizeLocked(EngagementRewardChallengeParticipant $participant): bool
    {
        if (DB::transactionLevel() === 0) {
            throw new \LogicException('Challenge completion requires a transaction and a locked participant.');
        }

        $participant->loadMissing(['challenge' => fn ($query) => $query->withTrashed()]);
        $challenge = $participant->challenge;
        abort_unless($challenge, 422, 'The challenge for this submission no longer exists.');

        if ($participant->status === 'approved') {
            return true;
        }

        $proofApproved = $participant->required_days !== null
            ? $participant->isDailyChallengeComplete()
            : $participant->proof_approved_at !== null;

        if (! $proofApproved) {
            return false;
        }

        if ($challenge->survey_required && ! $participant->hasCompletedSurvey($challenge)) {
            $participant->update(['status' => 'pending_survey']);

            return false;
        }

        $participant->update([
            'status' => 'approved',
            'points_awarded' => $participant->teamSubmissionMembers()->exists()
                ? 0
                : $challenge->points,
        ]);

        return true;
    }
}
