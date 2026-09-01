<?php

namespace App\Http\Controllers\API\ER;

use App\Http\Controllers\Controller;
use App\Models\Account\AccountEmployee;
use App\Models\ER\ERExitClearance;
use Illuminate\Http\Request;

class ERExitClearanceController extends Controller
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
        // Helper function to extract array of keys where value is true
        $filterSelected = function ($items) {
            if (!is_array($items)) return [];
            return array_keys(array_filter($items));
        };

        
        $exitClearance = ERExitClearance::updateOrCreate(
            // Match existing clearance by attrition ID
            ['e_r_employee_attrition_id' => $request->input('e_r_employee_attrition_id')],
            [
                'clearance_date' => $request->input('date')
                    ? date('Y-m-d', strtotime($request->input('date')))
                    : null,

                // Sign-offs
                'supervisor_signature'   => $request->input('signOffs.supervisor.signature'),
                'supervisor_date_signed' => $request->input('signOffs.supervisor.dateSigned') ?: null,
                'supervisor_payables'    => $request->input('signOffs.supervisor.payables') ?: 0.00,

                'dept_head_signature'   => $request->input('signOffs.deptHead.signature'),
                'dept_head_date_signed' => $request->input('signOffs.deptHead.dateSigned') ?: null,
                'dept_head_payables'    => $request->input('signOffs.deptHead.payables') ?: 0.00,

                'it_signature'   => $request->input('signOffs.it.signature'),
                'it_date_signed' => $request->input('signOffs.it.dateSigned') ?: null,
                'it_payables'    => $request->input('signOffs.it.payables') ?: 0.00,

                'hr_signature'   => $request->input('signOffs.hrAdmin.signature'),
                'hr_date_signed' => $request->input('signOffs.hrAdmin.dateSigned') ?: null,
                'hr_payables'    => $request->input('signOffs.hrAdmin.payables') ?: 0.00,

                // Convert frontend checkbox objects (e.g. {idBadge: true, lanyard: false}) to JSON arrays (e.g. ["idBadge"])
                'company_assets_and_retrieval'  => $filterSelected($request->input('assets')),
                'keys'                          => $filterSelected($request->input('keys')),
                'computer_or_devices'           => $filterSelected($request->input('devices')),
                'communications_and_equipment' => $filterSelected($request->input('communications')),

                // Employee Confirmation
                'employee_signature' => $request->input('employeeSignature'),
            ]
        );

        return response()->json([
            'message' => 'Exit clearance saved successfully',
            'data'    => $exitClearance
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show()
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit()
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy()
    {
        //
    }
}
