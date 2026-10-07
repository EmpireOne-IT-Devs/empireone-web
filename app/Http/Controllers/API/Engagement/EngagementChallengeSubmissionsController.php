<?php

namespace App\Http\Controllers\API\Engagement;

use App\Http\Controllers\Controller;
use App\Models\Engagement\EngagementRewardChallengeDailyLog;
use App\Models\Engagement\EngagementRewardChallengeParticipant;
use Illuminate\Support\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EngagementChallengeSubmissionsController extends Controller
{
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
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $this->buildSubmissionsCollection($validated),
        ]);
    }

    public function export(Request $request)
    {
        $validated = $request->validate([
            'status' => ['nullable', 'string', 'in:submitted,approved,declined'],
            'challenge_id' => ['nullable', 'integer', 'exists:engagement_reward_challenges,id'],
            'location_id' => ['nullable', 'integer', 'exists:locations,id'],
            'search' => ['nullable', 'string', 'max:255'],
        ]);

        $submissions = $this->buildSubmissionsCollection($validated);

        return response()->streamDownload(function () use ($submissions) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['EOID', 'Fullname', 'Challenge Title', 'Department', 'Account', 'Points', 'Email'], "\t");

            foreach ($submissions as $submission) {
                fputcsv($handle, [
                    $submission['employee']['eoid'] ?? '',
                    $submission['employee']['name'] ?? '',
                    $submission['challenge']['title'] ?? '',
                    $submission['employee']['department_name'] ?? '',
                    $submission['employee']['account_name'] ?? '',
                    $submission['challenge']['points'] ?? '',
                    $submission['employee']['email'] ?? '',
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
            ->whereNotNull('submitted_at')
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $dailyLogCounts = EngagementRewardChallengeDailyLog::query()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return response()->json([
            'status' => 'success',
            'data' => [
                'pending' => $participantCounts->get('submitted', 0) + $dailyLogCounts->get('submitted', 0),
                'approved' => $participantCounts->get('approved', 0) + $dailyLogCounts->get('approved', 0),
                'rejected' => $participantCounts->get('declined', 0) + $dailyLogCounts->get('declined', 0),
            ],
        ]);
    }

    /**
     * Approve a submission (single-proof participant or one daily log) and
     * award points once the challenge requirement is actually met.
     */
    public function approve(string $id): JsonResponse
    {
        if (str_starts_with($id, 'daily-')) {
            return $this->approveDailyLog((int) substr($id, 6));
        }

        $participant = EngagementRewardChallengeParticipant::findOrFail((int) $id);

        if ($participant->status !== 'submitted') {
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
            'status' => 'approved',
            'reviewed_at' => now(),
            'reviewed_by' => auth()->id(),
            'review_note' => null,
            'points_awarded' => $participant->challenge->points,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Submission approved and points awarded.',
            'data' => $this->formatSubmission($participant->fresh(['user'])->load(['challenge' => fn ($query) => $query->withTrashed()])),
        ]);
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

        $participant = EngagementRewardChallengeParticipant::findOrFail((int) $id);

        if ($participant->status !== 'submitted') {
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

        return response()->json([
            'status' => 'success',
            'message' => 'Submission declined.',
            'data' => $this->formatSubmission($participant->fresh(['user'])->load(['challenge' => fn ($query) => $query->withTrashed()])),
        ]);
    }

    /**
     * Approve one day's log. Missed/declined days never count, so completion
     * is simply "enough approved days", checked with a single integer
     * comparison rather than recomputing anything from the logs table.
     */
    private function approveDailyLog(int $logId): JsonResponse
    {
        $log = EngagementRewardChallengeDailyLog::with([
            'participant.challenge' => fn ($query) => $query->withTrashed(),
            'participant.user:id,name,email',
        ])->findOrFail($logId);

        if ($log->status !== 'submitted') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only pending submissions can be approved.',
            ], 422);
        }

        $participant = $log->participant;
        $challenge = $participant?->challenge;

        if (! $participant || ! $challenge) {
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
        ]);

        $participant->increment('completed_days');
        $participant->refresh();

        if ($participant->isDailyChallengeComplete() && $participant->status !== 'approved') {
            $participant->update([
                'status' => 'approved',
                'reviewed_at' => now(),
                'reviewed_by' => auth()->id(),
                'points_awarded' => $challenge->points,
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => $participant->status === 'approved'
                ? "Day approved — challenge complete, points awarded!"
                : 'Day approved.',
            'data' => $this->formatDailyLog($log->fresh(['participant.challenge', 'participant.user'])),
        ]);
    }

    /**
     * Decline one day's log. The day is simply forfeited — it does not count
     * toward completed_days, and the employee may still submit future days.
     */
    private function declineDailyLog(int $logId, ?string $reviewNote): JsonResponse
    {
        $log = EngagementRewardChallengeDailyLog::with([
            'participant.challenge' => fn ($query) => $query->withTrashed(),
            'participant.user:id,name,email',
        ])->findOrFail($logId);

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

        return response()->json([
            'status' => 'success',
            'message' => 'Day declined.',
            'data' => $this->formatDailyLog($log->fresh(['participant.challenge', 'participant.user'])),
        ]);
    }

    private function buildSubmissionsCollection(array $filters): Collection
    {
        $status = $filters['status'] ?? null;
        $challengeId = $filters['challenge_id'] ?? null;
        $locationId = $filters['location_id'] ?? null;
        $search = trim((string) ($filters['search'] ?? ''));

        $singleSubmissions = EngagementRewardChallengeParticipant::query()
            ->with([
                'challenge' => fn ($query) => $query->withTrashed()->select(['id', 'title', 'points', 'category', 'type', 'card_color']),
                'user' => fn ($query) => $query
                    ->select(['id', 'name', 'email'])
                    ->with([
                        'account_employee' => fn ($accountQuery) => $accountQuery
                            ->select(['id', 'user_id', 'employee_id', 'location_id', 'department_id', 'account_id'])
                            ->with(['location:id,name', 'department:id,name', 'account:id,name']),
                    ]),
            ])
            ->whereNotNull('submitted_at')
            ->when($status, fn ($query, $value) => $query->where('status', $value))
            ->when($challengeId, fn ($query, $value) => $query->where('reward_challenge_id', $value))
            ->when($locationId, fn ($query, $value) => $query->whereHas('user.account_employee', fn ($locationQuery) => $locationQuery->where('location_id', $value)))
            ->when($search !== '', fn ($query) => $query->whereHas('user', function ($userQuery) use ($search) {
                $userQuery->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            }))
            ->get()
            ->map(fn (EngagementRewardChallengeParticipant $participant) => $this->formatSubmission($participant));

        $dailySubmissions = EngagementRewardChallengeDailyLog::query()
            ->with([
                'participant.challenge' => fn ($query) => $query->withTrashed()->select(['id', 'title', 'points', 'category', 'type', 'card_color', 'start_date']),
                'participant.user' => fn ($query) => $query
                    ->select(['id', 'name', 'email'])
                    ->with([
                        'account_employee' => fn ($accountQuery) => $accountQuery
                            ->select(['id', 'user_id', 'employee_id', 'location_id', 'department_id', 'account_id'])
                            ->with(['location:id,name', 'department:id,name', 'account:id,name']),
                    ]),
            ])
            ->when($status, fn ($query, $value) => $query->where('status', $value))
            ->when($challengeId, fn ($query, $value) => $query->whereHas('participant', fn ($participantQuery) => $participantQuery->where('reward_challenge_id', $value)))
            ->when($locationId, fn ($query, $value) => $query->whereHas('participant.user.account_employee', fn ($locationQuery) => $locationQuery->where('location_id', $value)))
            ->when($search !== '', fn ($query) => $query->whereHas('participant.user', function ($userQuery) use ($search) {
                $userQuery->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            }))
            ->get()
            ->map(fn (EngagementRewardChallengeDailyLog $log) => $this->formatDailyLog($log));

        return $singleSubmissions->concat($dailySubmissions)
            ->sortByDesc('submitted_at')
            ->values();
    }

    private function formatSubmission(EngagementRewardChallengeParticipant $participant): array
    {
        $accountEmployee = $participant->user?->account_employee;
        $location = $accountEmployee?->location;

        return [
            'id' => (string) $participant->id,
            'status' => $participant->status,
            'submission_url' => $participant->submission_path
                ? Storage::disk('s3')->url($participant->submission_path)
                : null,
            'challenge_description' => $participant->challenge_description,
            'submitted_at' => $participant->submitted_at?->toDateTimeString(),
            'reviewed_at' => $participant->reviewed_at?->toDateTimeString(),
            'review_note' => $participant->review_note,
            'points_awarded' => $participant->points_awarded,
            'challenge' => $participant->challenge ? [
                'id' => $participant->challenge->id,
                'title' => $participant->challenge->title,
                'points' => $participant->challenge->points,
                'category' => $participant->challenge->category,
                'type' => $participant->challenge->type,
                'card_color' => $participant->challenge->card_color,
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

    private function formatDailyLog(EngagementRewardChallengeDailyLog $log): array
    {
        $participant = $log->participant;
        $challenge = $participant?->challenge;
        $accountEmployee = $participant?->user?->account_employee;
        $location = $accountEmployee?->location;

        // Prefixing the description is a zero-risk way to surface "which day
        // is this" in the existing review modal without needing any
        // dedicated UI changes there.
        $dayNumber = $challenge ? $challenge->start_date->diffInDays($log->log_date) + 1 : null;
        $dayLabel = $dayNumber
            ? "Day {$dayNumber} of {$participant->required_days} — "
            : '';

        return [
            'id' => "daily-{$log->id}",
            'status' => $log->status,
            'submission_url' => Storage::disk('s3')->url($log->submission_path),
            'challenge_description' => $dayLabel.$log->challenge_description,
            'submitted_at' => $log->submitted_at?->toDateTimeString(),
            'reviewed_at' => $log->reviewed_at?->toDateTimeString(),
            'review_note' => $log->review_note,
            'points_awarded' => null,
            'challenge' => $challenge ? [
                'id' => $challenge->id,
                'title' => $challenge->title,
                'points' => $challenge->points,
                'category' => $challenge->category,
                'type' => $challenge->type,
                'card_color' => $challenge->card_color,
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
}
