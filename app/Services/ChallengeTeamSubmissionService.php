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
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Throwable;

class ChallengeTeamSubmissionService
{
    public function __construct(private ChallengeCompletionService $completionService) {}

    public function submit(
        EngagementRewardChallenge $challenge,
        User $leader,
        UploadedFile $photo,
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

        $path = $photo->store('unified/engagement/reward_challenges/submissions', 's3');

        try {
            return DB::transaction(function () use ($challenge, $leader, $employees, $profiles, $departmentNames, $accountNames, $logDate, $path, $description) {
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
                        && $participant->dailyLogs()->whereDate('log_date', $logDate)->exists()) {
                        throw ValidationException::withMessages([
                            'team' => "{$employee->name} already has a submission for today.",
                        ]);
                    }

                    if (! $challenge->isDailyChallenge() && $participant
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
                            'challenge_description' => $description,
                            'status' => 'submitted',
                            'submitted_at' => now(),
                        ]);

                        if ($participant->status === 'joined') {
                            $participant->update(['status' => 'submitted']);
                        }
                    } else {
                        $participant->update([
                            'status' => 'submitted',
                            'submission_path' => $path,
                            'challenge_description' => $description,
                            'submitted_at' => now(),
                            'reviewed_at' => null,
                            'reviewed_by' => null,
                            'review_note' => null,
                        ]);
                    }
                }

                return $submission->load([
                    'challenge' => fn ($query) => $query->withTrashed(),
                    'members.participant',
                ]);
            });
        } catch (Throwable $exception) {
            Storage::disk('s3')->delete($path);
            throw $exception;
        }
    }

    public function approve(EngagementRewardChallengeTeamSubmission $submission, User $reviewer): EngagementRewardChallengeTeamSubmission
    {
        return DB::transaction(function () use ($submission, $reviewer) {
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
                    $participant->increment('completed_days');
                    $participant->refresh();

                    if ($participant->isDailyChallengeComplete() && $participant->proof_approved_at === null) {
                        $participant->update([
                            'proof_approved_at' => now(),
                            'reviewed_at' => now(),
                            'reviewed_by' => $reviewer->id,
                        ]);
                    }

                    $this->completionService->finalizeLocked($participant);
                    continue;
                }

                $participant->update([
                    'proof_approved_at' => now(),
                    'reviewed_at' => now(),
                    'reviewed_by' => $reviewer->id,
                    'review_note' => null,
                ]);
                $this->completionService->finalizeLocked($participant);
            }

            $submission->update([
                'status' => 'approved',
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
            } else {
                foreach ($submission->members as $member) {
                    EngagementRewardChallengeParticipant::query()
                        ->whereKey($member->participant_id)
                        ->update([
                            'status' => 'declined',
                            'reviewed_at' => now(),
                            'reviewed_by' => $reviewer->id,
                            'review_note' => $reviewNote,
                        ]);
                }
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
