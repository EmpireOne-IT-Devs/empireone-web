<?php

namespace App\Http\Controllers\API\Engagement;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChallengeLeaderboardEntryResource;
use App\Models\Account;
use App\Models\Account\AccountEmployee;
use App\Models\Department;
use App\Models\Engagement\EngagementPostEventSurvey;
use App\Models\Engagement\EngagementRewardChallenge;
use App\Models\Engagement\EngagementRewardChallengeDailyLog;
use App\Models\Engagement\EngagementRewardChallengeParticipant;
use App\Models\Engagement\EngagementRewardChallengeTeamSubmission;
use App\Models\User;
use App\Http\Requests\Engagement\SubmitTeamChallengeRequest;
use App\Http\Requests\Engagement\SubmitChallengeProofRequest;
use App\Http\Requests\Engagement\StoreEngagementRewardChallengeRequest;
use App\Http\Requests\Engagement\UpdateEngagementRewardChallengeRequest;
use App\Http\Resources\Engagement\EngagementRewardChallengeTeamSubmissionResource;
use App\Services\ChallengeLeaderboardService;
use App\Services\ChallengeTeamSubmissionService;
use App\Services\ChallengeSurveyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class EngagementRewardChallengesController extends Controller
{
    /**
     * Display all published challenges for the dashboard.
     */
    public function index(): JsonResponse
    {
        $challenges = EngagementRewardChallenge::query()
            ->with(['departments:id,name', 'accounts:id,name', 'survey'])
            ->withCount('participants')
            ->latest()
            ->get()
            ->map(fn (EngagementRewardChallenge $challenge) => $this->formatChallenge($challenge));

        return response()->json([
            'status' => 'success',
            'data' => $challenges,
        ]);
    }

    /**
     * List every participant of a specific challenge for the admin manage view.
     */
    public function participants(
        EngagementRewardChallenge $engagementRewardChallenge,
        ChallengeLeaderboardService $leaderboardService,
    ): JsonResponse
    {
        $participantRecords = $engagementRewardChallenge->participants()
            ->select(['users.id', 'users.name', 'users.email'])
            ->orderByDesc('engagement_reward_challenge_participants.joined_at')
            ->get();
        $departmentNames = AccountEmployee::query()
            ->leftJoin('departments', 'departments.id', '=', 'account_employees.department_id')
            ->whereIn('account_employees.user_id', $participantRecords->pluck('id'))
            ->pluck('departments.name', 'account_employees.user_id');
        $participants = $participantRecords
            ->map(fn (User $user) => [
                'id' => $user->id,
                'participant_id' => $user->pivot->id,
                'name' => $user->name,
                'email' => $user->email,
                'department' => $departmentNames->get($user->id),
                'status' => $user->pivot->status,
                'challenge_description' => $user->pivot->challenge_description,
                'points_awarded' => $user->pivot->points_awarded,
                'challenge_points_awarded' => $user->pivot->points_awarded !== null
                    ? max(0, (int) $user->pivot->points_awarded - (int) $user->pivot->bonus_points)
                    : 0,
                'bonus_points' => (int) $user->pivot->bonus_points,
                'bonus_points_awarded' => $user->pivot->points_awarded !== null
                    ? (int) $user->pivot->bonus_points
                    : 0,
                'survey_points_awarded' => (int) $user->pivot->survey_points_awarded,
                'total_points_awarded' => $user->pivot->total_points_awarded,
                'proof_approved_at' => $user->pivot->proof_approved_at?->toDateTimeString(),
                'survey_completed_at' => $user->pivot->survey_rewarded_at?->toDateTimeString(),
                'joined_at' => $user->pivot->joined_at?->toDateTimeString(),
                'submitted_at' => $user->pivot->submitted_at?->toDateTimeString(),
                'reviewed_at' => $user->pivot->reviewed_at?->toDateTimeString(),
                'submission_url' => $user->pivot->submission_path
                    ? Storage::disk('s3')->url($user->pivot->submission_path)
                    : null,
                'submission_media' => $this->proofMediaUrls(
                    $user->pivot->submission_media,
                    $user->pivot->submission_path,
                ),
            ])
            ->values();

        $teamSubmissionRecords = EngagementRewardChallengeTeamSubmission::query()
            ->where('reward_challenge_id', $engagementRewardChallenge->id)
            ->select([
                'id',
                'reward_challenge_id',
                'leader_id',
                'status',
                'team_points_awarded',
                'base_points_awarded',
                'bonus_points_awarded',
                'submitted_at',
            ])
            ->with([
                'leader:id,name,email',
                'members:id,team_submission_id,participant_id,user_id,full_name,department_name',
                'members.participant:id,joined_at',
            ])
            ->orderByDesc('submitted_at')
            ->get();
        $teamSubmissions = $teamSubmissionRecords
            ->map(function (EngagementRewardChallengeTeamSubmission $submission) {
                $members = $submission->members;
                $leaderName = $submission->leader?->name ?? 'Unknown leader';
                $joinedAt = $members
                    ->pluck('participant.joined_at')
                    ->filter()
                    ->min();

                return [
                    'id' => "team-{$submission->id}",
                    'team_submission_id' => $submission->id,
                    'name' => "Team: {$leaderName}",
                    'email' => $submission->leader?->email,
                    'department' => $members
                        ->pluck('department_name')
                        ->filter()
                        ->unique()
                        ->implode(', ') ?: null,
                    'status' => $submission->status,
                    'points_awarded' => (int) $submission->team_points_awarded,
                    'joined_at' => $joinedAt?->toDateTimeString(),
                    'submitted_at' => $submission->submitted_at?->toDateTimeString(),
                    'member_count' => $members->count(),
                    'members' => $members->pluck('full_name')->values(),
                ];
            })
            ->values();

        $teamParticipantIds = $teamSubmissionRecords
            ->flatMap(fn (EngagementRewardChallengeTeamSubmission $submission) => $submission->members->pluck('participant_id'))
            ->map(fn ($participantId) => (int) $participantId)
            ->unique()
            ->values()
            ->all();
        $leaderboards = $leaderboardService->buildCached(
            (int) $engagementRewardChallenge->id,
            $participantRecords,
            $teamSubmissionRecords,
            $teamParticipantIds,
            $departmentNames,
        );

        $individualParticipants = $participants
            ->reject(fn (array $participant) => in_array(
                (int) $participant['participant_id'],
                $teamParticipantIds,
                true,
            ))
            ->values();

        return response()->json([
            'status' => 'success',
            'data' => [
                'challenge' => $this->formatChallenge($engagementRewardChallenge),
                'participants' => $participants,
                'individual_participants' => $individualParticipants,
                'team_submissions' => $teamSubmissions,
                'individual_leaderboard' => collect($leaderboards['individual'])
                    ->map(fn (array $entry) => (new ChallengeLeaderboardEntryResource($entry))->resolve(request()))
                    ->values(),
                'team_leaderboard' => collect($leaderboards['team'])
                    ->map(fn (array $entry) => (new ChallengeLeaderboardEntryResource($entry))->resolve(request()))
                    ->values(),
            ],
        ]);
    }

    private function storeProofMedia(Request $request): array
    {
        $files = $request->file('video')
            ? [$request->file('video')]
            : ($request->file('photos') ?: [$request->file('photo')]);
        $files = array_filter($files);
        $media = [];

        try {
            foreach ($files as $file) {
                $path = $file->store('unified/engagement/reward_challenges/submissions', 's3');
                if (! $path) {
                    throw new \RuntimeException('Unable to store challenge proof media in Amazon S3.');
                }
                $media[] = [
                    'path' => $path,
                    'type' => $request->hasFile('video') ? 'video' : 'image',
                ];
            }
        } catch (\Throwable $exception) {
            $this->deleteProofMedia($media);
            throw $exception;
        }

        return $media;
    }

    private function rejectProof(string $message): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'message' => $message,
        ], 422);
    }

    private function deleteProofMedia(?array $media, ?string $legacyPath = null): void
    {
        $paths = collect($media ?? [])->pluck('path')->filter()->all();
        if ($legacyPath) {
            $paths[] = $legacyPath;
        }
        if ($paths) {
            $paths = array_values(array_unique($paths));
            if (! Storage::disk('s3')->delete($paths)) {
                Log::warning('Failed to remove challenge proof media from Amazon S3.', ['paths' => $paths]);
            }
        }
    }

    private function proofMediaUrls(?array $media, ?string $legacyPath = null): array
    {
        if (empty($media) && $legacyPath) {
            $media = [['path' => $legacyPath, 'type' => 'image']];
        }

        return collect($media ?? [])
            ->filter(fn (array $item) => ! empty($item['path']))
            ->map(fn (array $item) => [
                'type' => $item['type'] ?? 'image',
                'url' => Storage::disk('s3')->url($item['path']),
            ])
            ->values()
            ->all();
    }

    /**
     * Shape a challenge for the frontend, including the display-only lifecycle status.
     */
    private function formatChallenge(
        EngagementRewardChallenge $challenge,
        ?int $currentUserId = null,
        ?EngagementRewardChallengeTeamSubmission $teamSubmission = null,
        ?array $preloaded = null,
    ): array {
        $today = now()->startOfDay();

        $displayStatus = match (true) {
            $challenge->deadline->lt($today) => 'Completed',
            $challenge->start_date->gt($today) => 'Upcoming',
            default => 'Active',
        };

        // List endpoints pass batch-loaded user data in $preloaded so each
        // card costs no extra queries; single-challenge actions query directly.
        $pivot = $preloaded !== null
            ? ($preloaded['participant'] ?? null)
            : ($currentUserId
                ? $challenge->participants()->where('user_id', $currentUserId)->first()?->pivot
                : null);
        $isDailyChallenge = $challenge->isDailyChallenge();
        $survey = $challenge->survey_required ? $challenge->survey : null;
        $surveyCompleted = $pivot && $challenge->survey_required
            ? ($preloaded !== null
                ? (bool) ($preloaded['survey_completed'] ?? false)
                : $pivot->hasCompletedSurvey($challenge))
            : false;
        $individualDailyStats = $preloaded['individual_daily_stats'] ?? null;
        $todayLog = $preloaded['today_log'] ?? null;
        if ($isDailyChallenge && $pivot && $preloaded === null) {
            $individualLogs = $pivot->dailyLogs()
                ->whereNull('team_submission_id')
                ->get();
            $individualDailyStats = [
                'submission_count' => $individualLogs->count(),
                'completed_days' => $individualLogs->where('status', 'approved')->count(),
            ];
            $todayLog = $individualLogs->first(fn ($log) => $log->log_date->isToday());
        }
        $individualProofSubmitted = $pivot
            ? ($isDailyChallenge
                ? (int) ($individualDailyStats['submission_count'] ?? 0) > 0
                : $pivot->hasIndividualSubmission())
            : false;
        $participationStatus = $pivot?->status;
        $hasTeamSubmission = $pivot
            ? ($preloaded['has_team_submission'] ?? $pivot->hasTeamSubmission())
            : false;
        if ($pivot && ! $individualProofSubmitted && $hasTeamSubmission) {
            $participationStatus = 'joined';
        }

        $requiredDays = $pivot?->required_days
            ?? ($isDailyChallenge ? $challenge->duration_days : null);
        $individualDailyComplete = $pivot && $isDailyChallenge
            ? ($preloaded !== null
                ? $requiredDays > 0 && (int) ($individualDailyStats['completed_days'] ?? 0) >= $requiredDays
                : $pivot->isDailyChallengeComplete())
            : false;

        if (! $individualDailyComplete) {
            $todayLog = $isDailyChallenge ? $todayLog : null;
        } else {
            $todayLog = null;
        }
        $submissionMedia = $isDailyChallenge
            ? $todayLog?->submission_media
            : ($individualProofSubmitted ? $pivot?->submission_media : null);
        $submissionPath = $isDailyChallenge
            ? $todayLog?->submission_path
            : ($individualProofSubmitted ? $pivot?->submission_path : null);

        return [
            'id' => $challenge->id,
            'title' => $challenge->title,
            'description' => $challenge->description,
            'type' => $challenge->type,
            'proof_type' => $challenge->proof_type ?? 'photo_only',
            'category' => $challenge->category,
            'points' => $challenge->points,
            'duration_days' => $challenge->duration_days,
            'is_daily_challenge' => $isDailyChallenge,
            'banner_url' => $challenge->banner_path ? Storage::disk('s3')->url($challenge->banner_path) : null,
            'banner_position_x' => $challenge->banner_position_x ?? 50,
            'banner_position_y' => $challenge->banner_position_y ?? 50,
            'all_employees' => $challenge->all_employees,
            'departments' => $challenge->departments
                ->map(fn ($department) => ['id' => $department->id, 'name' => $department->name])
                ->values(),
            'accounts' => $challenge->accounts
                ->map(fn ($account) => ['id' => $account->id, 'name' => $account->name])
                ->values(),
            'max_participants' => $challenge->max_participants,
            'participants_count' => $challenge->participants_count ?? $challenge->participants()->count(),
            'is_joined' => (bool) $pivot,
            'participation_status' => $participationStatus,
            'individual_proof_submitted' => $individualProofSubmitted,
            'team_submission_status' => $teamSubmission?->status,
            'team_submission_review_note' => $teamSubmission?->review_note,
            'team_submission_date' => $teamSubmission?->log_date?->toDateString(),
            'team_submission_locked' => $teamSubmission
                ? ($isDailyChallenge
                    ? $teamSubmission->log_date?->isToday()
                    : in_array($teamSubmission->status, ['submitted', 'approved'], true))
                : false,
            'survey_required' => (bool) $challenge->survey_required,
            'survey_id' => $survey?->id,
            'survey_completed' => $surveyCompleted,
            'survey_completed_at' => $surveyCompleted ? $pivot->survey_rewarded_at?->toDateTimeString() : null,
            'can_complete_survey' => $survey && $survey->status === 'published' && $pivot
                && ! $surveyCompleted && $pivot->canAnswerSurvey($challenge),
            'survey_reward_points' => $challenge->survey_required ? ChallengeSurveyService::REWARD_POINTS : 0,
            'survey_points_awarded' => (int) $pivot?->survey_points_awarded,
            'challenge_points_awarded' => $individualProofSubmitted ? (int) $pivot?->points_awarded : 0,
            'total_points_awarded' => $pivot?->total_points_awarded ?? 0,
            'proof_approved_at' => $individualProofSubmitted ? $pivot?->proof_approved_at?->toDateTimeString() : null,
            'required_days' => $requiredDays,
            'completed_days' => $isDailyChallenge
                ? (int) ($individualDailyStats['completed_days'] ?? 0)
                : $pivot?->completed_days,
            'submitted_today' => (bool) $todayLog,
            'daily_window_ends_at' => $isDailyChallenge ? $challenge->dailyWindowEndDate()->toDateString() : null,
            'submission_url' => $submissionPath
                ? Storage::disk('s3')->url($submissionPath)
                : null,
            'submission_media' => $this->proofMediaUrls(
                $submissionMedia,
                $submissionPath,
            ),
            'submitted_at' => $individualProofSubmitted ? $pivot?->submitted_at?->toDateTimeString() : null,
            'reviewed_at' => $individualProofSubmitted ? $pivot?->reviewed_at?->toDateTimeString() : null,
            'review_note' => $individualProofSubmitted ? $pivot?->review_note : null,
            'start_date' => $challenge->start_date->toDateString(),
            'deadline' => $challenge->deadline->toDateString(),
            'card_color' => $challenge->card_color,
            'status' => $displayStatus,
        ];
    }

    /**
     * Display challenges the authenticated employee is eligible for, with their participation status.
     */
    public function myChallenges(): JsonResponse
    {
        $user = auth()->user();
        $userId = $user->id;
        $canJoinChallenges = in_array((int) $user->role, [
            User::ROLE_ADMIN,
            User::ROLE_EMPLOYEE,
        ], true);
        $employee = AccountEmployee::where('user_id', $userId)->first();

        $challenges = EngagementRewardChallenge::query()
            ->with(['departments:id,name', 'accounts:id,name', 'survey'])
            ->withCount('participants')
            ->latest()
            ->get()
            ->filter(function (EngagementRewardChallenge $challenge) use ($canJoinChallenges, $employee) {
                if ($canJoinChallenges || $challenge->all_employees) {
                    return true;
                }

                return $challenge->isEligibleForEmployee(
                    $employee?->department_id,
                    $employee?->account_id,
                );
            })
            ->values();

        $teamSubmissionsByChallenge = collect();
        $teamChallengeIds = $challenges
            ->where('type', 'Team')
            ->pluck('id');
        $teamParticipationChallengeIds = collect();

        if ($teamChallengeIds->isNotEmpty()) {
            $teamParticipationChallengeIds = DB::table('engagement_reward_challenge_team_submissions as submissions')
                ->leftJoin(
                    'engagement_reward_challenge_team_submission_members as members',
                    'members.team_submission_id',
                    '=',
                    'submissions.id',
                )
                ->whereIn('submissions.reward_challenge_id', $teamChallengeIds)
                ->whereIn('submissions.status', ['submitted', 'approved'])
                ->where(fn ($query) => $query
                    ->where('submissions.leader_id', $userId)
                    ->orWhere('members.user_id', $userId))
                ->distinct()
                ->pluck('submissions.reward_challenge_id')
                ->flip();
        }

        if ($teamChallengeIds->isNotEmpty() && DB::table('e_r_leaders')->where('user_id', $userId)->exists()) {
            $teamSubmissionsByChallenge = EngagementRewardChallengeTeamSubmission::query()
                ->where('leader_id', $userId)
                ->whereIn('reward_challenge_id', $teamChallengeIds)
                ->orderByDesc('log_date')
                ->orderByDesc('submitted_at')
                ->get()
                ->groupBy('reward_challenge_id')
                ->map(fn ($submissions) => $submissions->first());

            $surveyTeamChallengeIds = $challenges
                ->where('survey_required', true)
                ->whereIn('id', EngagementRewardChallengeTeamSubmission::query()
                    ->where('leader_id', $userId)
                    ->whereIn('reward_challenge_id', $teamChallengeIds)
                    ->whereIn('status', ['submitted', 'approved'])
                    ->distinct()
                    ->pluck('reward_challenge_id'))
                ->pluck('id');
            $existingSurveyParticipationChallengeIds = EngagementRewardChallengeParticipant::query()
                ->where('user_id', $userId)
                ->whereIn('reward_challenge_id', $surveyTeamChallengeIds)
                ->pluck('reward_challenge_id');

            foreach ($surveyTeamChallengeIds->diff($existingSurveyParticipationChallengeIds) as $challengeId) {
                $challenge = $challenges->firstWhere('id', $challengeId);
                EngagementRewardChallengeParticipant::query()->firstOrCreate(
                    [
                        'reward_challenge_id' => $challengeId,
                        'user_id' => $userId,
                    ],
                    [
                        'status' => 'joined',
                        'joined_at' => now(),
                        'required_days' => $challenge?->isDailyChallenge() ? $challenge->duration_days : null,
                        'completed_days' => 0,
                    ],
                );
            }
        }

        $challengeIds = $challenges->pluck('id');
        $participations = EngagementRewardChallengeParticipant::query()
            ->where('user_id', $userId)
            ->whereIn('reward_challenge_id', $challengeIds)
            ->get()
            ->keyBy('reward_challenge_id');
        $todayLogs = $participations->isEmpty()
            ? collect()
            : EngagementRewardChallengeDailyLog::query()
                ->whereIn('reward_challenge_participant_id', $participations->pluck('id'))
                ->whereNull('team_submission_id')
                ->whereDate('log_date', now()->toDateString())
                ->get()
                ->keyBy('reward_challenge_participant_id');
        $individualDailyStats = $participations->isEmpty()
            ? collect()
            : EngagementRewardChallengeDailyLog::query()
                ->whereIn('reward_challenge_participant_id', $participations->pluck('id'))
                ->whereNull('team_submission_id')
                ->selectRaw('reward_challenge_participant_id, COUNT(*) as submission_count, SUM(CASE WHEN status = \'approved\' THEN 1 ELSE 0 END) as completed_days')
                ->groupBy('reward_challenge_participant_id')
                ->get()
                ->keyBy('reward_challenge_participant_id');
        $completedSurveyChallengeIds = $participations->isEmpty()
            ? collect()
            : EngagementPostEventSurvey::query()
                ->whereIn('reward_challenge_id', $participations->keys())
                ->whereHas('responses', fn ($query) => $query
                    ->where('user_id', $userId)
                    ->whereNotNull('submitted_at'))
                ->pluck('reward_challenge_id')
                ->flip();

        $challenges = $challenges
            ->map(function (EngagementRewardChallenge $challenge) use ($userId, $teamSubmissionsByChallenge, $teamParticipationChallengeIds, $participations, $todayLogs, $individualDailyStats, $completedSurveyChallengeIds) {
                $participant = $participations->get($challenge->id);

                return $this->formatChallenge(
                    $challenge,
                    $userId,
                    $teamSubmissionsByChallenge->get($challenge->id),
                    [
                        'participant' => $participant,
                        'has_team_submission' => $teamParticipationChallengeIds->has($challenge->id),
                        'today_log' => $participant ? $todayLogs->get($participant->id) : null,
                        'individual_daily_stats' => $participant && $individualDailyStats->has($participant->id)
                            ? (array) $individualDailyStats->get($participant->id)
                            : null,
                        'survey_completed' => $completedSurveyChallengeIds->has($challenge->id),
                    ],
                );
            });

        return response()->json([
            'status' => 'success',
            'data' => $challenges,
        ]);
    }

    /**
     * Points total and challenge participation history for the authenticated employee's profile.
     */
    public function profileSummary(): JsonResponse
    {
        $userId = auth()->id();

        $participations = EngagementRewardChallengeParticipant::query()
            ->where('user_id', $userId)
            ->with(['challenge' => fn ($query) => $query->withTrashed()->select('id', 'title', 'points', 'category', 'type', 'survey_required')])
            ->latest('joined_at')
            ->get();
        $teamSubmissions = EngagementRewardChallengeTeamSubmission::query()
            ->where('leader_id', $userId)
            ->with(['challenge' => fn ($query) => $query->withTrashed()->select('id', 'title', 'points', 'category', 'type', 'survey_required')])
            ->latest('submitted_at')
            ->get();
        $teamChallengeIds = $teamSubmissions->pluck('reward_challenge_id')->unique()->flip();
        $teamParticipationByChallenge = $participations->keyBy('reward_challenge_id');
        $latestTeamSubmissionIds = $teamSubmissions
            ->unique('reward_challenge_id')
            ->mapWithKeys(fn (EngagementRewardChallengeTeamSubmission $submission) => [
                $submission->reward_challenge_id => $submission->id,
            ]);

        $history = $participations
            ->filter(fn (EngagementRewardChallengeParticipant $participant) => ! $teamChallengeIds->has($participant->reward_challenge_id)
                || $participant->hasIndividualSubmission())
            ->map(function (EngagementRewardChallengeParticipant $participant) use ($teamChallengeIds) {
                $surveyPoints = $teamChallengeIds->has($participant->reward_challenge_id)
                    ? 0
                    : (int) $participant->survey_points_awarded;
                $challengePoints = $participant->points_awarded !== null
                    ? max(0, (int) $participant->points_awarded - (int) $participant->bonus_points)
                    : 0;
                $bonusPoints = $participant->points_awarded !== null
                    ? (int) $participant->bonus_points
                    : 0;

                return [
                'id' => $participant->id,
                'challenge_title' => $participant->challenge?->title ?? 'Challenge removed',
                'category' => $participant->challenge?->category ?? 'N/A',
                'points' => $challengePoints + $bonusPoints + $surveyPoints,
                'challenge_points_awarded' => $challengePoints,
                'bonus_points_awarded' => $bonusPoints,
                'team_points_awarded' => 0,
                'survey_points_awarded' => $surveyPoints,
                'total_points_awarded' => ($participant->status === 'approved' ? (int) $participant->points_awarded : 0) + $surveyPoints,
                'survey_completed_at' => $participant->survey_rewarded_at?->toDateTimeString(),
                'proof_approved_at' => $participant->proof_approved_at?->toDateTimeString(),
                'status' => $participant->status,
                'joined_at' => $participant->joined_at?->toDateString(),
                'submitted_at' => $participant->submitted_at?->toDateString(),
                'reviewed_at' => $participant->reviewed_at?->toDateString(),
                ];
            });
        $teamHistory = $teamSubmissions
            ->map(function (EngagementRewardChallengeTeamSubmission $submission) use ($teamParticipationByChallenge, $latestTeamSubmissionIds) {
                $leaderParticipation = $teamParticipationByChallenge->get($submission->reward_challenge_id);
                $isLatestSubmission = $latestTeamSubmissionIds->get($submission->reward_challenge_id) === $submission->id;
                $hasCompletedSurvey = $leaderParticipation?->hasCompletedSurvey($submission->challenge) ?? false;
                $surveyPoints = $isLatestSubmission
                    ? (int) ($leaderParticipation?->survey_points_awarded ?? 0)
                    : 0;
                $status = $submission->status;
                if ($submission->status === 'approved' && $submission->challenge?->survey_required) {
                    $status = $hasCompletedSurvey ? 'approved' : 'pending_survey';
                }

                return [
                    'id' => 'team-'.$submission->id,
                    'challenge_title' => $submission->challenge?->title ?? 'Challenge removed',
                    'category' => $submission->challenge?->category ?? 'N/A',
                    'points' => (int) $submission->team_points_awarded + $surveyPoints,
                    'challenge_points_awarded' => (int) $submission->base_points_awarded,
                    'bonus_points_awarded' => (int) $submission->bonus_points_awarded,
                    'team_points_awarded' => (int) $submission->team_points_awarded,
                    'survey_points_awarded' => $surveyPoints,
                    'total_points_awarded' => (int) $submission->team_points_awarded + $surveyPoints,
                    'survey_completed_at' => $isLatestSubmission
                        ? $leaderParticipation?->survey_rewarded_at?->toDateTimeString()
                        : null,
                    'proof_approved_at' => $submission->reviewed_at?->toDateTimeString(),
                    'status' => $status,
                    'joined_at' => $submission->log_date?->toDateString(),
                    'submitted_at' => $submission->submitted_at?->toDateString(),
                    'reviewed_at' => $submission->reviewed_at?->toDateString(),
                    'submission_type' => 'team',
                ];
            });
        $history = $history->concat($teamHistory)->sortByDesc('joined_at')->values();

        // Challenge points come from this module's participant and team-award records.
        $totalPoints = EngagementRewardChallengeParticipant::query()
            ->where('user_id', $userId)
            ->selectRaw('SUM('.EngagementRewardChallengeParticipant::TOTAL_POINTS_SQL.') as total')
            ->value('total');
        $totalPoints += (int) EngagementRewardChallengeTeamSubmission::query()
            ->where('leader_id', $userId)
            ->sum('team_points_awarded');

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_points' => (int) $totalPoints,
                'challenge_history' => $history,
            ],
        ]);
    }

    /**
     * Join a challenge as the authenticated employee.
     */
    public function join(
        EngagementRewardChallenge $engagementRewardChallenge,
        ChallengeLeaderboardService $leaderboardService,
    ): JsonResponse
    {
        $userId = auth()->id();
        $userRole = (int) auth()->user()->role;
        $employee = AccountEmployee::where('user_id', $userId)->first();

        $engagementRewardChallenge->load(['departments:id,name', 'accounts:id,name']);

        if (
            ! in_array($userRole, [User::ROLE_ADMIN, User::ROLE_EMPLOYEE], true)
            && ! $engagementRewardChallenge->isEligibleForEmployee($employee?->department_id, $employee?->account_id)
        ) {
            return response()->json([
                'status' => 'error',
                'message' => 'You are not eligible to join this challenge.',
            ], 403);
        }

        if ($engagementRewardChallenge->deadline->lt(now()->startOfDay())) {
            return response()->json([
                'status' => 'error',
                'message' => 'This challenge has already ended.',
            ], 422);
        }

        if ($engagementRewardChallenge->start_date->gt(now()->startOfDay())) {
            return response()->json([
                'status' => 'error',
                'message' => "This challenge hasn't started yet. It opens on ".$engagementRewardChallenge->start_date->format('M j, Y').'.',
            ], 422);
        }

        $result = DB::transaction(function () use ($engagementRewardChallenge, $userId) {
            // Lock the challenge row so concurrent joins cannot overshoot the participant cap.
            EngagementRewardChallenge::query()->whereKey($engagementRewardChallenge->id)->lockForUpdate()->first();

            if ($engagementRewardChallenge->participants()->where('user_id', $userId)->exists()) {
                return 'You already joined this challenge.';
            }

            if (
                $engagementRewardChallenge->max_participants
                && $engagementRewardChallenge->participants()->count() >= $engagementRewardChallenge->max_participants
            ) {
                return 'This challenge has reached its participant limit.';
            }

            try {
                $engagementRewardChallenge->participants()->attach($userId, [
                    'status' => 'joined',
                    'joined_at' => now(),
                    'required_days' => $engagementRewardChallenge->isDailyChallenge()
                        ? $engagementRewardChallenge->duration_days
                        : null,
                    'completed_days' => 0,
                ]);
            } catch (\Illuminate\Database\QueryException $exception) {
                if ($exception->getCode() === '23000') {
                    return 'You already joined this challenge.';
                }

                throw $exception;
            }

            return null;
        });

        if ($result !== null) {
            return response()->json([
                'status' => 'error',
                'message' => $result,
            ], 422);
        }

        $leaderboardService->forgetCached((int) $engagementRewardChallenge->id);

        return response()->json([
            'status' => 'success',
            'message' => 'You joined the challenge successfully.',
            'data' => $this->formatChallenge($engagementRewardChallenge, $userId),
        ]);
    }

    /**
     * Leave a previously joined challenge.
     */
    public function leave(
        EngagementRewardChallenge $engagementRewardChallenge,
        ChallengeLeaderboardService $leaderboardService,
    ): JsonResponse
    {
        $userId = auth()->id();

        return DB::transaction(function () use ($engagementRewardChallenge, $userId, $leaderboardService) {
            $participant = EngagementRewardChallengeParticipant::query()
                ->where('reward_challenge_id', $engagementRewardChallenge->id)
                ->where('user_id', $userId)->lockForUpdate()->first();

            if ($participant && (in_array($participant->status, ['submitted', 'approved', 'pending_survey'], true)
                || $participant->survey_rewarded_at !== null)) {
                return response()->json([
                    'status' => 'error',
                    'message' => "You can't leave after submitting proof for review.",
                ], 422);
            }

            if ($participant && $participant->completed_days > 0) {
                return response()->json([
                    'status' => 'error',
                    'message' => "You can't leave after logging progress on this challenge.",
                ], 422);
            }

            $engagementRewardChallenge->participants()->detach($userId);
            $leaderboardService->forgetAfterCommit((int) $engagementRewardChallenge->id);
            $engagementRewardChallenge->load(['departments:id,name', 'accounts:id,name']);

            return response()->json([
                'status' => 'success',
                'message' => 'You left the challenge.',
                'data' => $this->formatChallenge($engagementRewardChallenge, $userId),
            ]);
        });
    }

    /**
     * Submit a proof photo for review on a joined challenge.
     */
    public function submitProof(
        SubmitChallengeProofRequest $request,
        EngagementRewardChallenge $engagementRewardChallenge,
        ChallengeLeaderboardService $leaderboardService,
    ): JsonResponse
    {
        $userId = auth()->id();

        if ($engagementRewardChallenge->start_date->gt(now()->startOfDay())) {
            return $this->rejectProof("This challenge hasn't started yet. It opens on ".$engagementRewardChallenge->start_date->format('M j, Y').'.');
        }

        if ($engagementRewardChallenge->isDailyChallenge()) {
            return $this->rejectProof('This is a multi-day challenge. Use the daily submission endpoint instead.');
        }

        $validated = $request->validated();

        $participant = $engagementRewardChallenge->participants()->where('user_id', $userId)->first();

        if (! $participant) {
            return $this->rejectProof('Join this challenge before submitting proof.');
        }

        if (! in_array($participant->pivot->status, ['joined', 'declined'], true)
            && ! (! $participant->pivot->hasIndividualSubmission() && $participant->pivot->hasTeamSubmission())) {
            return $this->rejectProof('A submission is already pending or approved for this challenge.');
        }

        $media = $this->storeProofMedia($request);

        try {
            $previous = DB::transaction(function () use ($engagementRewardChallenge, $userId, $media, $validated) {
                // Re-check under a row lock so a double-click or retry cannot submit twice.
                $locked = EngagementRewardChallengeParticipant::query()
                    ->where('reward_challenge_id', $engagementRewardChallenge->id)
                    ->where('user_id', $userId)
                    ->lockForUpdate()
                    ->first();

                if (! $locked || (! in_array($locked->status, ['joined', 'declined'], true)
                    && ! (! $locked->hasIndividualSubmission() && $locked->hasTeamSubmission()))) {
                    return null;
                }

                $previous = [$locked->submission_media, $locked->submission_path];

                $engagementRewardChallenge->participants()->updateExistingPivot($userId, [
                    'status' => 'submitted',
                    'submission_path' => $media[0]['path'],
                    'submission_media' => $media,
                    'challenge_description' => $validated['challenge_description'],
                    'submitted_at' => now(),
                    'reviewed_at' => null,
                    'reviewed_by' => null,
                    'review_note' => null,
                    'proof_approved_at' => null,
                    'points_awarded' => null,
                    'bonus_points' => 0,
                ]);

                return $previous;
            });
        } catch (\Throwable $exception) {
            $this->deleteProofMedia($media);
            throw $exception;
        }

        if ($previous === null) {
            $this->deleteProofMedia($media);

            return $this->rejectProof('A submission is already pending or approved for this challenge.');
        }

        $this->deleteProofMedia(...$previous);
        $leaderboardService->forgetCached((int) $engagementRewardChallenge->id);

        $engagementRewardChallenge->load(['departments:id,name', 'accounts:id,name']);

        return response()->json([
            'status' => 'success',
            'message' => 'Proof submitted for review.',
            'data' => $this->formatChallenge($engagementRewardChallenge, $userId),
        ]);
    }

    /**
     * Submit one proof per calendar day for a multi-day challenge.
     */
    public function submitDailyProof(
        SubmitChallengeProofRequest $request,
        EngagementRewardChallenge $engagementRewardChallenge,
        ChallengeLeaderboardService $leaderboardService,
    ): JsonResponse
    {
        $userId = auth()->id();

        if (! $engagementRewardChallenge->isDailyChallenge()) {
            return $this->rejectProof('This challenge does not use daily submissions.');
        }

        $validated = $request->validated();

        $participant = $engagementRewardChallenge->participants()->where('user_id', $userId)->first();

        if (! $participant) {
            return $this->rejectProof('Join this challenge before submitting proof.');
        }

        $pivot = $participant->pivot;

        if ($pivot->isDailyChallengeComplete()) {
            return $this->rejectProof('You already completed this challenge.');
        }

        $today = now()->startOfDay();
        $windowEnd = $engagementRewardChallenge->dailyWindowEndDate();

        if ($today->lt($engagementRewardChallenge->start_date) || $today->gt($windowEnd)) {
            return $this->rejectProof('Today is outside this challenge\'s submission window.');
        }

        $logDate = $today->toDateString();

        if ($pivot->dailyLogs()
            ->whereNull('team_submission_id')
            ->whereDate('log_date', $logDate)
            ->exists()) {
            return $this->rejectProof("You already submitted today's proof. Come back tomorrow!");
        }

        $media = $this->storeProofMedia($request);
        $path = $media[0]['path'];

        try {
            $result = DB::transaction(function () use ($engagementRewardChallenge, $userId, $logDate, $path, $media, $validated) {
                $locked = EngagementRewardChallengeParticipant::query()
                    ->where('reward_challenge_id', $engagementRewardChallenge->id)
                    ->where('user_id', $userId)
                    ->lockForUpdate()
                    ->firstOrFail();

                if ($locked->isDailyChallengeComplete()) {
                    return 'complete';
                }

                if ($locked->dailyLogs()
                    ->whereNull('team_submission_id')
                    ->whereDate('log_date', $logDate)
                    ->exists()) {
                    return 'duplicate';
                }

                if (! $locked->hasIndividualSubmission() && $locked->hasTeamSubmission()) {
                    $locked->update([
                        'status' => 'joined',
                        'completed_days' => 0,
                        'submitted_at' => null,
                        'proof_approved_at' => null,
                        'reviewed_at' => null,
                        'reviewed_by' => null,
                        'review_note' => null,
                        'points_awarded' => null,
                        'bonus_points' => 0,
                    ]);
                }

                $locked->dailyLogs()->create([
                    'log_date' => $logDate,
                    'submission_path' => $path,
                    'submission_media' => $media,
                    'challenge_description' => $validated['challenge_description'],
                    'status' => 'submitted',
                    'submitted_at' => now(),
                ]);

                if (in_array($locked->status, ['joined', 'declined'], true)) {
                    $locked->update(['status' => 'submitted']);
                }

                return 'created';
            });
        } catch (\Illuminate\Database\QueryException $e) {
            $this->deleteProofMedia($media);

            if ($e->getCode() === '23000') {
                return response()->json([
                    'status' => 'error',
                    'message' => "You already submitted today's proof. Come back tomorrow!",
                ], 422);
            }

            throw $e;
        } catch (\Throwable $exception) {
            $this->deleteProofMedia($media);
            throw $exception;
        }

        if ($result !== 'created') {
            $this->deleteProofMedia($media);

            return $this->rejectProof($result === 'complete'
                ? 'You already completed this challenge.'
                : "You already submitted today's proof. Come back tomorrow!");
        }

        $leaderboardService->forgetCached((int) $engagementRewardChallenge->id);

        $engagementRewardChallenge->load(['departments:id,name', 'accounts:id,name']);

        return response()->json([
            'status' => 'success',
            'message' => "Day's proof submitted for review.",
            'data' => $this->formatChallenge($engagementRewardChallenge, $userId),
        ]);
    }

    public function submitTeamProof(
        SubmitTeamChallengeRequest $request,
        EngagementRewardChallenge $engagementRewardChallenge,
        ChallengeTeamSubmissionService $service,
        ChallengeLeaderboardService $leaderboardService,
    ) {
        $submission = $service->submit(
            $engagementRewardChallenge,
            $request->user(),
            $request->file('photos') ?: array_filter([$request->file('photo')]),
            $request->file('video'),
            $request->string('challenge_description')->toString(),
        );
        $leaderboardService->forgetCached((int) $engagementRewardChallenge->id);

        return (new EngagementRewardChallengeTeamSubmissionResource(
            $submission->load(['leader.account_employee', 'leader.challengeParticipations']),
        ))->response()->setStatusCode(201);
    }

    /**
     * The authenticated employee's full day-by-day log for a multi-day
     * challenge, used to render the per-day progress view. Kept as its own
     * on-demand endpoint (rather than bundled into the list/my-challenges
     * responses) so browsing the challenge list never pays for loading
     * every participant's full submission history.
     */
    public function myDailyLogs(EngagementRewardChallenge $engagementRewardChallenge): JsonResponse
    {
        $userId = auth()->id();

        $participant = $engagementRewardChallenge->participants()->where('user_id', $userId)->first();

        if (! $participant) {
            return response()->json([
                'status' => 'error',
                'message' => 'You have not joined this challenge.',
            ], 422);
        }

        $logs = $participant->pivot->dailyLogs()
            ->whereNull('team_submission_id')
            ->orderBy('log_date')
            ->get()
            ->map(fn (EngagementRewardChallengeDailyLog $log) => [
                'id' => $log->id,
                'log_date' => $log->log_date->toDateString(),
                'status' => $log->status,
                'submission_url' => Storage::disk('s3')->url($log->submission_path),
                'submission_media' => $this->proofMediaUrls($log->submission_media, $log->submission_path),
                'challenge_description' => $log->challenge_description,
                'review_note' => $log->review_note,
                'reviewed_at' => $log->reviewed_at?->toDateTimeString(),
            ]);

        return response()->json([
            'status' => 'success',
            'data' => [
                'required_days' => $participant->pivot->required_days,
                'completed_days' => $participant->pivot->completed_days,
                'logs' => $logs,
            ],
        ]);
    }

    /**
     * Display department, account & employee options for the create-challenge form.
     */
    public function options(): JsonResponse
    {
        $departments = Department::query()
            ->withCount('account_employees as employees_count')
            ->orderBy('name')
            ->get(['id', 'name']);

        $accounts = Account::query()
            ->withCount('employees as employees_count')
            ->orderBy('name')
            ->get(['id', 'name']);

        return response()->json([
            'status' => 'success',
            'data' => [
                'departments' => $departments,
                'accounts' => $accounts,
                'total_employees' => User::where('role', User::ROLE_EMPLOYEE)->count(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(
        StoreEngagementRewardChallengeRequest $request,
        ChallengeSurveyService $surveyService,
    ): JsonResponse
    {
        $validated = $request->validated();

        if (
            ! $validated['all_employees']
            && empty($validated['account_ids'])
            && empty($validated['department_ids'])
        ) {
            return response()->json([
                'status' => 'error',
                'message' => 'Select at least one department or account, or choose All Employees.',
            ], 422);
        }

        $bannerPath = null;
        if ($request->hasFile('banner') && $request->file('banner')->isValid()) {
            $bannerPath = $request->file('banner')->store('unified/engagement/reward_challenges', 's3');
        }

        try {
            $challenge = DB::transaction(function () use ($validated, $bannerPath, $surveyService) {
                $challenge = EngagementRewardChallenge::create([
                    'created_by' => auth()->id(),
                    'title' => $validated['title'],
                    'description' => $validated['description'],
                    'type' => $validated['type'],
                    'category' => $validated['category'],
                    'points' => $validated['points'],
                    'duration_days' => $validated['duration_days'] ?? null,
                    'proof_type' => $validated['proof_type'] ?? 'photo_only',
                    'banner_path' => $bannerPath,
                    'banner_position_x' => $validated['banner_position_x'] ?? 50,
                    'banner_position_y' => $validated['banner_position_y'] ?? 50,
                    'all_employees' => $validated['all_employees'],
                    'max_participants' => $validated['max_participants'] ?? null,
                    'start_date' => $validated['start_date'],
                    'deadline' => $validated['deadline'],
                    'card_color' => $validated['card_color'],
                    'status' => 'published',
                ]);

                $challenge->accounts()->sync(
                    $validated['all_employees'] ? [] : ($validated['account_ids'] ?? []),
                );
                $challenge->departments()->sync(
                    $validated['all_employees'] ? [] : ($validated['department_ids'] ?? []),
                );
                $surveyService->createForChallenge($challenge);

                return $challenge;
            });
        } catch (\Throwable $exception) {
            if ($bannerPath && ! Storage::disk('s3')->delete($bannerPath)) {
                Log::warning('Failed to remove a challenge banner after database rollback.', ['path' => $bannerPath]);
            }

            throw $exception;
        }

        $challenge->load(['creator:id,name,email', 'accounts:id,name', 'departments:id,name']);

        return response()->json([
            'status' => 'success',
            'message' => 'Challenge published successfully.',
            'data' => $this->formatChallenge($challenge),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(EngagementRewardChallenge $engagementRewardChallenge)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(EngagementRewardChallenge $engagementRewardChallenge)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        UpdateEngagementRewardChallengeRequest $request,
        EngagementRewardChallenge $engagementRewardChallenge,
    ): JsonResponse
    {
        $validated = $request->validated();

        $allEmployees = $validated['all_employees'] ?? $engagementRewardChallenge->all_employees;

        if (
            $request->has('all_employees')
            && ! $allEmployees
            && empty($validated['account_ids'])
            && empty($validated['department_ids'])
        ) {
            return response()->json([
                'status' => 'error',
                'message' => 'Select at least one department or account, or choose All Employees.',
            ], 422);
        }

        $engagementRewardChallenge->fill(
            collect($validated)->except(['banner', 'account_ids', 'department_ids'])->toArray(),
        );

        if ($request->hasFile('banner') && $request->file('banner')->isValid()) {
            if ($engagementRewardChallenge->banner_path) {
                Storage::disk('s3')->delete($engagementRewardChallenge->banner_path);
            }

            $engagementRewardChallenge->banner_path = $request->file('banner')
                ->store('unified/engagement/reward_challenges', 's3');
        }

        $engagementRewardChallenge->save();

        if ($request->has('all_employees') || $request->has('account_ids') || $request->has('department_ids')) {
            $engagementRewardChallenge->accounts()->sync(
                $allEmployees ? [] : ($validated['account_ids'] ?? []),
            );
            $engagementRewardChallenge->departments()->sync(
                $allEmployees ? [] : ($validated['department_ids'] ?? []),
            );
        }

        $engagementRewardChallenge->load(['creator:id,name,email', 'accounts:id,name', 'departments:id,name']);

        return response()->json([
            'status' => 'success',
            'message' => 'Challenge updated successfully.',
            'data' => $this->formatChallenge($engagementRewardChallenge),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EngagementRewardChallenge $engagementRewardChallenge): JsonResponse
    {
        $engagementRewardChallenge->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Challenge deleted successfully.',
        ]);
    }

    /**
     * Aggregate quarterly challenge performance and the most-joined challenges,
     * powering the admin Reports tab's "Historical Trends" widget.
     */
    public function report(): JsonResponse
    {
        $challenges = EngagementRewardChallenge::query()
            ->withCount('participants')
            ->with('participants:id')
            ->orderBy('start_date')
            ->get();

        $teamPointsByQuarter = EngagementRewardChallengeTeamSubmission::query()
            ->where('team_points_awarded', '>', 0)
            ->with(['challenge' => fn ($query) => $query->withTrashed()->select('id', 'start_date')])
            ->get()
            ->groupBy(fn (EngagementRewardChallengeTeamSubmission $submission) => $submission->challenge?->start_date
                ? $submission->challenge->start_date->year.'-Q'.(int) ceil($submission->challenge->start_date->month / 3)
                : null)
            ->map(fn ($submissions) => (int) $submissions->sum('team_points_awarded'));

        $quarters = $challenges
            ->groupBy(fn (EngagementRewardChallenge $challenge) => $challenge->start_date->year.'-Q'.(int) ceil($challenge->start_date->month / 3))
            ->map(function ($group, $key) use ($teamPointsByQuarter) {
                [$year, $quarterLabel] = explode('-', $key);
                $quarterNumber = (int) str_replace('Q', '', $quarterLabel);
                $isCurrentQuarter = (int) $year === now()->year && $quarterNumber === (int) ceil(now()->month / 3);

                $participants = $group->flatMap(fn (EngagementRewardChallenge $challenge) => $challenge->participants);
                $totalParticipants = $participants->count();
                $approvedParticipants = $participants->filter(fn (User $user) => $user->pivot->status === 'approved')->count();
                $totalPoints = (int) $participants->sum(fn (User $user) => $user->pivot->total_points_awarded)
                    + (int) $teamPointsByQuarter->get($key, 0);

                return [
                    'year' => (int) $year,
                    'quarter' => $quarterNumber,
                    'title' => "Q{$quarterNumber} {$year}".($isCurrentQuarter ? ' (YTD)' : '')." — {$group->count()} ".Str::plural('Challenge', $group->count()),
                    'completion' => $totalParticipants > 0 ? (int) round(($approvedParticipants / $totalParticipants) * 100) : 0,
                    'participants' => $totalParticipants.' '.Str::plural('participant', $totalParticipants),
                    'points' => number_format($totalPoints).' pts awarded',
                ];
            })
            ->sortBy([['year', 'asc'], ['quarter', 'asc']])
            ->values();

        $topChallenges = $challenges
            ->sortByDesc('participants_count')
            ->take(5)
            ->values()
            ->map(fn (EngagementRewardChallenge $challenge, int $index) => [
                'rank' => $index + 1,
                'title' => $challenge->title,
                'category' => $challenge->category,
                'participants' => $challenge->participants_count,
            ]);

        return response()->json([
            'status' => 'success',
            'data' => [
                'quarters' => $quarters,
                'top_challenges' => $topChallenges,
            ],
        ]);
    }

    /**
     * Stream a CSV download for one of the predefined report types shown
     * in the admin Reports tab's "Export Reports" panel.
     */
    public function exportReport(Request $request)
    {
        $validated = $request->validate([
            'type' => [
                'required',
                'in:top10_leaderboard,top20_leaderboard,full_participation,points_distribution,department_analytics,completion_details',
            ],
        ]);

        return match ($validated['type']) {
            'top10_leaderboard' => $this->exportLeaderboardCsv(10),
            'top20_leaderboard' => $this->exportLeaderboardCsv(20),
            'full_participation' => $this->exportParticipationCsv(),
            'points_distribution' => $this->exportPointsDistributionCsv(),
            'department_analytics' => $this->exportDepartmentAnalyticsCsv(),
            'completion_details' => $this->exportCompletionDetailsCsv(),
        };
    }

    private function exportLeaderboardCsv(int $limit)
    {
        $rows = EngagementRewardChallengeParticipant::query()
            ->with(['user:id,name,email', 'challenge:id,title'])
            ->orderByRaw(EngagementRewardChallengeParticipant::TOTAL_POINTS_SQL.' DESC')
            ->limit($limit)
            ->get()
            ->map(fn (EngagementRewardChallengeParticipant $participant) => [
                'name' => $participant->user?->name ?? 'N/A',
                'email' => $participant->user?->email ?? 'N/A',
                'challenge' => $participant->challenge?->title ?? 'N/A',
                'points' => $participant->total_points_awarded,
                'status' => ucfirst($participant->status),
                'challenge_points' => (int) $participant->points_awarded,
                'survey_points' => (int) $participant->survey_points_awarded,
            ]);
        $teamAwards = EngagementRewardChallengeTeamSubmission::query()
            ->where('team_points_awarded', '>', 0)
            ->with(['leader:id,name,email', 'challenge:id,title'])
            ->orderByDesc('team_points_awarded')
            ->limit($limit)
            ->get()
            ->map(fn (EngagementRewardChallengeTeamSubmission $submission) => [
                'name' => $submission->leader?->name ?? 'N/A',
                'email' => $submission->leader?->email ?? 'N/A',
                'challenge' => $submission->challenge?->title ?? 'N/A',
                'points' => (int) $submission->team_points_awarded,
                'status' => 'Approved (Team)',
                'challenge_points' => (int) $submission->team_points_awarded,
                'survey_points' => 0,
            ]);
        $rows = $rows->concat($teamAwards)
            ->sortByDesc('points')
            ->take($limit)
            ->values();

        return $this->streamCsv("top{$limit}_leaderboard.csv", ['Rank', 'Name', 'Email', 'Challenge', 'Points Awarded', 'Status', 'Challenge Points', 'Survey Points'], function ($handle) use ($rows) {
            foreach ($rows as $index => $row) {
                fputcsv($handle, [
                    $index + 1,
                    $row['name'],
                    $row['email'],
                    $row['challenge'],
                    $row['points'],
                    $row['status'],
                    $row['challenge_points'],
                    $row['survey_points'],
                ]);
            }
        });
    }

    private function exportParticipationCsv()
    {
        $participants = EngagementRewardChallengeParticipant::query()
            ->with(['user:id,name,email', 'user.department:id,name', 'challenge:id,title,category'])
            ->orderByDesc('joined_at')
            ->get();
        $teamAwards = EngagementRewardChallengeTeamSubmission::query()
            ->where('team_points_awarded', '>', 0)
            ->with(['leader:id,name,email', 'leader.account_employee.department:id,name', 'challenge:id,title,category'])
            ->get();

        return $this->streamCsv('full_participation_report.csv', ['Name', 'Email', 'Department', 'Challenge', 'Category', 'Status', 'Points Awarded', 'Joined At', 'Submitted At', 'Challenge Points', 'Survey Points'], function ($handle) use ($participants, $teamAwards) {
            foreach ($participants as $participant) {
                fputcsv($handle, [
                    $participant->user?->name ?? 'N/A',
                    $participant->user?->email ?? 'N/A',
                    $participant->user?->department?->name ?? 'N/A',
                    $participant->challenge?->title ?? 'N/A',
                    $participant->challenge?->category ?? 'N/A',
                    ucfirst($participant->status),
                    $participant->total_points_awarded,
                    optional($participant->joined_at)->toDateTimeString() ?? '',
                    optional($participant->submitted_at)->toDateTimeString() ?? '',
                    (int) $participant->points_awarded,
                    (int) $participant->survey_points_awarded,
                ]);
            }
            foreach ($teamAwards as $submission) {
                fputcsv($handle, [
                    $submission->leader?->name ?? 'N/A',
                    $submission->leader?->email ?? 'N/A',
                    $submission->leader?->account_employee?->department?->name ?? 'Unassigned',
                    $submission->challenge?->title ?? 'Challenge removed',
                    $submission->challenge?->category ?? 'N/A',
                    'Approved (Team)',
                    (int) $submission->team_points_awarded,
                    $submission->log_date?->toDateTimeString() ?? '',
                    $submission->submitted_at?->toDateTimeString() ?? '',
                    (int) $submission->team_points_awarded,
                    0,
                ]);
            }
        });
    }

    private function exportPointsDistributionCsv()
    {
        $individualPoints = EngagementRewardChallengeParticipant::query()
            ->selectRaw("user_id, SUM(".EngagementRewardChallengeParticipant::TOTAL_POINTS_SQL.") as total_points, SUM(COALESCE(survey_points_awarded, 0)) as survey_points, COUNT(CASE WHEN status = 'approved' THEN 1 END) as challenges_completed")
            ->groupBy('user_id')
            ->get();
        $teamPointsByLeader = EngagementRewardChallengeTeamSubmission::query()
            ->where('team_points_awarded', '>', 0)
            ->selectRaw('leader_id, SUM(team_points_awarded) as team_points')
            ->groupBy('leader_id')
            ->pluck('team_points', 'leader_id');
        $users = User::query()
            ->whereIn('id', $individualPoints->pluck('user_id')->merge($teamPointsByLeader->keys())->unique())
            ->get(['id', 'name', 'email'])
            ->keyBy('id');
        $individualPointsByUser = $individualPoints->keyBy('user_id');
        $rows = $users->map(function (User $user) use ($individualPointsByUser, $teamPointsByLeader) {
            $individual = $individualPointsByUser->get($user->id);

            return [
                'user' => $user,
                'total_points' => (int) ($individual?->total_points ?? 0)
                    + (int) $teamPointsByLeader->get($user->id, 0),
                'survey_points' => (int) ($individual?->survey_points ?? 0),
                'challenges_completed' => (int) ($individual?->challenges_completed ?? 0),
            ];
        })->sortByDesc('total_points')->values();

        return $this->streamCsv('points_distribution_report.csv', ['Name', 'Email', 'Total Points', 'Challenges Completed', 'Survey Points'], function ($handle) use ($rows) {
            foreach ($rows as $row) {
                fputcsv($handle, [
                    $row['user']->name ?? 'N/A',
                    $row['user']->email ?? 'N/A',
                    $row['total_points'],
                    $row['challenges_completed'],
                    $row['survey_points'],
                ]);
            }
        });
    }

    private function exportDepartmentAnalyticsCsv()
    {
        $departmentIdsByUser = AccountEmployee::query()
            ->whereNotNull('department_id')
            ->pluck('department_id', 'user_id');
        $participants = EngagementRewardChallengeParticipant::query()
            ->get(['user_id', 'status', 'points_awarded', 'bonus_points', 'survey_points_awarded'])
            ->groupBy(fn (EngagementRewardChallengeParticipant $participant) => $departmentIdsByUser->get($participant->user_id, 0));

        $teamPointsByDepartment = EngagementRewardChallengeTeamSubmission::query()
            ->leftJoin('account_employees', 'account_employees.user_id', '=', 'engagement_reward_challenge_team_submissions.leader_id')
            ->where('team_points_awarded', '>', 0)
            ->selectRaw('COALESCE(account_employees.department_id, 0) as department_id, SUM(team_points_awarded) as team_points')
            ->groupByRaw('COALESCE(account_employees.department_id, 0)')
            ->pluck('team_points', 'department_id');
        $departmentIds = $participants->keys()
            ->merge($teamPointsByDepartment->keys())
            ->unique();
        $departments = Department::whereIn('id', $departmentIds->filter())->pluck('name', 'id');

        return $this->streamCsv('department_analytics_report.csv', ['Department', 'Total Participants', 'Completed', 'Completion Rate', 'Total Points'], function ($handle) use ($participants, $teamPointsByDepartment, $departmentIds, $departments) {
            foreach ($departmentIds as $departmentId) {
                $group = $participants->get($departmentId, collect());
                $total = $group->count();
                $completed = $group->where('status', 'approved')->count();
                $points = (int) $group->sum('total_points_awarded')
                    + (int) $teamPointsByDepartment->get($departmentId, 0);

                fputcsv($handle, [
                    $departments[$departmentId] ?? 'Unassigned',
                    $total,
                    $completed,
                    $total > 0 ? round(($completed / $total) * 100).'%' : '0%',
                    $points,
                ]);
            }
        });
    }

    private function exportCompletionDetailsCsv()
    {
        $challenges = EngagementRewardChallenge::query()
            ->withCount('participants')
            ->with('participants:id')
            ->get();

        return $this->streamCsv('completion_details_report.csv', ['Challenge', 'Category', 'Start Date', 'Deadline', 'Participants', 'Completed', 'Completion Rate'], function ($handle) use ($challenges) {
            foreach ($challenges as $challenge) {
                $total = $challenge->participants_count;
                $completed = $challenge->participants->filter(fn (User $user) => $user->pivot->status === 'approved')->count();

                fputcsv($handle, [
                    $challenge->title,
                    $challenge->category,
                    $challenge->start_date->toDateString(),
                    $challenge->deadline->toDateString(),
                    $total,
                    $completed,
                    $total > 0 ? round(($completed / $total) * 100).'%' : '0%',
                ]);
            }
        });
    }

    /**
     * Shared CSV streaming helper so each export only needs to supply its header and row writer.
     */
    private function streamCsv(string $filename, array $header, callable $writeRows)
    {
        return response()->streamDownload(function () use ($header, $writeRows) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, $header);
            $writeRows($handle);
            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }

    /**
     * Admin "Employee Profiles" tab: every employee who has joined at least one
     * challenge, with their RnR points, department, last activity, and status.
     * Accepts optional `department` and `search` (name or employee ID) filters.
     */
    public function employeeProfiles(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'department' => ['nullable', 'string', 'max:255'],
            'search' => ['nullable', 'string', 'max:255'],
        ]);

        $allEmployees = $this->buildEmployeeProfiles();

        $filtered = $allEmployees->filter(function (array $employee) use ($validated) {
            $matchesDepartment = empty($validated['department'])
                || $validated['department'] === 'All'
                || $employee['department'] === $validated['department'];

            $matchesSearch = empty($validated['search']) || str_contains(
                strtolower($employee['name'].' '.$employee['employee_id']),
                strtolower($validated['search']),
            );

            return $matchesDepartment && $matchesSearch;
        })->values();

        $totalEmployees = $allEmployees->count();
        $avgPoints = $totalEmployees > 0 ? (int) round($allEmployees->avg('points')) : 0;
        $topEngager = $allEmployees->sortByDesc('points')->first();
        $atRiskCount = $allEmployees->where('points', 0)->count();

        $departments = Department::orderBy('name')->pluck('name')->values();

        return response()->json([
            'status' => 'success',
            'data' => [
                'summary' => [
                    'total_employees' => $totalEmployees,
                    'avg_points' => $avgPoints,
                    'top_engager' => $topEngager ? [
                        'name' => $topEngager['name'],
                        'points' => $topEngager['points'],
                        'department' => $topEngager['department'],
                    ] : null,
                    'at_risk_count' => $atRiskCount,
                ],
                'employees' => $filtered,
                'departments' => $departments,
            ],
        ]);
    }

    /**
     * Stream a CSV of the employee profiles, honoring the same filters as employeeProfiles().
     */
    public function exportEmployeeProfiles(Request $request)
    {
        $validated = $request->validate([
            'department' => ['nullable', 'string', 'max:255'],
            'search' => ['nullable', 'string', 'max:255'],
        ]);

        $employees = $this->buildEmployeeProfiles()->filter(function (array $employee) use ($validated) {
            $matchesDepartment = empty($validated['department'])
                || $validated['department'] === 'All'
                || $employee['department'] === $validated['department'];

            $matchesSearch = empty($validated['search']) || str_contains(
                strtolower($employee['name'].' '.$employee['employee_id']),
                strtolower($validated['search']),
            );

            return $matchesDepartment && $matchesSearch;
        })->values();

        return $this->streamCsv('employee_profiles.csv', ['Employee Name', 'Employee ID', 'Department', 'Position', 'Points', 'Last Active', 'Status'], function ($handle) use ($employees) {
            foreach ($employees as $employee) {
                fputcsv($handle, [
                    $employee['name'],
                    $employee['employee_id'],
                    $employee['department'],
                    $employee['position'],
                    $employee['points'],
                    $employee['last_active'] ?? '',
                    $employee['status'],
                ]);
            }
        });
    }

    /**
     * Build RnR profiles for employees who joined a challenge or earned a team award.
     *
     * @return \Illuminate\Support\Collection<int, array>
     */
    private function buildEmployeeProfiles(): \Illuminate\Support\Collection
    {
        $participantUserIds = EngagementRewardChallengeParticipant::query()
            ->distinct()
            ->pluck('user_id');
        $teamPointsByLeader = EngagementRewardChallengeTeamSubmission::query()
            ->where('team_points_awarded', '>', 0)
            ->selectRaw('leader_id, SUM(team_points_awarded) as team_points')
            ->groupBy('leader_id')
            ->pluck('team_points', 'leader_id');
        $employeeUserIds = $participantUserIds->merge($teamPointsByLeader->keys())->unique();

        $users = User::query()
            ->whereIn('id', $employeeUserIds)
            ->whereIn('role', [User::ROLE_ADMIN, User::ROLE_EMPLOYEE])
            ->with(['account_employee.department:id,name'])
            ->get(['id', 'name']);

        $participantsByUser = EngagementRewardChallengeParticipant::query()
            ->whereIn('user_id', $participantUserIds)
            ->get(['user_id', 'status', 'points_awarded', 'survey_points_awarded', 'survey_rewarded_at', 'joined_at', 'submitted_at', 'reviewed_at'])
            ->groupBy('user_id');

        return $users->map(function (User $user) use ($participantsByUser, $teamPointsByLeader) {
            $participants = $participantsByUser->get($user->id, collect());
            $employee = $user->account_employee;

            $points = (int) $participants->sum('total_points_awarded')
                + (int) $teamPointsByLeader->get($user->id, 0);

            $lastActive = $participants
                ->flatMap(fn (EngagementRewardChallengeParticipant $p) => array_filter([
                    $p->joined_at, $p->submitted_at, $p->reviewed_at, $p->survey_rewarded_at,
                ]))
                ->sort()
                ->last();

            return [
                'user_id' => $user->id,
                'name' => $user->name,
                'employee_id' => $employee?->employee_id ?? 'N/A',
                'department' => $employee?->department?->name ?? 'Unassigned',
                'position' => $employee?->position ?? 'N/A',
                'points' => $points,
                'last_active' => $lastActive?->toDateTimeString(),
                'status' => $employee?->employment_status ? 'Inactive' : 'Active',
            ];
        })->values();
    }
}
