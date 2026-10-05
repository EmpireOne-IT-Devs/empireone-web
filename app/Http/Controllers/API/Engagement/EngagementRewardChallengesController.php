<?php

namespace App\Http\Controllers\API\Engagement;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\Account\AccountEmployee;
use App\Models\Department;
use App\Models\Engagement\EngagementRewardChallenge;
use App\Models\Engagement\EngagementRewardChallengeParticipant;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
            ->with(['departments:id,name', 'accounts:id,name'])
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
    public function participants(EngagementRewardChallenge $engagementRewardChallenge): JsonResponse
    {
        $participants = $engagementRewardChallenge->participants()
            ->with('department:id,name')
            ->orderByDesc('engagement_reward_challenge_participants.joined_at')
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'participant_id' => $user->pivot->id,
                'name' => $user->name,
                'email' => $user->email,
                'department' => $user->department?->name,
                'status' => $user->pivot->status,
                'challenge_description' => $user->pivot->challenge_description,
                'points_awarded' => $user->pivot->points_awarded,
                'joined_at' => $user->pivot->joined_at?->toDateTimeString(),
                'submitted_at' => $user->pivot->submitted_at?->toDateTimeString(),
                'reviewed_at' => $user->pivot->reviewed_at?->toDateTimeString(),
                'submission_url' => $user->pivot->submission_path
                    ? Storage::disk('s3')->url($user->pivot->submission_path)
                    : null,
            ]);

        return response()->json([
            'status' => 'success',
            'data' => [
                'challenge' => $this->formatChallenge($engagementRewardChallenge),
                'participants' => $participants,
            ],
        ]);
    }

    /**
     * Shape a challenge for the frontend, including the display-only lifecycle status.
     */
    private function formatChallenge(EngagementRewardChallenge $challenge, ?int $currentUserId = null): array
    {
        $today = now()->startOfDay();

        $displayStatus = match (true) {
            $challenge->deadline->lt($today) => 'Completed',
            $challenge->start_date->gt($today) => 'Upcoming',
            default => 'Active',
        };

        $participant = $currentUserId
            ? $challenge->participants()->where('user_id', $currentUserId)->first()
            : null;

        return [
            'id' => $challenge->id,
            'title' => $challenge->title,
            'description' => $challenge->description,
            'type' => $challenge->type,
            'category' => $challenge->category,
            'points' => $challenge->points,
            'banner_url' => $challenge->banner_path ? Storage::disk('s3')->url($challenge->banner_path) : null,
            'banner_position_x' => $challenge->banner_position_x ?? 50,
            'banner_position_y' => $challenge->banner_position_y ?? 50,
            'all_employees' => $challenge->all_employees,
            'departments' => $challenge->departments,
            'accounts' => $challenge->accounts,
            'max_participants' => $challenge->max_participants,
            'participants_count' => $challenge->participants_count ?? $challenge->participants()->count(),
            'is_joined' => (bool) $participant,
            'participation_status' => $participant?->pivot->status,
            'submission_url' => $participant?->pivot->submission_path
                ? Storage::disk('s3')->url($participant->pivot->submission_path)
                : null,
            'submitted_at' => $participant?->pivot->submitted_at?->toDateTimeString(),
            'reviewed_at' => $participant?->pivot->reviewed_at?->toDateTimeString(),
            'review_note' => $participant?->pivot->review_note,
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
        $userId = auth()->id();
        $employee = AccountEmployee::where('user_id', $userId)->first();

        $challenges = EngagementRewardChallenge::query()
            ->with(['departments:id,name', 'accounts:id,name'])
            ->withCount('participants')
            ->latest()
            ->get()
            ->filter(fn (EngagementRewardChallenge $challenge) => $challenge->isEligibleForEmployee(
                $employee?->department_id,
                $employee?->account_id,
            ))
            ->map(fn (EngagementRewardChallenge $challenge) => $this->formatChallenge($challenge, $userId))
            ->values();

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

        $history = EngagementRewardChallengeParticipant::query()
            ->where('user_id', $userId)
            ->with(['challenge' => fn ($query) => $query->withTrashed()->select('id', 'title', 'points', 'category', 'type')])
            ->latest('joined_at')
            ->get()
            ->map(fn (EngagementRewardChallengeParticipant $participant) => [
                'id' => $participant->id,
                'challenge_title' => $participant->challenge?->title ?? 'Challenge removed',
                'category' => $participant->challenge?->category ?? 'N/A',
                'points' => $participant->points_awarded ?? $participant->challenge?->points ?? 0,
                'status' => $participant->status,
                'joined_at' => $participant->joined_at?->toDateString(),
                'submitted_at' => $participant->submitted_at?->toDateString(),
                'reviewed_at' => $participant->reviewed_at?->toDateString(),
            ]);

        // Points total is derived from this module's own participant records, not the HR employee table.
        $totalPoints = EngagementRewardChallengeParticipant::query()
            ->where('user_id', $userId)
            ->where('status', 'approved')
            ->sum('points_awarded');

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
    public function join(EngagementRewardChallenge $engagementRewardChallenge): JsonResponse
    {
        $userId = auth()->id();
        $employee = AccountEmployee::where('user_id', $userId)->first();

        $engagementRewardChallenge->load(['departments:id,name', 'accounts:id,name']);

        if (! $engagementRewardChallenge->isEligibleForEmployee($employee?->department_id, $employee?->account_id)) {
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

        if ($engagementRewardChallenge->participants()->where('user_id', $userId)->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'You already joined this challenge.',
            ], 422);
        }

        if (
            $engagementRewardChallenge->max_participants
            && $engagementRewardChallenge->participants()->count() >= $engagementRewardChallenge->max_participants
        ) {
            return response()->json([
                'status' => 'error',
                'message' => 'This challenge has reached its participant limit.',
            ], 422);
        }

        $engagementRewardChallenge->participants()->attach($userId, [
            'status' => 'joined',
            'joined_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'You joined the challenge successfully.',
            'data' => $this->formatChallenge($engagementRewardChallenge, $userId),
        ]);
    }

    /**
     * Leave a previously joined challenge.
     */
    public function leave(EngagementRewardChallenge $engagementRewardChallenge): JsonResponse
    {
        $userId = auth()->id();
        $participant = $engagementRewardChallenge->participants()->where('user_id', $userId)->first();

        if ($participant && in_array($participant->pivot->status, ['submitted', 'approved'], true)) {
            return response()->json([
                'status' => 'error',
                'message' => "You can't leave after submitting proof for review.",
            ], 422);
        }

        $engagementRewardChallenge->participants()->detach($userId);
        $engagementRewardChallenge->load(['departments:id,name', 'accounts:id,name']);

        return response()->json([
            'status' => 'success',
            'message' => 'You left the challenge.',
            'data' => $this->formatChallenge($engagementRewardChallenge, $userId),
        ]);
    }

    /**
     * Submit a proof photo for review on a joined challenge.
     */
    public function submitProof(Request $request, EngagementRewardChallenge $engagementRewardChallenge): JsonResponse
    {
        $userId = auth()->id();

        $request->validate([
            'photo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'challenge_description' => ['required', 'string', 'max:1000'],
        ]);

        $participant = $engagementRewardChallenge->participants()->where('user_id', $userId)->first();

        if (! $participant) {
            return response()->json([
                'status' => 'error',
                'message' => 'Join this challenge before submitting proof.',
            ], 422);
        }

        if (! in_array($participant->pivot->status, ['joined', 'declined'], true)) {
            return response()->json([
                'status' => 'error',
                'message' => 'A submission is already pending or approved for this challenge.',
            ], 422);
        }

        if ($participant->pivot->submission_path) {
            Storage::disk('s3')->delete($participant->pivot->submission_path);
        }

        $path = $request->file('photo')->store('unified/engagement/reward_challenges/submissions', 's3');

        $engagementRewardChallenge->participants()->updateExistingPivot($userId, [
            'status' => 'submitted',
            'submission_path' => $path,
            'challenge_description' => $request->string('challenge_description')->toString(),
            'submitted_at' => now(),
            'reviewed_at' => null,
            'reviewed_by' => null,
            'review_note' => null,
        ]);

        $engagementRewardChallenge->load(['departments:id,name', 'accounts:id,name']);

        return response()->json([
            'status' => 'success',
            'message' => 'Proof submitted for review.',
            'data' => $this->formatChallenge($engagementRewardChallenge, $userId),
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
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'type' => ['required', 'string', 'in:Individual,Team'],
            'category' => ['required', 'string', 'in:Wellness,Sales,Learning,Teamwork,Innovation'],
            'points' => ['required', 'integer', 'min:1'],
            'banner' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'banner_position_x' => ['nullable', 'integer', 'min:0', 'max:100'],
            'banner_position_y' => ['nullable', 'integer', 'min:0', 'max:100'],
            'all_employees' => ['required', 'boolean'],
            'account_ids' => ['nullable', 'array'],
            'account_ids.*' => ['integer', 'distinct', 'exists:accounts,id'],
            'department_ids' => ['nullable', 'array'],
            'department_ids.*' => ['integer', 'distinct', 'exists:departments,id'],
            'max_participants' => ['nullable', 'integer', 'min:1'],
            'start_date' => ['required', 'date'],
            'deadline' => ['required', 'date', 'after_or_equal:start_date'],
            'card_color' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ]);

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

        $challenge = EngagementRewardChallenge::create([
            'created_by' => auth()->id(),
            'title' => $validated['title'],
            'description' => $validated['description'],
            'type' => $validated['type'],
            'category' => $validated['category'],
            'points' => $validated['points'],
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
    public function update(Request $request, EngagementRewardChallenge $engagementRewardChallenge): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string', 'max:5000'],
            'type' => ['sometimes', 'string', 'in:Individual,Team'],
            'category' => ['sometimes', 'string', 'in:Wellness,Sales,Learning,Teamwork,Innovation'],
            'points' => ['sometimes', 'integer', 'min:1'],
            'banner' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'banner_position_x' => ['nullable', 'integer', 'min:0', 'max:100'],
            'banner_position_y' => ['nullable', 'integer', 'min:0', 'max:100'],
            'all_employees' => ['sometimes', 'boolean'],
            'account_ids' => ['nullable', 'array'],
            'account_ids.*' => ['integer', 'distinct', 'exists:accounts,id'],
            'department_ids' => ['nullable', 'array'],
            'department_ids.*' => ['integer', 'distinct', 'exists:departments,id'],
            'max_participants' => ['nullable', 'integer', 'min:1'],
            'start_date' => ['sometimes', 'date'],
            'deadline' => ['sometimes', 'date', 'after_or_equal:start_date'],
            'card_color' => ['sometimes', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ]);

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

        $quarters = $challenges
            ->groupBy(fn (EngagementRewardChallenge $challenge) => $challenge->start_date->year.'-Q'.(int) ceil($challenge->start_date->month / 3))
            ->map(function ($group, $key) {
                [$year, $quarterLabel] = explode('-', $key);
                $quarterNumber = (int) str_replace('Q', '', $quarterLabel);
                $isCurrentQuarter = (int) $year === now()->year && $quarterNumber === (int) ceil(now()->month / 3);

                $participants = $group->flatMap(fn (EngagementRewardChallenge $challenge) => $challenge->participants);
                $totalParticipants = $participants->count();
                $approvedParticipants = $participants->filter(fn (User $user) => $user->pivot->status === 'approved')->count();
                $totalPoints = (int) $participants->sum(fn (User $user) => $user->pivot->points_awarded ?? 0);

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
        $participants = EngagementRewardChallengeParticipant::query()
            ->with(['user:id,name,email', 'challenge:id,title'])
            ->orderByDesc('points_awarded')
            ->limit($limit)
            ->get();

        return $this->streamCsv("top{$limit}_leaderboard.csv", ['Rank', 'Name', 'Email', 'Challenge', 'Points Awarded', 'Status'], function ($handle) use ($participants) {
            foreach ($participants as $index => $participant) {
                fputcsv($handle, [
                    $index + 1,
                    $participant->user?->name ?? 'N/A',
                    $participant->user?->email ?? 'N/A',
                    $participant->challenge?->title ?? 'N/A',
                    $participant->points_awarded ?? 0,
                    ucfirst($participant->status),
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

        return $this->streamCsv('full_participation_report.csv', ['Name', 'Email', 'Department', 'Challenge', 'Category', 'Status', 'Points Awarded', 'Joined At', 'Submitted At'], function ($handle) use ($participants) {
            foreach ($participants as $participant) {
                fputcsv($handle, [
                    $participant->user?->name ?? 'N/A',
                    $participant->user?->email ?? 'N/A',
                    $participant->user?->department?->name ?? 'N/A',
                    $participant->challenge?->title ?? 'N/A',
                    $participant->challenge?->category ?? 'N/A',
                    ucfirst($participant->status),
                    $participant->points_awarded ?? 0,
                    optional($participant->joined_at)->toDateTimeString() ?? '',
                    optional($participant->submitted_at)->toDateTimeString() ?? '',
                ]);
            }
        });
    }

    private function exportPointsDistributionCsv()
    {
        $rows = EngagementRewardChallengeParticipant::query()
            ->selectRaw('user_id, SUM(points_awarded) as total_points, COUNT(CASE WHEN status = "approved" THEN 1 END) as challenges_completed')
            ->groupBy('user_id')
            ->orderByDesc('total_points')
            ->with('user:id,name,email')
            ->get();

        return $this->streamCsv('points_distribution_report.csv', ['Name', 'Email', 'Total Points', 'Challenges Completed'], function ($handle) use ($rows) {
            foreach ($rows as $row) {
                fputcsv($handle, [
                    $row->user?->name ?? 'N/A',
                    $row->user?->email ?? 'N/A',
                    (int) $row->total_points,
                    (int) $row->challenges_completed,
                ]);
            }
        });
    }

    private function exportDepartmentAnalyticsCsv()
    {
        $participants = EngagementRewardChallengeParticipant::query()
            ->with('user:id,department_id')
            ->get()
            ->groupBy(fn (EngagementRewardChallengeParticipant $participant) => $participant->user?->department_id ?? 0);

        $departments = Department::whereIn('id', $participants->keys()->filter())->pluck('name', 'id');

        return $this->streamCsv('department_analytics_report.csv', ['Department', 'Total Participants', 'Completed', 'Completion Rate', 'Total Points'], function ($handle) use ($participants, $departments) {
            foreach ($participants as $departmentId => $group) {
                $total = $group->count();
                $completed = $group->where('status', 'approved')->count();
                $points = (int) $group->sum('points_awarded');

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
     * Build the full (unfiltered) list of RnR employee profiles: every employee
     * who has joined at least one challenge, with aggregated points and activity.
     *
     * @return \Illuminate\Support\Collection<int, array>
     */
    private function buildEmployeeProfiles(): \Illuminate\Support\Collection
    {
        $participantUserIds = EngagementRewardChallengeParticipant::query()
            ->distinct()
            ->pluck('user_id');

        $users = User::query()
            ->whereIn('id', $participantUserIds)
            ->whereIn('role', [User::ROLE_ADMIN, User::ROLE_EMPLOYEE])
            ->with(['account_employee.department:id,name'])
            ->get(['id', 'name']);

        $participantsByUser = EngagementRewardChallengeParticipant::query()
            ->whereIn('user_id', $participantUserIds)
            ->get(['user_id', 'status', 'points_awarded', 'joined_at', 'submitted_at', 'reviewed_at'])
            ->groupBy('user_id');

        return $users->map(function (User $user) use ($participantsByUser) {
            $participants = $participantsByUser->get($user->id, collect());
            $employee = $user->account_employee;

            $points = (int) $participants->where('status', 'approved')->sum('points_awarded');

            $lastActive = $participants
                ->flatMap(fn (EngagementRewardChallengeParticipant $p) => array_filter([
                    $p->joined_at, $p->submitted_at, $p->reviewed_at,
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
