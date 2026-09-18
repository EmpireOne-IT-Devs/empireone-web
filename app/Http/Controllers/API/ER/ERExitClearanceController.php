<?php

namespace App\Http\Controllers\API\ER;

use App\Http\Controllers\Controller;
use App\Models\Account\AccountEmployee;
use App\Models\ER\EREmployeeAttrition;
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
        // dd($request->clearance_departments);
        // dd($request->assigned_id);
        // Helper function to extract array of keys where value is true
        $filterSelected = function ($items) {
            if (!is_array($items)) return [];
            return array_keys(array_filter($items));
        };

        // Fetch existing clearance record
        $clearance = ERExitClearance::where('e_r_employee_attrition_id', $request->e_r_employee_attrition_id)->first();

        // Preserve existing signature if already signed; otherwise, check acknowledgement condition
        $employeeSignature = $clearance?->employee_signature;

        if (empty($employeeSignature) && $request->is_acknowledge) {
            $employeeSignature = $request->input('employeeSignature');
        }

        // 1. Base update data containing common fields
        $updateData = [
            'clearance_date' => $request->input('date')
                ? date('Y-m-d', strtotime($request->input('date')))
                : null,
            'employee_signature' => $employeeSignature,
        ];

        // 2. Conditionally update IT Assets only if user has permission
        if ($request->input('canEditHR')) {
            $updateData['company_assets_and_retrieval'] = $filterSelected($request->input('assets'));
        }

        // 3. Conditionally update Compliance / Keys
        if ($request->input('canEditCompliance')) {
            $updateData['keys'] = $filterSelected($request->input('keys'));
        }

        // 4. Conditionally update Devices & Equipment
        if ($request->input('canEditIT')) {
            $updateData['computer_or_devices'] = $filterSelected($request->input('devices'));
            $updateData['communications_and_equipment'] = $filterSelected($request->input('communications'));
        }

        // 5. Save the conditionally constructed array
        $exitClearance = ERExitClearance::updateOrCreate(
            ['e_r_employee_attrition_id' => $request->input('e_r_employee_attrition_id')],
            $updateData
        );

        $att = EREmployeeAttrition::find($request->e_r_employee_attrition_id);

        if ($att) {
            // 1. Get existing database records
            $dbDepartments = is_string($att->clearance_departments)
                ? json_decode($att->clearance_departments, true)
                : $att->clearance_departments;

            // 2. Find the updated item from the request payload using assigned_id
            $incomingPayload = collect($request->clearance_departments)
                ->firstWhere('assigned_leader_user_id', $request->assigned_id);

            // 3. Map through DB records and update payables if matched
            if ($incomingPayload) {
                $updatedDepartments = collect($dbDepartments)->map(function ($department) use ($request, $incomingPayload) {
                    if (
                        isset($department['assigned_leader_user_id']) &&
                        $department['assigned_leader_user_id'] == $request->assigned_id
                    ) {
                        $department = $incomingPayload ?? $department;
                    }
                    return $department;
                })->toArray();
                $att->clearance_departments = $updatedDepartments;
                $att->save();
            }
        }

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
