<?php

namespace App\Http\Controllers;

use App\Models\PM\PMCorrectiveAction;
use Illuminate\Http\Request;

class PMCorrectiveActionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(Request $request)
    {
        // 1. Validate incoming form request
        $validated = $request->validate([
            // Personnel Details
            'name'                        => ['nullable', 'string', 'max:255'],
            'employee_id'                 => ['required', 'string', 'max:100'],
            'department_id'               => ['nullable', 'integer'],
            'first_name'                  => ['nullable', 'string', 'max:255'],
            'last_name'                   => ['nullable', 'string', 'max:255'],
            'eogs_email'                  => ['nullable', 'email', 'max:255'],
            'user_id'                     => ['nullable', 'integer'],

            // Immediate Supervisor Details
            'supervisor_id'               => ['nullable', 'string', 'max:100'],
            'supervisor_first_name'       => ['nullable', 'string', 'max:255'],
            'supervisor_last_name'        => ['nullable', 'string', 'max:255'],
            'supervisor_email'            => ['nullable', 'email', 'max:255'],
            'supervisor_user_id'          => ['nullable', 'integer'],

            // Next Level Manager Details
            'manager_id'                  => ['nullable', 'string', 'max:100'],
            'manager_first_name'          => ['nullable', 'string', 'max:255'],
            'manager_last_name'           => ['nullable', 'string', 'max:255'],
            'manager_email'               => ['nullable', 'email', 'max:255'],
            'manager_user_id'             => ['nullable', 'integer'],

            // Infraction Details
            'category'                    => ['required', 'string'],
            'code_of_discipline_section'  => ['required', 'string', 'max:255'],
            'date_of_occurrence'         => ['required', 'date'],
            'description_of_infraction'   => ['required', 'string'],

            // Supporting Documents / Evidence
            'evidence_drive_url'          => ['nullable', 'url', 'max:2048'],
        ]);

        try {
            $correctiveAction = PMCorrectiveAction::create($validated);
            return response()->json([
                'success' => true,
                'message' => 'Corrective Action created successfully.',
                'data'    => $correctiveAction,
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create corrective action.',
                'error'   => config('app.debug') ? $e->getMessage() : 'An unexpected error occurred.',
            ], 500);
        }
    }
    /**
     * Display the specified resource.
     */
    public function show(PMCorrectiveAction $pMCorrectiveAction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PMCorrectiveAction $pMCorrectiveAction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PMCorrectiveAction $pMCorrectiveAction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PMCorrectiveAction $pMCorrectiveAction)
    {
        //
    }
}
