<?php

namespace App\Http\Controllers\API\Engagement;

use App\Http\Controllers\Controller;
use App\Http\Requests\Engagement\ApproveChallengeSubmissionRequest;
use App\Http\Resources\Engagement\EngagementRewardChallengeTeamSubmissionResource;
use App\Models\Account\AccountEmployee;
use App\Models\Engagement\EngagementRewardChallenge;
use App\Models\Engagement\EngagementRewardChallengeDailyLog;
use App\Models\Engagement\EngagementRewardChallengeParticipant;
use App\Models\Engagement\EngagementRewardChallengeTeamSubmission;
use App\Models\Engagement\EngagementRewardChallengeTeamSubmissionMember;
use App\Models\Location;
use App\Services\ChallengeLeaderboardService;
use App\Services\ChallengeCompletionService;
use App\Services\ChallengeTeamSubmissionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class EngagementChallengeSubmissionsController extends Controller
{
    public function __construct(
        private ChallengeCompletionService $completionService,
        private ChallengeTeamSubmissionService $teamSubmissionService,
        private ChallengeLeaderboardService $leaderboardService,
    ) {}

    /**
     * List challenge proof submissions (excludes participants who haven't submitted yet).
     *
     * Single-proof challenges are tracked directly on the participant row;
     * multi-day challenges log one row per day in a separate table. Both are
     * merged here into one list so the admin review screen needs no changes
     * to support either challenge type. Daily log ids are prefixed
     * ("daily-123") so approve()/decline() can tell the two apart.
     */
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['nullable', 'string', 'in:submitted,approved,declined'],
            'challenge_id' => ['nullable', 'integer', 'exists:engagement_reward_challenges,id'],
            'location_id' => ['nullable', 'integer', 'exists:locations,id'],
            'search' => ['nullable', 'string', 'max:255'],
            'type' => ['nullable', 'string', 'in:individual,team'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        // Passing a type switches to database pagination; without it the
        // original full-list response is kept for existing consumers.
        if (! empty($validated['type'])) {
            return response()->json([
                'status' => 'success',
                ...$this->paginatedSubmissions($validated, $request),
            ]);
        }

        return response()->json([
            'status' => 'success',
            'data' => $this->buildSubmissionsCollection($validated),
        ]);
    }

    public function teamIndex(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', EngagementRewardChallengeTeamSubmission::class);

        $validated = $request->validate([
            'status' => ['nullable', 'string', 'in:submitted,approved,declined'],
            'challenge_id' => ['nullable', 'integer', 'exists:engagement_reward_challenges,id'],
            'location_id' => ['nullable', 'integer', 'exists:locations,id'],
            'search' => ['nullable', 'string', 'max:255'],
        ]);
        $search = trim((string) ($validated['search'] ?? ''));

        $submissions = EngagementRewardChallengeTeamSubmission::query()
            ->with([
                'challenge' => fn ($query) => $query->withTrashed(),
                'leader.account_employee.department',
                'leader.account_employee.account',
                'leader.challengeParticipations',
                'members.participant',
            ])
            ->when($validated['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->when($validated['challenge_id'] ?? null, fn ($query, $id) => $query->where('reward_challenge_id', $id))
            ->when($validated['location_id'] ?? null, fn ($query, $id) => $query->whereHas('members', fn ($members) => $members->where('location_id', $id)))
            ->when($search !== '', fn ($query) => $query->where(function ($searchQuery) use ($search) {
                $searchQuery->whereHas('leader', fn ($leader) => $leader->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('members', fn ($members) => $members->where('full_name', 'like', "%{$search}%"));
            }))
            ->latest('submitted_at')
            ->get()
            ->map(fn ($submission) => (new EngagementRewardChallengeTeamSubmissionResource($submission))->resolve($request))
            ->values();

        return response()->json([
            'status' => 'success',
            'data' => $submissions,
        ]);
    }

    public function export(Request $request)
    {
        $validated = $request->validate([
            'status' => ['nullable', 'string', 'in:submitted,approved,declined'],
            'challenge_id' => ['nullable', 'integer', 'exists:engagement_reward_challenges,id'],
            'location_id' => ['nullable', 'integer', 'exists:locations,id'],
            'search' => ['nullable', 'string', 'max:255'],
            'submission_type' => ['nullable', 'string', 'in:individual,team'],
        ]);

        $submissions = $this->buildSubmissionsCollection($validated)
            ->when(
                ($validated['submission_type'] ?? null) === 'team',
                fn (Collection $submissions) => $submissions
                    ->filter(fn (array $submission) => ! empty($submission['employees'])),
                fn (Collection $submissions) => ($validated['submission_type'] ?? null) === 'individual'
                    ? $submissions->filter(fn (array $submission) => empty($submission['employees']))
                    : $submissions,
            )
            ->values();

        return response()->streamDownload(function () use ($submissions) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['EOID', 'Fullname', 'Email', 'Challenge Title', 'Department', 'Account', 'Base Points', 'Bonus Points', 'Total Points'], "\t");

            foreach ($submissions as $submission) {
                $employee = $submission['employee'] ?? [];
                $isApproved = ($submission['status'] ?? null) === 'approved';
                $bonusPoints = $isApproved
                    ? (int) ($submission['bonus_points_awarded'] ?? 0)
                    : 0;
                $totalPoints = 0;
                if ($isApproved) {
                    $totalPoints = ! empty($submission['employees'])
                        ? (int) ($submission['team_points_awarded'] ?? $submission['total_points_awarded'] ?? 0)
                        : (int) ($submission['points_awarded']
                            ?? (! empty($submission['individual_daily_log']) ? $submission['bonus_points'] : 0));
                }
                $basePoints = max(0, $totalPoints - $bonusPoints);

                fputcsv($handle, [
                    $employee['eoid'] ?? '',
                    $employee['name'] ?? '',
                    $employee['email'] ?? '',
                    $submission['challenge']['title'] ?? '',
                    $employee['department_name'] ?? '',
                    $employee['account_name'] ?? '',
                    $basePoints,
                    $bonusPoints,
                    $basePoints + $bonusPoints,
                ], "\t");
            }

            fclose($handle);
        }, 'challenge_submissions_'.now()->format('Ymd_His').'.xls', [
            'Content-Type' => 'application/vnd.ms-excel',
        ]);
    }

    /**
     * Counts for the submissions dashboard cards.
     */
    public function stats(): JsonResponse
    {
        $participantCounts = EngagementRewardChallengeParticipant::query()
            ->whereNotIn('id', $this->teamSubmissionParticipantIds())
            ->whereNotNull('submitted_at')
            ->selectRaw("CASE WHEN proof_approved_at IS NOT NULL THEN 'approved' ELSE status END as review_status, count(*) as total")
            ->groupBy('review_status')
            ->pluck('total', 'review_status');

        $dailyLogCounts = EngagementRewardChallengeDailyLog::query()
            ->whereNull('team_submission_id')
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');
        $teamSubmissionCounts = EngagementRewardChallengeTeamSubmission::query()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return response()->json([
            'status' => 'success',
            'data' => [
                'pending' => $participantCounts->get('submitted', 0) + $dailyLogCounts->get('submitted', 0) + $teamSubmissionCounts->get('submitted', 0),
                'approved' => $participantCounts->get('approved', 0) + $dailyLogCounts->get('approved', 0) + $teamSubmissionCounts->get('approved', 0),
                'rejected' => $participantCounts->get('declined', 0) + $dailyLogCounts->get('declined', 0) + $teamSubmissionCounts->get('declined', 0),
            ],
        ]);
    }

    /**
     * Approve a submission (single-proof participant or one daily log) and
     * award points once the challenge requirement is actually met.
     */
    public function approve(ApproveChallengeSubmissionRequest $request, string $id): JsonResponse
    {
        $bonusPoints = (int) ($request->validated('bonus_points') ?? 0);

        if (str_starts_with($id, 'team-')) {
            $submission = EngagementRewardChallengeTeamSubmission::query()->findOrFail((int) substr($id, 5));
            Gate::authorize('review', $submission);
            $approved = $this->teamSubmissionService->approve($submission, auth()->user(), $bonusPoints);
            $this->leaderboardService->forgetCached((int) $submission->reward_challenge_id);

            return response()->json([
                'status' => 'success',
                'message' => 'Team submission approved.',
                'data' => (new EngagementRewardChallengeTeamSubmissionResource(
                    $approved->load(['leader.account_employee', 'leader.challengeParticipations']),
                ))->resolve(request()),
            ]);
        }

        if (str_starts_with($id, 'daily-')) {
            return $this->approveDailyLog((int) substr($id, 6), $bonusPoints);
        }

        return DB::transaction(function () use ($id, $bonusPoints) {
            $participant = EngagementRewardChallengeParticipant::lockForUpdate()->findOrFail((int) $id);

            if ($participant->status !== 'submitted' || $participant->proof_approved_at !== null) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Only pending submissions can be approved.',
                ], 422);
            }

            $participant->loadMissing(['challenge' => fn ($query) => $query->withTrashed()]);

            if (! $participant->challenge) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'The challenge for this submission no longer exists.',
                ], 422);
            }

            $participant->update([
                'proof_approved_at' => now(),
                'reviewed_at' => now(),
                'reviewed_by' => auth()->id(),
                'review_note' => null,
                'bonus_points' => $bonusPoints,
            ]);
            $completed = $this->completionService->finalizeLocked($participant);
            $this->leaderboardService->forgetAfterCommit((int) $participant->reward_challenge_id);

            return response()->json([
                'status' => 'success',
                'message' => $completed ? 'Submission approved and points awarded.' : 'Proof approved. Challenge completion is waiting for the employee survey.',
                'data' => $this->formatSubmission($participant->fresh(['user'])->load(['challenge' => fn ($query) => $query->withTrashed()])),
            ]);
        });
    }

    /**
     * Decline a submission (single-proof participant or one daily log) with an optional reason.
     */
    public function decline(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'review_note' => ['nullable', 'string', 'max:1000'],
        ]);

        if (str_starts_with($id, 'daily-')) {
            return $this->declineDailyLog((int) substr($id, 6), $validated['review_note'] ?? null);
        }

        if (str_starts_with($id, 'team-')) {
            $submission = EngagementRewardChallengeTeamSubmission::query()->findOrFail((int) substr($id, 5));
            Gate::authorize('review', $submission);
            $declined = $this->teamSubmissionService->decline(
                $submission,
                $request->user(),
                $validated['review_note'] ?? null,
            );
            $this->leaderboardService->forgetCached((int) $submission->reward_challenge_id);

            return response()->json([
                'status' => 'success',
                'message' => 'Team submission declined.',
                'data' => (new EngagementRewardChallengeTeamSubmissionResource(
                    $declined->load(['leader.account_employee', 'leader.challengeParticipations']),
                ))->resolve($request),
            ]);
        }

        return DB::transaction(function () use ($id, $validated) {
            $participant = EngagementRewardChallengeParticipant::lockForUpdate()->findOrFail((int) $id);

            if ($participant->status !== 'submitted' || $participant->proof_approved_at !== null) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Only pending submissions can be declined.',
                ], 422);
            }

            $participant->update([
                'status' => 'declined',
                'reviewed_at' => now(),
                'reviewed_by' => auth()->id(),
                'review_note' => $validated['review_note'] ?? null,
            ]);
            $this->leaderboardService->forgetAfterCommit((int) $participant->reward_challenge_id);

            return response()->json([
                'status' => 'success',
                'message' => 'Submission declined.',
                'data' => $this->formatSubmission($participant->fresh(['user'])->load(['challenge' => fn ($query) => $query->withTrashed()])),
            ]);
        });
    }

    /**
     * Approve one day's log. Missed/declined days never count, so completion
     * is simply "enough approved days", checked with a single integer
     * comparison rather than recomputing anything from the logs table.
     */
    private function approveDailyLog(int $logId, int $bonusPoints): JsonResponse
    {
        return DB::transaction(function () use ($logId, $bonusPoints) {
            $participantId = EngagementRewardChallengeDailyLog::findOrFail($logId)->reward_challenge_participant_id;
            $participant = EngagementRewardChallengeParticipant::lockForUpdate()->findOrFail($participantId);
            $participant->load(['challenge' => fn ($query) => $query->withTrashed(), 'user:id,name,email']);
            $log = EngagementRewardChallengeDailyLog::lockForUpdate()->findOrFail($logId);
            $log->setRelation('participant', $participant);

            if ($log->status !== 'submitted') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Only pending submissions can be approved.',
                ], 422);
            }

            $challenge = $participant->challenge;

            if (! $challenge) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'The challenge for this submission no longer exists.',
                ], 422);
            }

            $log->update([
                'status' => 'approved',
                'reviewed_at' => now(),
                'reviewed_by' => auth()->id(),
                'review_note' => null,
                'bonus_points' => $bonusPoints,
            ]);

            $participant->increment('bonus_points', $bonusPoints);
            $participant->refresh();
            $participant->increment('completed_days');
            $participant->refresh();

            if ($participant->isDailyChallengeComplete() && $participant->proof_approved_at === null) {
                $participant->update([
                    'proof_approved_at' => now(),
                    'reviewed_at' => now(),
                    'reviewed_by' => auth()->id(),
                ]);
            }
            $completed = $this->completionService->finalizeLocked($participant);
            $this->leaderboardService->forgetAfterCommit((int) $participant->reward_challenge_id);

            return response()->json([
                'status' => 'success',
                'message' => $completed
                    ? 'Day approved — challenge complete, points awarded!'
                    : ($participant->status === 'pending_survey' ? 'Day approved. Challenge completion is waiting for the employee survey.' : 'Day approved.'),
                'data' => $this->formatDailyLog($log->fresh(['participant.challenge', 'participant.user'])),
            ]);
        });
    }

    /**
     * Decline one day's log. The day is simply forfeited — it does not count
     * toward completed_days, and the employee may still submit future days.
     */
    private function declineDailyLog(int $logId, ?string $reviewNote): JsonResponse
    {
        return DB::transaction(function () use ($logId, $reviewNote) {
            $participantId = EngagementRewardChallengeDailyLog::findOrFail($logId)->reward_challenge_participant_id;
            EngagementRewardChallengeParticipant::lockForUpdate()->findOrFail($participantId);
            $log = EngagementRewardChallengeDailyLog::with([
                'participant.challenge' => fn ($query) => $query->withTrashed(),
                'participant.user:id,name,email',
            ])->lockForUpdate()->findOrFail($logId);

            if ($log->status !== 'submitted') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Only pending submissions can be declined.',
                ], 422);
            }

            $log->update([
                'status' => 'declined',
                'reviewed_at' => now(),
                'reviewed_by' => auth()->id(),
                'review_note' => $reviewNote,
            ]);
            $this->leaderboardService->forgetAfterCommit((int) $log->participant->reward_challenge_id);

            return response()->json([
                'status' => 'success',
                'message' => 'Day declined.',
                'data' => $this->formatDailyLog($log->fresh(['participant.challenge', 'participant.user'])),
            ]);
        });
    }

    private function buildSubmissionsCollection(array $filters): Collection
    {
        $singleSubmissions = $this->singleSubmissionsQuery($filters)
            ->with($this->singleSubmissionRelations())
            ->get()
            ->map(fn (EngagementRewardChallengeParticipant $participant) => $this->formatSubmission($participant));

        $dailySubmissions = $this->dailySubmissionsQuery($filters)
            ->with($this->dailySubmissionRelations())
            ->get()
            ->map(fn (EngagementRewardChallengeDailyLog $log) => $this->formatDailyLog($log));

        $teamSubmissions = $this->teamSubmissionsQuery($filters)
            ->with($this->teamSubmissionRelations())
            ->get()
            ->map(fn ($submission) => (new EngagementRewardChallengeTeamSubmissionResource($submission))->resolve(request()));

        return $singleSubmissions->concat($dailySubmissions)
            ->concat($teamSubmissions)
            ->sortByDesc('submitted_at')
            ->values();
    }

    /**
     * One page of a single submission type, paginated in the database so the
     * admin screen never downloads every submission at once.
     */
    private function paginatedSubmissions(array $filters, Request $request): array
    {
        $perPage = (int) ($filters['per_page'] ?? 10);
        $page = (int) ($filters['page'] ?? 1);

        if ($filters['type'] === 'team') {
            $paginator = $this->teamSubmissionsQuery($filters)
                ->with($this->teamSubmissionRelations())
                ->orderByDesc('submitted_at')
                ->orderByDesc('id')
                ->paginate($perPage, ['*'], 'page', $page);
            $rows = $paginator->getCollection()
                ->map(fn ($submission) => (new EngagementRewardChallengeTeamSubmissionResource($submission))->resolve($request))
                ->values();
        } else {
            // Single-proof rows and daily logs live in different tables, so page
            // through a lightweight UNION of their ids, then hydrate only this page.
            $singleTable = (new EngagementRewardChallengeParticipant)->getTable();
            $dailyTable = (new EngagementRewardChallengeDailyLog)->getTable();
            $union = $this->singleSubmissionsQuery($filters)
                ->toBase()
                ->select([DB::raw("'single' as kind"), "{$singleTable}.id", "{$singleTable}.submitted_at"])
                ->unionAll(
                    $this->dailySubmissionsQuery($filters)
                        ->toBase()
                        ->select([DB::raw("'daily' as kind"), "{$dailyTable}.id", "{$dailyTable}.submitted_at"])
                );
            $paginator = DB::query()
                ->fromSub($union, 'individual_submissions')
                ->orderByDesc('submitted_at')
                ->orderBy('kind')
                ->orderByDesc('id')
                ->paginate($perPage, ['*'], 'page', $page);
            $keys = collect($paginator->items());
            $singles = EngagementRewardChallengeParticipant::query()
                ->with($this->singleSubmissionRelations())
                ->whereKey($keys->where('kind', 'single')->pluck('id')->all())
                ->get()
                ->keyBy('id');
            $dailyLogs = EngagementRewardChallengeDailyLog::query()
                ->with($this->dailySubmissionRelations())
                ->whereKey($keys->where('kind', 'daily')->pluck('id')->all())
                ->get()
                ->keyBy('id');
            $rows = $keys
                ->map(fn ($key) => $key->kind === 'single'
                    ? ($singles->has($key->id) ? $this->formatSubmission($singles[$key->id]) : null)
                    : ($dailyLogs->has($key->id) ? $this->formatDailyLog($dailyLogs[$key->id]) : null))
                ->filter()
                ->values();
        }

        return [
            'data' => $rows,
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ],
            'links' => [
                'first' => $paginator->url(1),
                'last' => $paginator->url($paginator->lastPage()),
                'prev' => $paginator->previousPageUrl(),
                'next' => $paginator->nextPageUrl(),
            ],
            'counts' => [
                'individual' => $this->singleSubmissionsQuery($filters)->count()
                    + $this->dailySubmissionsQuery($filters)->count(),
                'team' => $this->teamSubmissionsQuery($filters)->count(),
            ],
            'filter_options' => $this->submissionFilterOptions(),
        ];
    }

    /**
     * Challenge and location choices for the admin filters, taken from every
     * submission rather than only the rows on the current page.
     */
    private function submissionFilterOptions(): array
    {
        $submittedParticipants = fn () => EngagementRewardChallengeParticipant::query()
            ->where(fn ($query) => $query
                ->whereNotNull('submitted_at')
                ->orWhereHas('dailyLogs', fn ($logs) => $logs->whereNull('team_submission_id')));

        $challengeIds = $submittedParticipants()
            ->distinct()
            ->pluck('reward_challenge_id')
            ->merge(EngagementRewardChallengeTeamSubmission::query()->distinct()->pluck('reward_challenge_id'))
            ->unique()
            ->values()
            ->all();
        $challenges = EngagementRewardChallenge::withTrashed()
            ->whereKey($challengeIds)
            ->latest()
            ->get(['id', 'title'])
            ->map(fn ($challenge) => ['value' => $challenge->id, 'label' => $challenge->title])
            ->values();

        $locationIds = AccountEmployee::query()
            ->whereIn('user_id', $submittedParticipants()->select('user_id'))
            ->whereNotNull('location_id')
            ->distinct()
            ->pluck('location_id')
            ->merge(EngagementRewardChallengeTeamSubmissionMember::query()
                ->whereNotNull('location_id')
                ->distinct()
                ->pluck('location_id'))
            ->unique()
            ->values()
            ->all();
        $locations = Location::query()
            ->whereKey($locationIds)
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn ($location) => ['value' => $location->id, 'label' => $location->name])
            ->values();

        return [
            'challenges' => $challenges,
            'locations' => $locations,
        ];
    }

    private function singleSubmissionsQuery(array $filters)
    {
        $status = $filters['status'] ?? null;
        $search = trim((string) ($filters['search'] ?? ''));

        return EngagementRewardChallengeParticipant::query()
            ->whereNotIn('id', $this->teamSubmissionParticipantIds())
            ->whereNotNull('submitted_at')
            ->when($status, fn ($query, $value) => $value === 'approved'
                ? $query->where(fn ($q) => $q->where('status', 'approved')->orWhereNotNull('proof_approved_at'))
                : $query->where('status', $value)->when($value === 'submitted', fn ($q) => $q->whereNull('proof_approved_at')))
            ->when($filters['challenge_id'] ?? null, fn ($query, $value) => $query->where('reward_challenge_id', $value))
            ->when($filters['location_id'] ?? null, fn ($query, $value) => $query->whereHas('user.account_employee', fn ($locationQuery) => $locationQuery->where('location_id', $value)))
            ->when($search !== '', fn ($query) => $query->whereHas('user', function ($userQuery) use ($search) {
                $userQuery->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            }));
    }

    private function dailySubmissionsQuery(array $filters)
    {
        $search = trim((string) ($filters['search'] ?? ''));

        return EngagementRewardChallengeDailyLog::query()
            ->whereNull('team_submission_id')
            ->when($filters['status'] ?? null, fn ($query, $value) => $query->where('status', $value))
            ->when($filters['challenge_id'] ?? null, fn ($query, $value) => $query->whereHas('participant', fn ($participantQuery) => $participantQuery->where('reward_challenge_id', $value)))
            ->when($filters['location_id'] ?? null, fn ($query, $value) => $query->whereHas('participant.user.account_employee', fn ($locationQuery) => $locationQuery->where('location_id', $value)))
            ->when($search !== '', fn ($query) => $query->whereHas('participant.user', function ($userQuery) use ($search) {
                $userQuery->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            }));
    }

    private function teamSubmissionsQuery(array $filters)
    {
        $search = trim((string) ($filters['search'] ?? ''));

        return EngagementRewardChallengeTeamSubmission::query()
            ->when($filters['status'] ?? null, fn ($query, $value) => $query->where('status', $value))
            ->when($filters['challenge_id'] ?? null, fn ($query, $value) => $query->where('reward_challenge_id', $value))
            ->when($filters['location_id'] ?? null, fn ($query, $value) => $query->whereHas('members', fn ($members) => $members->where('location_id', $value)))
            ->when($search !== '', fn ($query) => $query->where(function ($searchQuery) use ($search) {
                $searchQuery->whereHas('leader', fn ($leader) => $leader->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('members', fn ($members) => $members->where('full_name', 'like', "%{$search}%"));
            }));
    }

    private function singleSubmissionRelations(): array
    {
        return [
            'challenge' => fn ($query) => $query->withTrashed()->select(['id', 'title', 'points', 'category', 'type', 'card_color', 'survey_required']),
            'user' => fn ($query) => $query
                ->select(['id', 'name', 'email'])
                ->with([
                    'account_employee' => fn ($accountQuery) => $accountQuery
                        ->select(['id', 'user_id', 'employee_id', 'location_id', 'department_id', 'account_id'])
                        ->with(['location:id,name', 'department:id,name', 'account:id,name']),
                ]),
        ];
    }

    private function dailySubmissionRelations(): array
    {
        return [
            'participant.challenge' => fn ($query) => $query->withTrashed()->select(['id', 'title', 'points', 'category', 'type', 'card_color', 'start_date', 'survey_required']),
            'participant.user' => fn ($query) => $query
                ->select(['id', 'name', 'email'])
                ->with([
                    'account_employee' => fn ($accountQuery) => $accountQuery
                        ->select(['id', 'user_id', 'employee_id', 'location_id', 'department_id', 'account_id'])
                        ->with(['location:id,name', 'department:id,name', 'account:id,name']),
                ]),
        ];
    }

    private function teamSubmissionRelations(): array
    {
        return [
            'challenge' => fn ($query) => $query->withTrashed(),
            'leader.account_employee.department',
            'leader.account_employee.account',
            'leader.challengeParticipations',
            'members.participant',
        ];
    }

    private function formatSubmission(EngagementRewardChallengeParticipant $participant): array
    {
        $accountEmployee = $participant->user?->account_employee;
        $location = $accountEmployee?->location;

        return [
            'id' => (string) $participant->id,
            'status' => $participant->proof_approved_at !== null ? 'approved' : $participant->status,
            'participation_status' => $participant->status,
            'proof_approved_at' => $participant->proof_approved_at?->toDateTimeString(),
            'survey_points_awarded' => (int) $participant->survey_points_awarded,
            'survey_completed' => $participant->survey_rewarded_at !== null,
            'submission_url' => $participant->submission_path
                ? Storage::disk('s3')->url($participant->submission_path)
                : null,
            'submission_media' => $this->submissionMediaUrls(
                $participant->submission_media,
                $participant->submission_path,
            ),
            'challenge_description' => $participant->challenge_description,
            'submitted_at' => $participant->submitted_at?->toDateTimeString(),
            'reviewed_at' => $participant->reviewed_at?->toDateTimeString(),
            'review_note' => $participant->review_note,
            'points_awarded' => $participant->points_awarded,
            'challenge_points_awarded' => $participant->points_awarded !== null
                ? max(0, (int) $participant->points_awarded - (int) $participant->bonus_points)
                : 0,
            'bonus_points' => (int) $participant->bonus_points,
            'bonus_points_awarded' => $participant->points_awarded !== null
                ? (int) $participant->bonus_points
                : 0,
            'challenge' => $participant->challenge ? [
                'id' => $participant->challenge->id,
                'title' => $participant->challenge->title,
                'points' => $participant->challenge->points,
                'category' => $participant->challenge->category,
                'type' => $participant->challenge->type,
                'card_color' => $participant->challenge->card_color,
                'proof_type' => $participant->challenge->proof_type ?? 'photo_only',
                'survey_required' => (bool) $participant->challenge->survey_required,
            ] : null,
            'employee' => $participant->user ? [
                'id' => $participant->user->id,
                'name' => $participant->user->name,
                'email' => $participant->user->email,
                'eoid' => $accountEmployee?->employee_id,
                'location_id' => $location?->id,
                'location_name' => $location?->name,
                'department_name' => $accountEmployee?->department?->name,
                'account_name' => $accountEmployee?->account?->name,
            ] : null,
        ];
    }

    private function teamSubmissionParticipantIds()
    {
        return EngagementRewardChallengeTeamSubmissionMember::query()
            ->join(
                'engagement_reward_challenge_team_submissions as team_submissions',
                'team_submissions.id',
                '=',
                'engagement_reward_challenge_team_submission_members.team_submission_id',
            )
            ->where(function ($query) {
                $query->where(function ($statusQuery) {
                    $statusQuery
                        ->whereColumn('team_submissions.status', 'engagement_reward_challenge_participants.status')
                        ->whereIn('engagement_reward_challenge_participants.status', ['submitted', 'declined']);
                })->orWhere(function ($approvedQuery) {
                    $approvedQuery
                        ->where('team_submissions.status', 'approved')
                        ->whereNotNull('engagement_reward_challenge_participants.proof_approved_at');
                });
            })
            ->select('engagement_reward_challenge_team_submission_members.participant_id');
    }

    private function formatDailyLog(EngagementRewardChallengeDailyLog $log): array
    {
        $participant = $log->participant;
        $challenge = $participant?->challenge;
        $accountEmployee = $participant?->user?->account_employee;
        $location = $accountEmployee?->location;

        // Prefixing the description is a zero-risk way to surface "which day
        // is this" in the existing review modal without needing any
        // dedicated UI changes there.
        $dayNumber = $challenge
            ? $challenge->start_date->diffInDays($log->log_date) + 1
            : null;
        $dayLabel = $dayNumber ? "Day {$dayNumber} of {$participant->required_days} — " : '';

        return [
            'id' => "daily-{$log->id}",
            'individual_daily_log' => true,
            'log_date' => $log->log_date->toDateString(),
            'status' => $log->status,
            'submission_url' => Storage::disk('s3')->url($log->submission_path),
            'submission_media' => $this->submissionMediaUrls($log->submission_media, $log->submission_path),
            'challenge_description' => $dayLabel.$log->challenge_description,
            'submitted_at' => $log->submitted_at?->toDateTimeString(),
            'reviewed_at' => $log->reviewed_at?->toDateTimeString(),
            'review_note' => $log->review_note,
            'points_awarded' => null,
            'bonus_points' => (int) $log->bonus_points,
            'bonus_points_awarded' => $log->status === 'approved' ? (int) $log->bonus_points : 0,
            'survey_required' => (bool) $participant?->challenge?->survey_required,
            'survey_completed' => $participant?->survey_rewarded_at !== null,
            'challenge' => $challenge ? [
                'id' => $challenge->id,
                'title' => $challenge->title,
                'points' => $challenge->points,
                'category' => $challenge->category,
                'type' => $challenge->type,
                'card_color' => $challenge->card_color,
                'proof_type' => $challenge->proof_type ?? 'photo_only',
                'is_daily_challenge' => $challenge->isDailyChallenge(),
                'survey_required' => (bool) $challenge->survey_required,
            ] : null,
            'employee' => $participant?->user ? [
                'id' => $participant->user->id,
                'name' => $participant->user->name,
                'email' => $participant->user->email,
                'eoid' => $accountEmployee?->employee_id,
                'location_id' => $location?->id,
                'location_name' => $location?->name,
                'department_name' => $accountEmployee?->department?->name,
                'account_name' => $accountEmployee?->account?->name,
            ] : null,
        ];
    }

    private function submissionMediaUrls(?array $media, ?string $legacyPath): array
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
}
