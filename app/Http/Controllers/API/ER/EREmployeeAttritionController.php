<?php

namespace App\Http\Controllers\API\ER;

use App\Http\Controllers\Controller;
use App\Models\Account\AccountDocument;
use App\Models\Account\AccountEmployee;
use App\Models\ER\EREmployeeAttrition;
use App\Models\ER\ERLeader;
use App\Models\User;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class EREmployeeAttritionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $attritions = EREmployeeAttrition::with(['employee','exit_clearance','exit_interview'])->paginate(12);
        return response()->json($attritions, 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }



    public function my_empireone_send_email(array $payload)
    {
        $webAppUrl = env('MY_EMPIRE_SEND_EMAIL');

        return Http::asForm() // Sends as x-www-form-urlencoded
            ->withOptions([
                'allow_redirects' => true,
            ])
            ->post($webAppUrl, [
                'recipient' => $payload['recipient'],
                'cc'        => $payload['cc'] ?? '',
                'subject'   => $payload['subject'],
                'body'      => $payload['body'],
            ]);
    }
    public function store(Request $request)
    {
        // Wrap everything in a database transaction for data integrity
        $e_r_leader = ERLeader::where('id', $request->e_r_leader_id)->with(['employee.personal_information'])->first();

        // Extract leader full name safely
        $leaderInfo = $e_r_leader?->employee?->personal_information;
        $immediateSupervisor = trim(($leaderInfo['first_name'] ?? '') . ' ' . ($leaderInfo['last_name'] ?? ''));

        // Extract manager full name safely
        $managerInfo = $request->department['manager'] ?? null;
        $departmentManager = trim(($managerInfo['first_name'] ?? '') . ' ' . ($managerInfo['last_name'] ?? ''));

        $attrition = EREmployeeAttrition::updateOrCreate(
            ['employee_id' => $request->employee_id],
            [
                'user_id'               => $request->user_id,
                'position'              => $request->position,
                'department'            => $request->department['name'] ?? null,
                'account'               => $request->account['name'] ?? '',
                'eogs_email'            => $request->eogs_email,
                'started_at'            => $request->started_at,
                'separation_date'       => $request->separation_date,
                'employment_status'     => $request->employment_status,
                'status'                => $request->status,
                'reason_for_separation' => $request->reason_for_separation,
                'is_rehire'             => $request->is_rehire,
                'attrition_status'      => 'Pending',
                'immediate_supervisor' => $immediateSupervisor,
                'department_manager'    => $departmentManager,
            ]
        );

        $account_employee = AccountEmployee::where('user_id', $request->user_id)->first();
        $account_document = AccountDocument::where('user_id', $request->user_id)->first();

        if ($account_employee) {

            // FIX: Ensure document actually exists before updating
            if ($account_document) {
                $account_document->update([
                    'status' => 'Archived'
                ]);
            }

            // $account_employee->update([
            //     'employment_status'     => $request->employment_status,
            //     'reason_for_separation' => $request->reason_for_separation,
            //     'is_rehire'             => $request->is_rehire,
            //     'position'              => null,
            //     'department_id'         => null,
            //     'account_id'            => null,
            //     'started_at'            => null,
            //     'e_r_leader_id'         => null,
            //     'is_has_contract'       => null,
            //     'employee_id'           => null,
            //     'signature'             => null,
            //     'onboarding_agree_on'   => null,
            //     'status'                => null,
            //     'basic_pay'             => null,
            //     'allowance'             => null,
            // ]);

            // Define CC recipients as an array for clean maintainability
            $ccEmails = [
                'eogs.quicky@gmail.com',
                'eogs.marlou@gmail.com',
            ];

            // $this->my_empireone_send_email([
            //     'recipient' => $request->email,
            //     'cc'        => implode(', ', $ccEmails) ?? '',
            //     'subject'   => 'Exit Clearance & Interview Process - ' . $request->name,
            //     'body'      => view('emails.human_resources.exit-clearance-interview', [
            //         'id'       => $attrition->id,
            //         'name'     => $request->name,
            //         'position' => $account_employee->position ?? 'N/A',
            //     ])->render(),
            // ]);

            // OPTIMIZATION: Used $request->user_id directly
            // User::where('id', $request->user_id)->update([
            //     'role' => '3',
            // ]);
            $leader =  ERLeader::where('user_id', $request->user_id)->first();
            if ($leader) {
                $leader->update([
                    'user_id' => null,
                ]);
            }
        }

        return response()->json([
            'status' => 'success',
            'data'   => $attrition
        ]);
    }
    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $attrition = EREmployeeAttrition::with(['employee.personal_information', 'exit_clearance', 'exit_interview'])
            ->findOrFail($id);

        return response()->json([
            ...$attrition->toArray(),
            'user' => Auth::user()?->load('account_employee'),
        ]);
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
