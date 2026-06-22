<?php

namespace App\Http\Controllers\API\ER;

use App\Http\Controllers\Controller;
use App\Mail\ChangeFormEmail;
use App\Models\Account\AccountEmployee;
use App\Models\ER\EREmployeeChangeForm;
use App\Models\ER\ERLeader;
use App\Models\ER\ERSubordinate;
use App\Models\Jobs\JobPosting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EREmployeeChangeFormController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $ecfs = EREmployeeChangeForm::with(['employee'])->paginate();
        // $job_posting = JobPosting::where('id', $request->job_posting_id)->with(['job_requisition'])->first();
        return response()->json([
            ...$ecfs,
            // 'job_posting' => $job_posting
        ]);
    }

    public function accept_employee_change_form(Request $request)
    {
        // 1. Use findOrFail so the code automatically stops and returns a 404 if the form doesn't exist.
        $ecf = EREmployeeChangeForm::findOrFail($request->employee_change_form_id);
        // 2. Prepare an empty array to collect all the changes
        $updateData = [];

        // 3. Compare the request to the form data and populate the array
        if ($request->info_position_level_to != $ecf->info_position_level_from) {
            $updateData['position_level'] = $request->info_position_level_to;
        }

        if ($request->info_department_id_to != $ecf->info_department_id_from) {
            $updateData['department_id'] = $request->info_department_id_to;
        }

        // Fixed typo here: changed $ecf->info_account_id_to -> $ecf->info_account_id_from
        if ($request->info_account_id_to != $ecf->info_account_id_from) {
            $updateData['account_id'] = $request->info_account_id_to;
        }

        if ($request->info_status_to != $ecf->info_status_from) {
            $updateData['status'] = $request->info_status_to;
        }

        if ($request->info_position_to != $ecf->info_position_from) {
            $updateData['position'] = $request->info_position_to;
        }

        if ($request->info_reporting_id_to != $ecf->info_reporting_id_from) {
            $leader = ERLeader::where('user_id', $request->info_reporting_id_to)->first();
            if ($leader) {
                $updateData['e_r_leader_id'] = $leader->id;
                ERSubordinate::updateOrCreate(
                    // 1. Search for this record
                    ['subordinate_id' => $request->employee['user_id']],
                    // 2. Update or insert this data
                    ['er_leader_id' => $leader->id]
                );
            }
        }

        if ($request->info_basic_pay_to != $ecf->info_basic_pay_from) {
            $updateData['basic_pay'] = $request->info_basic_pay_to;
        }

        if ($request->info_allowances_to != $ecf->info_allowances_from) {
            $updateData['allowance'] = $request->info_allowances_to;
        }


        // 4. If there are changes, execute ONE single update query
        if (!empty($updateData)) {
            AccountEmployee::where('user_id', $request->employee['user_id'])->update($updateData);
        }

        // 5. Update the form status
        $ecf->update([
            'status' => 'Accepted'
        ]);

        // 6. Return response
        return response()->json([
            'status' => 'success',
            'message' => 'Employee change form accepted and profile updated.',
        ], 200);
    }
    public function store(Request $request)
    {
        $ecf = EREmployeeChangeForm::create($request->all());
        $user = User::where('id', $request->user_id)->with(['account_employee'])->first();
        $url = url("/accounts/my_documents/" . $ecf->id . "/employee_change_form");
        Mail::to($user->account_employee['eogs_email'] ?? $user->email)->send(new ChangeFormEmail($user, $url));
        return response()->json([
            'status' => 'success',
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $ecf = EREmployeeChangeForm::where('id', $id)->with(['employee', 'account_to', 'department_to', 'prepaired_by'])->first();
        return response()->json([
            'data' => $ecf,
            'status' => 'success',
        ], 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, EREmployeeChangeForm $eREmployeeChangeForm)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EREmployeeChangeForm $eREmployeeChangeForm)
    {
        //
    }
}
