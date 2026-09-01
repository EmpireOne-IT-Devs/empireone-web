<?php

namespace App\Http\Controllers\API\Engagement;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\Department;
use App\Models\Engagement\EngagementRewardChallenge;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
     * Shape a challenge for the frontend, including the display-only lifecycle status.
     */
    private function formatChallenge(EngagementRewardChallenge $challenge): array
    {
        $today = now()->startOfDay();

        $displayStatus = match (true) {
            $challenge->deadline->lt($today) => 'Completed',
            $challenge->start_date->gt($today) => 'Upcoming',
            default => 'Active',
        };

        return [
            'id' => $challenge->id,
            'title' => $challenge->title,
            'description' => $challenge->description,
            'type' => $challenge->type,
            'category' => $challenge->category,
            'points' => $challenge->points,
            'banner_url' => $challenge->banner_path ? Storage::disk('s3')->url($challenge->banner_path) : null,
            'all_employees' => $challenge->all_employees,
            'departments' => $challenge->departments,
            'accounts' => $challenge->accounts,
            'max_participants' => $challenge->max_participants,
            'participants_count' => 0,
            'start_date' => $challenge->start_date->toDateString(),
            'deadline' => $challenge->deadline->toDateString(),
            'card_color' => $challenge->card_color,
            'status' => $displayStatus,
        ];
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
}
