<?php

namespace App\Http\Controllers\API\Engagement;

use App\Http\Controllers\Controller;
use App\Models\Engagement\EngagementRewardChallengeParticipant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EngagementChallengeSubmissionsController extends Controller
{
    /**
     * List challenge proof submissions (excludes participants who haven't submitted yet).
     */
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['nullable', 'string', 'in:submitted,approved,declined'],
        ]);

        $submissions = EngagementRewardChallengeParticipant::query()
            ->with(['challenge:id,title,points,category,type,card_color', 'user:id,name,email'])
            ->whereNotNull('submitted_at')
            ->when($validated['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->latest('submitted_at')
            ->get()
            ->map(fn (EngagementRewardChallengeParticipant $participant) => $this->formatSubmission($participant));

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
        $counts = EngagementRewardChallengeParticipant::query()
            ->whereNotNull('submitted_at')
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return response()->json([
            'status' => 'success',
            'data' => [
                'pending' => $counts->get('submitted', 0),
                'approved' => $counts->get('approved', 0),
                'rejected' => $counts->get('declined', 0),
            ],
        ]);
    }

    /**
     * Approve a submission and award the challenge points to the employee.
     */
    public function approve(EngagementRewardChallengeParticipant $participant): JsonResponse
    {
        if ($participant->status !== 'submitted') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only pending submissions can be approved.',
            ], 422);
        }

        $participant->loadMissing('challenge');

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
            'data' => $this->formatSubmission($participant->fresh(['challenge', 'user'])),
        ]);
    }

    /**
     * Decline a submission with an optional reason.
     */
    public function decline(Request $request, EngagementRewardChallengeParticipant $participant): JsonResponse
    {
        if ($participant->status !== 'submitted') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only pending submissions can be declined.',
            ], 422);
        }

        $validated = $request->validate([
            'review_note' => ['nullable', 'string', 'max:1000'],
        ]);

        $participant->update([
            'status' => 'declined',
            'reviewed_at' => now(),
            'reviewed_by' => auth()->id(),
            'review_note' => $validated['review_note'] ?? null,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Submission declined.',
            'data' => $this->formatSubmission($participant->fresh(['challenge', 'user'])),
        ]);
    }

    private function formatSubmission(EngagementRewardChallengeParticipant $participant): array
    {
        return [
            'id' => $participant->id,
            'status' => $participant->status,
            'submission_url' => $participant->submission_path
                ? Storage::disk('s3')->url($participant->submission_path)
                : null,
            'submitted_at' => $participant->submitted_at?->toDateTimeString(),
            'reviewed_at' => $participant->reviewed_at?->toDateTimeString(),
            'review_note' => $participant->review_note,
            'points_awarded' => $participant->points_awarded,
            'challenge' => [
                'id' => $participant->challenge->id,
                'title' => $participant->challenge->title,
                'points' => $participant->challenge->points,
                'category' => $participant->challenge->category,
                'type' => $participant->challenge->type,
                'card_color' => $participant->challenge->card_color,
            ],
            'employee' => [
                'id' => $participant->user->id,
                'name' => $participant->user->name,
                'email' => $participant->user->email,
            ],
        ];
    }
}
