<?php

namespace App\Http\Controllers\API\ER;

use App\Http\Controllers\Controller;
use App\Models\Account\AccountEmployee;
use App\Models\ER\EREmployeeAttrition;
use Illuminate\Http\Request;

class EREmployeeAttritionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $attritions = EREmployeeAttrition::with(['employee'])->paginate(12);
        return response()->json($attritions, 200);
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
        $attrition = EREmployeeAttrition::updateOrCreate(
            ['employee_id' => $request->employee_id],
            [
                'position' => $request->position,
                'department' => $request->department['name'],
                'account' => $request->account['name'] ?? '',
                'eogs_email' => $request->eogs_email,
                'started_at' => $request->started_at,
                'separation_date' => $request->separation_date,
                'employment_status' => $request->employment_status,
                'status' => $request->status,
                'reason_for_separation' => $request->reason_for_separation,
                'is_rehire' => $request->is_rehire,
                'attrition_status' => 'Pending',
            ]
        );

        $account_employee = AccountEmployee::where('employee_id', $request->employee_id)->first();
        if ($account_employee) {
            $account_employee->update([
                'employment_status' => $request->employment_status,
                'reason_for_separation' => $request->reason_for_separation,
                'is_rehire' => $request->is_rehire
            ]);
        }


        return response()->json([
            'status' => 'success',
            'data' => $attrition
        ]);
    }
    /**
     * Display the specified resource.
     */
    public function show(EREmployeeAttrition $eREmployeeAttrition)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(EREmployeeAttrition $eREmployeeAttrition)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, EREmployeeAttrition $eREmployeeAttrition)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EREmployeeAttrition $eREmployeeAttrition)
    {
        //
    }
}
