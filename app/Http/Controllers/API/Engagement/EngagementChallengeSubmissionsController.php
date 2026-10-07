<?php

namespace App\Http\Controllers\API\Engagement;

use App\Http\Controllers\Controller;
use App\Models\Engagement\EngagementRewardChallengeDailyLog;
use App\Models\Engagement\EngagementRewardChallengeParticipant;
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
        ]);
        $status = $validated['status'] ?? null;

        $singleSubmissions = EngagementRewardChallengeParticipant::query()
            ->with([
                'challenge' => fn ($query) => $query->withTrashed()->select(['id', 'title', 'points', 'category', 'type', 'card_color']),
                'user:id,name,email',
            ])
            ->whereNotNull('submitted_at')
            ->when($status, fn ($query, $status) => $query->where('status', $status))
            ->get()
            ->map(fn (EngagementRewardChallengeParticipant $participant) => $this->formatSubmission($participant));

        $dailySubmissions = EngagementRewardChallengeDailyLog::query()
            ->with([
                'participant.challenge' => fn ($query) => $query->withTrashed()->select(['id', 'title', 'points', 'category', 'type', 'card_color', 'start_date']),
                'participant.user:id,name,email',
            ])
            ->when($status, fn ($query, $status) => $query->where('status', $status))
            ->get()
            ->map(fn (EngagementRewardChallengeDailyLog $log) => $this->formatDailyLog($log));

        $submissions = $singleSubmissions->concat($dailySubmissions)
            ->sortByDesc('submitted_at')
            ->values();

        return response()->json([
            'status' => 'success',
            'data' => $submissions,
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

    private function formatSubmission(EngagementRewardChallengeParticipant $participant): array
    {
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
            ] : null,
        ];
    }

    private function formatDailyLog(EngagementRewardChallengeDailyLog $log): array
    {
        $participant = $log->participant;
        $challenge = $participant?->challenge;

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
            ] : null,
        ];
    }
}
