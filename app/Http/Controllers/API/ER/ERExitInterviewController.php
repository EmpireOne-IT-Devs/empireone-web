<?php

namespace App\Http\Controllers\API\ER;

use App\Models\ER\ERLeader;
use App\Http\Controllers\Controller;
use App\Models\ER\ERExitInterview;
use Illuminate\Http\Request;

class ERExitInterviewController extends Controller
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
        // Helper function to convert checkbox object { pay: true, supervisor: false } to simple array ["pay"]
        $filterSelected = function ($items) {
            if (!is_array($items)) return [];
            return array_keys(array_filter($items));
        };

        $exitInterview = ERExitInterview::updateOrCreate(
            ['e_r_employee_attrition_id' => $request->input('e_r_employee_attrition_id')],
            [
                'main_reason_for_leaving'    => $request->input('mainReasonForLeaving'),
                'factors_leaving'            => $filterSelected($request->input('factorsLeaving')),
                'wish_had_known'             => $request->input('wishHadKnown'),
                'suggestions_for_management' => $request->input('suggestionsForManagement'),
                'appropriate_support'        => $request->input('appropriateSupport'),
                'ratings'                    => $request->input('ratings'), // Automatically saved as JSON array
                'employee_signature'         => $request->input('employeeSignature'),
                'conducted_by'               => $request->input('conductedBy'),
            ]
        );

        return response()->json([
            'message' => 'Exit interview saved successfully',
            'data'    => $exitInterview,
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(ERExitInterview $eRExitInterview)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ERExitInterview $eRExitInterview)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ERExitInterview $eRExitInterview)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ERExitInterview $eRExitInterview)
    {
        //
    }
}
