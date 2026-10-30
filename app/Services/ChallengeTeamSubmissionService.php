<?php

namespace App\Services;

use App\Models\Account\AccountEmployee;
use App\Models\Account as AccountModel;
use App\Models\Department;
use App\Models\Engagement\EngagementRewardChallenge;
use App\Models\Engagement\EngagementRewardChallengeDailyLog;
use App\Models\Engagement\EngagementRewardChallengeParticipant;
use App\Models\Engagement\EngagementRewardChallengeTeamSubmission;
use App\Models\ER\ERLeader;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Throwable;

class ChallengeTeamSubmissionService
{
    public function submit(
        EngagementRewardChallenge $challenge,
        User $leader,
        array $photos,
        ?UploadedFile $video,
        string $description,
    ): EngagementRewardChallengeTeamSubmission {
        $challenge->load(['departments:id,name', 'accounts:id,name']);
        $today = now()->startOfDay();

        if ($challenge->type !== 'Team') {
            throw ValidationException::withMessages([
                'challenge' => 'Only Team challenges accept team submissions.',
            ]);
        }

        if ($challenge->start_date->gt($today) || $challenge->deadline->lt($today)) {
            throw ValidationException::withMessages([
                'challenge' => 'This challenge is outside its submission window.',
            ]);
        }

        $leaderRecord = ERLeader::query()->where('user_id', $leader->id)->first();
        if (! $leaderRecord) {
            abort(403, 'Only a team leader can submit team challenge proof.');
        }

        if ($challenge->survey_required) {
            $survey = $challenge->survey;
            $leaderParticipant = EngagementRewardChallengeParticipant::query()
                ->where('reward_challenge_id', $challenge->id)
                ->where('user_id', $leader->id)
                ->first();

            if ($survey?->status === 'published'
                && ! ($leaderParticipant?->hasCompletedSurvey($challenge) ?? false)) {
                throw ValidationException::withMessages([
                    'survey' => 'Please answer the challenge survey before submitting team proof.',
                ]);
            }
        }

        $directReportIds = $leaderRecord->subordinates()
            ->pluck('subordinate_id')
            ->merge(AccountEmployee::query()->where('e_r_leader_id', $leaderRecord->id)->pluck('user_id'))
            ->unique()
            ->reject(fn ($id) => (int) $id === (int) $leader->id)
            ->values();

        if ($directReportIds->isEmpty()) {
            throw ValidationException::withMessages([
                'team' => 'Your team has no eligible direct reports to submit for.',
            ]);
        }

        $employees = User::query()
            ->whereIn('id', $directReportIds)
            ->get()
            ->keyBy('id');
        $profiles = AccountEmployee::query()
            ->whereIn('user_id', $directReportIds)
            ->get(['user_id', 'employee_id', 'department_id', 'account_id', 'location_id'])
            ->keyBy('user_id');

        $employees = $employees->filter(function (User $employee) use ($profiles, $challenge) {
            $profile = $profiles->get($employee->id);

            return $profile !== null
                && $challenge->isEligibleForEmployee($profile->department_id, $profile->account_id);
        });

        if ($employees->isEmpty()) {
            throw ValidationException::withMessages([
                'team' => 'No direct reports are eligible for this challenge.',
            ]);
        }

        $profiles = $profiles->filter(fn (AccountEmployee $profile, $userId) => $employees->has($userId));

        $departmentNames = Department::query()
            ->whereIn('id', $profiles->pluck('department_id')->filter()->unique())
            ->pluck('name', 'id');
        $accountNames = AccountModel::query()
            ->whereIn('id', $profiles->pluck('account_id')->filter()->unique())
            ->pluck('name', 'id');
        $logDate = $today->toDateString();
        if ($challenge->isDailyChallenge() && $today->gt($challenge->dailyWindowEndDate())) {
            throw ValidationException::withMessages([
                'challenge' => 'Today is outside this challenge\'s submission window.',
            ]);
        }

        $files = array_filter($video ? [$video] : $photos);
        $media = [];

        try {
            foreach ($files as $file) {
                $path = $file->store('unified/engagement/reward_challenges/submissions', 's3');
                if (! $path) {
                    throw new \RuntimeException('Unable to store challenge proof media in Amazon S3.');
                }
                $media[] = [
                    'path' => $path,
                    'type' => $video ? 'video' : 'image',
                ];
            }
        } catch (Throwable $exception) {
            $this->deleteProofMedia($media);
            throw $exception;
        }

        $path = $media[0]['path'];

        try {
            return DB::transaction(function () use ($challenge, $leader, $employees, $profiles, $departmentNames, $accountNames, $logDate, $path, $media, $description) {
                $challenge = EngagementRewardChallenge::query()->lockForUpdate()->findOrFail($challenge->id);
                $userIds = $employees->keys()->all();
                $participants = EngagementRewardChallengeParticipant::query()
                    ->where('reward_challenge_id', $challenge->id)
                    ->whereIn('user_id', $userIds)
                    ->lockForUpdate()
                    ->get()
                    ->keyBy('user_id');

                $newParticipantsCount = count(array_diff($userIds, $participants->keys()->all()));
                if ($challenge->max_participants
                    && $challenge->participants()->count() + $newParticipantsCount > $challenge->max_participants) {
                    throw ValidationException::withMessages([
                        'team' => 'The challenge does not have enough remaining participant slots for your team.',
                    ]);
                }

                $existingToday = EngagementRewardChallengeTeamSubmission::query()
                    ->where('reward_challenge_id', $challenge->id)
                    ->where('leader_id', $leader->id)
                    ->whereDate('log_date', $logDate)
                    ->lockForUpdate()
                    ->first();

                if ($challenge->isDailyChallenge() && $existingToday) {
                    throw ValidationException::withMessages([
                        'photo' => 'A team proof has already been submitted today.',
                    ]);
                }

                if (! $challenge->isDailyChallenge()) {
                    $activeSubmission = EngagementRewardChallengeTeamSubmission::query()
                        ->where('reward_challenge_id', $challenge->id)
                        ->where('leader_id', $leader->id)
                        ->whereIn('status', ['submitted', 'approved'])
                        ->lockForUpdate()
                        ->exists();

                    if ($activeSubmission) {
                        throw ValidationException::withMessages([
                            'challenge' => 'A team proof is already pending or approved for this challenge.',
                        ]);
                    }
                }

                foreach ($employees as $employee) {
                    $participant = $participants->get($employee->id);
                    if ($participant && ($participant->status === 'approved'
                        || ($challenge->isDailyChallenge() && $participant->isDailyChallengeComplete()))) {
                        throw ValidationException::withMessages([
                            'team' => "{$employee->name} has already completed this challenge.",
                        ]);
                    }

                    if ($challenge->isDailyChallenge() && $participant
                        && $participant->dailyLogs()
                            ->whereNull('team_submission_id')
                            ->whereDate('log_date', $logDate)
                            ->exists()) {
                        throw ValidationException::withMessages([
                            'team' => "{$employee->name} already has a submission for today.",
                        ]);
                    }

                    if (! $challenge->isDailyChallenge() && $participant
                        && $participant->hasIndividualSubmission()
                        && in_array($participant->status, ['submitted', 'approved', 'pending_survey'], true)) {
                        throw ValidationException::withMessages([
                            'team' => "{$employee->name} already has a pending or approved submission.",
                        ]);
                    }
                }

                $submission = $existingToday;
                if (! $submission) {
                    $submission = new EngagementRewardChallengeTeamSubmission;
                }

                $submission->fill([
                    'reward_challenge_id' => $challenge->id,
                    'leader_id' => $leader->id,
                    'log_date' => $logDate,
                    'submission_path' => $path,
                    'submission_media' => $media,
                    'challenge_description' => $description,
                    'status' => 'submitted',
                    'submitted_at' => now(),
                    'reviewed_at' => null,
                    'reviewed_by' => null,
                    'review_note' => null,
                ]);
                $submission->save();
                if ($existingToday) {
                    $submission->members()->delete();
                }

                if ($challenge->survey_required) {
                    EngagementRewardChallengeParticipant::query()->firstOrCreate(
                        [
                            'reward_challenge_id' => $challenge->id,
                            'user_id' => $leader->id,
                        ],
                        [
                            'status' => 'joined',
                            'joined_at' => now(),
                            'required_days' => $challenge->isDailyChallenge() ? $challenge->duration_days : null,
                            'completed_days' => 0,
                        ],
                    );
                }

                foreach ($employees as $employee) {
                    $profile = $profiles->get($employee->id);
                    $participant = $participants->get($employee->id);

                    if (! $participant) {
                        $participant = EngagementRewardChallengeParticipant::create([
                            'reward_challenge_id' => $challenge->id,
                            'user_id' => $employee->id,
                            'status' => 'joined',
                            'joined_at' => now(),
                            'required_days' => $challenge->isDailyChallenge() ? $challenge->duration_days : null,
                            'completed_days' => 0,
                        ]);
                    }

                    $member = $submission->members()->updateOrCreate(
                        ['user_id' => $employee->id],
                        [
                            'participant_id' => $participant->id,
                            'full_name' => $employee->name,
                            'eoid' => $profile->employee_id,
                            'department_id' => $profile->department_id,
                            'department_name' => $departmentNames->get($profile->department_id),
                            'account_id' => $profile->account_id,
                            'account_name' => $accountNames->get($profile->account_id),
                            'location_id' => $profile->location_id,
                        ],
                    );

                    if ($challenge->isDailyChallenge()) {
                        $participant->dailyLogs()->create([
                            'team_submission_id' => $submission->id,
                            'log_date' => $logDate,
                            'submission_path' => $path,
                            'submission_media' => $media,
                            'challenge_description' => $description,
                            'status' => 'submitted',
                            'submitted_at' => now(),
                        ]);

                    }
                }

                return $submission->load([
                    'challenge' => fn ($query) => $query->withTrashed(),
                    'members.participant',
                ]);
            });
        } catch (Throwable $exception) {
            $this->deleteProofMedia($media);
            throw $exception;
        }
    }

    private function deleteProofMedia(array $media): void
    {
        $paths = collect($media)->pluck('path')->filter()->values()->all();
        if ($paths && ! Storage::disk('s3')->delete($paths)) {
            Log::warning('Failed to remove challenge proof media from Amazon S3.', ['paths' => $paths]);
        }
    }

    public function approve(
        EngagementRewardChallengeTeamSubmission $submission,
        User $reviewer,
        int $bonusPoints = 0,
    ): EngagementRewardChallengeTeamSubmission
    {
        return DB::transaction(function () use ($submission, $reviewer, $bonusPoints) {
            $submission = EngagementRewardChallengeTeamSubmission::query()
                ->lockForUpdate()
                ->findOrFail($submission->id);

            if ($submission->status !== 'submitted') {
                throw ValidationException::withMessages([
                    'submission' => 'Only pending team submissions can be approved.',
                ]);
            }

            $submission->load([
                'challenge' => fn ($query) => $query->withTrashed(),
                'members.participant',
            ]);

            foreach ($submission->members as $member) {
                $participant = EngagementRewardChallengeParticipant::query()
                    ->lockForUpdate()
                    ->findOrFail($member->participant_id);

                if ($submission->challenge->isDailyChallenge()) {
                    $log = EngagementRewardChallengeDailyLog::query()
                        ->where('team_submission_id', $submission->id)
                        ->where('reward_challenge_participant_id', $participant->id)
                        ->lockForUpdate()
                        ->firstOrFail();

                    if ($log->status !== 'submitted') {
                        throw ValidationException::withMessages([
                            'submission' => 'Every member proof must still be pending review.',
                        ]);
                    }

                    $log->update([
                        'status' => 'approved',
                        'reviewed_at' => now(),
                        'reviewed_by' => $reviewer->id,
                        'review_note' => null,
                    ]);
                    continue;
                }
            }

            $allDailyProofsComplete = true;
            $leaderParticipant = null;
            if ($submission->challenge->survey_required) {
                $leaderParticipant = EngagementRewardChallengeParticipant::query()
                    ->where('reward_challenge_id', $submission->reward_challenge_id)
                    ->where('user_id', $submission->leader_id)
                    ->lockForUpdate()
                    ->firstOrFail();
            }

            if ($submission->challenge->isDailyChallenge()) {
                $approvedTeamDates = EngagementRewardChallengeTeamSubmission::query()
                    ->where('reward_challenge_id', $submission->reward_challenge_id)
                    ->where('leader_id', $submission->leader_id)
                    ->where('status', 'approved')
                    ->where('id', '!=', $submission->id)
                    ->pluck('log_date')
                    ->push($submission->log_date->toDateString())
                    ->unique()
                    ->count();
                $allDailyProofsComplete = $approvedTeamDates >= (int) $submission->challenge->duration_days;
            }

            $alreadyAwarded = EngagementRewardChallengeTeamSubmission::query()
                ->where('reward_challenge_id', $submission->reward_challenge_id)
                ->where('leader_id', $submission->leader_id)
                ->where(function ($query) {
                    $query->where('base_points_awarded', '>', 0)
                        ->orWhere('pending_base_points', '>', 0);
                })
                ->where('id', '!=', $submission->id)
                ->exists();
            $basePointsAwarded = (
                ! $submission->challenge->isDailyChallenge() || $allDailyProofsComplete
            ) && ! $alreadyAwarded
                ? (int) $submission->challenge->points
                : 0;
            $deferPoints = $submission->challenge->survey_required
                && ! ($leaderParticipant?->hasCompletedSurvey($submission->challenge) ?? false);
            $pendingBasePoints = $deferPoints ? $basePointsAwarded : 0;
            $pendingBonusPoints = $deferPoints ? $bonusPoints : 0;
            $awardedBasePoints = $deferPoints ? 0 : $basePointsAwarded;
            $awardedBonusPoints = $deferPoints ? 0 : $bonusPoints;
            $submission->update([
                'status' => 'approved',
                'base_points_awarded' => $awardedBasePoints,
                'bonus_points_awarded' => $awardedBonusPoints,
                'team_points_awarded' => $awardedBasePoints + $awardedBonusPoints,
                'pending_base_points' => $pendingBasePoints,
                'pending_bonus_points' => $pendingBonusPoints,
                'reviewed_at' => now(),
                'reviewed_by' => $reviewer->id,
                'review_note' => null,
            ]);

            return $submission->fresh(['challenge' => fn ($query) => $query->withTrashed(), 'members.participant']);
        });
    }

    public function decline(
        EngagementRewardChallengeTeamSubmission $submission,
        User $reviewer,
        ?string $reviewNote,
    ): EngagementRewardChallengeTeamSubmission {
        return DB::transaction(function () use ($submission, $reviewer, $reviewNote) {
            $submission = EngagementRewardChallengeTeamSubmission::query()
                ->lockForUpdate()
                ->findOrFail($submission->id);

            if ($submission->status !== 'submitted') {
                throw ValidationException::withMessages([
                    'submission' => 'Only pending team submissions can be declined.',
                ]);
            }

            $submission->load(['challenge' => fn ($query) => $query->withTrashed(), 'members']);

            if ($submission->challenge?->isDailyChallenge()) {
                EngagementRewardChallengeDailyLog::query()
                    ->where('team_submission_id', $submission->id)
                    ->where('status', 'submitted')
                    ->update([
                        'status' => 'declined',
                        'reviewed_at' => now(),
                        'reviewed_by' => $reviewer->id,
                        'review_note' => $reviewNote,
                    ]);
            }

            $submission->update([
                'status' => 'declined',
                'reviewed_at' => now(),
                'reviewed_by' => $reviewer->id,
                'review_note' => $reviewNote,
            ]);

            return $submission->fresh(['challenge' => fn ($query) => $query->withTrashed(), 'members.participant']);
        });
    }
}
