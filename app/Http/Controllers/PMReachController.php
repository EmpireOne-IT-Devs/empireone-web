<?php

namespace App\Http\Controllers;

use App\Mail\PMReachSummary;
use App\Models\PM\PMReach;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;

class PMReachController extends Controller
{

    /**
     * Store a newly created resource in storage.
     */

    public function acknowledge(Request $request, PMReach $pmReach)
    {
        // Check signature validity directly in code
        if (! $request->hasValidSignature()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid or expired signature link.',
            ], 403);
        }

        // Update status to ACKNOWLEDGED
        if ($pmReach->status !== 'ACKNOWLEDGED') {
            $pmReach->update([
                'status' => 'ACKNOWLEDGED',
            ]);
        }

        // Determine base URL with fallback to explicit domain
        $baseUrl = rtrim(config('app.frontend_url', config('app.url', 'https://careers.empireonecx.com')), '/');

        // Ensure localhost is overridden in production
        if (app()->environment('production') && str_contains($baseUrl, 'localhost')) {
            $baseUrl = 'https://careers.empireonecx.com';
        }

        $frontendUrl = $baseUrl . '/human-resources/reach?acknowledged=true&id=' . $pmReach->id;

        return redirect()->away($frontendUrl);
    }
    protected function validateReach(Request $request): array
    {
        return $request->validate([
            // Employee Information
            'employee_id' => ['nullable', 'integer'],
            'user_id' => ['required', 'integer'],
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'employee_email' => ['nullable', 'email', 'max:255'],

            // Supervisor Information
            'supervisor_user_id' => ['nullable'],
            'supervisor_id' => ['nullable', 'integer'],
            'supervisor_first_name' => ['nullable', 'string', 'max:255'],
            'supervisor_last_name' => ['nullable', 'string', 'max:255'],
            'supervisor_email' => ['nullable', 'email', 'max:255'],

            // Session General Details
            'account_id' => ['required', 'integer', 'exists:accounts,id'],
            'date_of_session' => ['nullable', 'date'],

            // Recognition & Opportunity
            'recognition_statement_1' => ['nullable', 'string'],
            'recognition_statement_2' => ['nullable', 'string'],
            'recognition_statement_3' => ['nullable', 'string'],
            'area_of_opportunity' => ['nullable', 'string'],

            // Performance Evaluation
            'kpi' => ['nullable', 'string', 'max:255'],
            'actual_metric' => ['nullable', 'string', 'max:255'],
            'goal_target' => ['nullable', 'string', 'max:255'],
            'biggest_rock' => ['nullable', 'string'],
            'behavioral_root_cause' => ['nullable', 'string'],

            // Action Plan
            'smart_goal' => ['nullable', 'string'],
            'task_name' => ['nullable', 'string', 'max:255'],
            'task_description' => ['nullable', 'string'],
            'due_date' => ['nullable', 'date'],
            'frequency' => ['nullable', 'string', 'max:255'],

            // Commitment
            'employee_commitment' => ['nullable', 'string'],
            'leader_commitment' => ['nullable', 'string'],

            // Handoff & Follow-up
            'next_follow_up_date' => ['nullable', 'date'],
            'follow_up_notes' => ['nullable', 'string'],

            // Status tracking
            'status' => ['nullable', Rule::in(['PENDING', 'ACKNOWLEDGED'])],
        ]);
    }

    public function get_reach_specific_leader(Request $request)
    {
        // Initialize the query builder using ::query() instead of ::get()
        $query = PMReach::query();

        // If 'all' is not true, filter by the logged-in user
        if (!$request->boolean('all')) {
            $query->where('created_by', Auth::id());
        }

        // Filter by search term across first_name and last_name
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%");
            });
        }

        // Eager load relationships before running paginate()
        $reaches = $query->paginate($request->input('per_page', 10));

        return response()->json($reaches, 200);
    }
    public function store(Request $request)
    {
        $validated = $this->validateReach($request);

        $validated['created_by'] = Auth::id();

        $reach = PMReach::create($validated);

        // Eager load relations before sending the email to ensure all fields are accessible in the Blade view
        $reach->load(['account', 'employee', 'supervisor', 'creator']);


        // if ($reach->employee_email) {
        //     Mail::to($reach->employee_email)
        //         ->when($reach->supervisor_email, fn($mail) => $mail->cc($reach->supervisor_email))
        //         ->send(new PMReachSummary($reach, $reach->supervisor_email));
        // }

        if ($reach->employee_email) {
            Mail::to($reach->employee_email)
                ->send(new PMReachSummary($reach));
            if ($reach->supervisor_email) {
                Mail::to($reach->supervisor_email)
                    ->send(new PMReachSummary($reach, $reach->supervisor_email));
            }
        }
        return response()->json([
            'status' => 'success',
            'message' => 'PM Reach session created successfully and email notification sent.',
            'data' => $reach,
        ], 200); // Standard HTTP status code for resource creation
    }
    /**
     * Display the specified resource.
     */
    public function show(PMReach $pMReach)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PMReach $pMReach)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PMReach $pMReach)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PMReach $pMReach)
    {
        //
    }
}
