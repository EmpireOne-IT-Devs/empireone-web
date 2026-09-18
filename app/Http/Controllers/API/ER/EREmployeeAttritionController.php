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
    public function index(Request $request)
    {
        $locationId = $request->query('location_id');

        // 1. Initialize query with nested relationship
        $query = EREmployeeAttrition::with([
            'personal_information.employee',
            'exit_clearance',
            'exit_interview'
        ]);

        // 2. Filter by location_id through personal_information -> employee
        if ($locationId) {
            $query->whereHas('personal_information.employee', function ($q) use ($locationId) {
                $q->where('location_id', $locationId);
            });
        }

        // 3. Paginate filtered or unfiltered results
        $attritions = $query->paginate(12);

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
                'bcc'        => $payload['bcc'] ?? '',
                'subject'   => $payload['subject'],
                'body'      => $payload['body'],
            ]);
    }
    public function store(Request $request)
    {
        // Wrap everything in a database transaction for data integrity
        $e_r_leader = ERLeader::where('id', $request->supervisor_id)->with(['employee.personal_information'])->first();
        $department_manager = ERLeader::where('id', $request->department_manager_id)->with(['employee.personal_information'])->first();
        $emails = collect($request->clearance_departments)->pluck('assigned_email')->filter()->values()->toArray();

        $leaderInfo = $e_r_leader?->employee?->personal_information;
        $immediateSupervisor = trim(($leaderInfo['first_name'] ?? '') . ' ' . ($leaderInfo['last_name'] ?? ''));

        $managerInfo = $department_manager?->employee?->personal_information;
        $departmentManager = trim(($managerInfo['first_name'] ?? '') . ' ' . ($managerInfo['last_name'] ?? ''));
        $account_employee = AccountEmployee::where('user_id', $request->user_id)->with(['user', 'personal_information'])->first();
        $account_document = AccountDocument::where('user_id', $request->user_id)->first();

        $firstName = $account_employee->personal_information->first_name ?? '';
        $lastName  = $account_employee->personal_information->last_name ?? '';
        $fullName  = trim("{$firstName} {$lastName}") ?: ($request->name ?? 'N/A');

        $attrition = EREmployeeAttrition::updateOrCreate(
            ['employee_id' => $request->employee_id],
            [
                'user_id'               => $request->user_id ?? null,
                'position'              => $request->position,
                'department'            => $request->department['name'] ?? null,
                'account'               => $request->account['name'] ?? '',
                'started_at'            => $request->started_at ?? null,
                'separation_date'       => $request->separation_date ?? null,
                'employment_status'     => $request->employment_status ?? null,
                'status'                => $request->status ?? null,
                'reason_for_separation' => $request->reason_for_separation ?? null,
                'is_rehire'             => $request->is_rehire ?? null,
                'attrition_status'      => 'Pending' ?? null,
                'immediate_supervisor' => $immediateSupervisor ?? null,
                'department_manager'    => $departmentManager ?? null,
                'last_working_date' => $request->last_working_date,
                'is_liquidated' => $request->is_liquidated,
                'days_of_liquidated' => $request->days_of_liquidated,
                'clearance_departments' => $request->clearance_departments,
                'eogs_email' => $request->eogs_email
            ]
        );



        if ($account_employee) {

            //     // FIX: Ensure document actually exists before updating
            if ($account_document) {
                $account_document->update([
                    'status' => 'Archived'
                ]);
            }

            // $bccEmails = array_values(array_unique(array_filter([
            //     $e_r_leader?->employee?->eogs_email ?? '',
            //     $department_manager?->employee?->eogs_email ?? '',
            //     'accounting@empireonegroup.com',
            //     'bem@empireonegroup.com',
            //     'carcarhr@empireonegroup.com',
            //     'compben@empireonegroup.com',
            //     'compliance@empireonecx.com',
            //     'edwin@empireonegroup.com',
            //     'elona@empireonegroup.com',
            //     'eunice@empireonegroup.com',
            //     'grecar@empireonecx.com',
            //     'honeylyn@empireonegroup.com',
            //     'john@empireonegroup.com',
            //     'jona@empireonegroup.com',
            //     'juliepearl.labasan@empireonegroup.com',
            //     'marc@empireonecx.com',
            //     'mark@empireonecx.com',
            //     'milcah@empireonegroup.com',
            //     'mlourdes@empireonegroup.com',
            //     'paul@empireonegroup.com',
            //     'scaccounting@empireonegroup.com',
            //     // 'schr@empireonegroup.com',
            //     'scitns@empireonegroup.com',
            //     'wfm-scheduler@empireonegroup.com',
            //     'peter@empireonegroup.com',
            //     'chaquira@empireonegroup.com',
            //     'scchr@empireonegroup.com',
            //     'rheamae@empireonegroup.com',
            //     'mika@empireonecx.com',
            //     // 'quincy@empireonecx.com',
            //     'charmaine@empireonecx.com',
            //     'jrusiana@empireonecx.com',
            //     'markpatena@empireonegroup.com',
            //     'jude@empireonecx.com',
            //     'charity@empireonegroup.com',
            //     'ruth@empireonegroup.com',
            //     'roger@empireonegroup.com',
            //     // 'gio@empireonecx.com',
            //     'hashie@empireonegroup.com',
            //     'markanthony@empireonecx.com',
            //     'anthony@empireonecx.com',
            //     'empireone.hrd@empireonegroup.com',
            // ])));

            $account_employee->update([
                'employment_status'     => $request->employment_status,
                'reason_for_separation' => $request->reason_for_separation,
                'is_rehire'             => $request->is_rehire,
                'position'              => null,
                'department_id'         => null,
                'account_id'            => null,
                'started_at'            => null,
                'e_r_leader_id'         => null,
                'is_has_contract'       => null,
                'employee_id'           => null,
                'onboarding_agree_on'   => null,
                'status'                => null,
                'basic_pay'             => null,
                'allowance'             => null,
            ]);

            $bccEmails = array_values(array_unique(array_filter([
                'webdev@empireonegroup.com',
                'scchr@empireonegroup.com',
                $e_r_leader?->employee?->eogs_email ?? '',
                $department_manager?->employee?->eogs_email ?? '',
                'anthony@empireonecx.com',
                ...($emails ?? []), 
            ])));

            $this->my_empireone_send_email([
                // 'recipient' => $request->email,
                'recipient' => 'webdev@empireonegroup.com',
                'bcc'       => implode(', ', $bccEmails) ?? '',
                'subject'   => 'Offboarding Request - ' . $fullName . ' (' . ($attrition->employee_id ?? 'N/A') . ')',
                'body'      => view('emails.human_resources.exit-clearance-interview', [
                    'id'                      => $attrition->id,
                    'eid'                     => $attrition->employee_id ?? 'N/A',
                    'name'                    => $fullName,
                    'position'                => $attrition->position ?? 'N/A',
                    'account'                 => $attrition->account ?? 'N/A',
                    'date_of_joining'         => !empty($attrition->started_at) ? date('d-M-y', strtotime($attrition->started_at)) : 'N/A',
                    'last_working_date'       => !empty($attrition->last_working_date) ? date('d-M-y', strtotime($attrition->last_working_date)) : 'N/A',
                    'separation_date'         => !empty($attrition->separation_date) ? date('d-M-y', strtotime($attrition->separation_date)) : 'N/A',
                    'type_of_separation'      => $attrition->reason_for_separation ?? 'N/A',
                    'eligibility_for_rehire'  => isset($attrition->is_rehire) ? ($attrition->is_rehire ? 'Yes' : 'No') : 'N/A',
                    'notice_period'           => isset($attrition->days_of_liquidated) ? ($attrition->days_of_liquidated > 0 ? $attrition->days_of_liquidated . ' Days' : 'No') : 'N/A',
                    'clawback'                => isset($attrition->is_liquidated) ? ($attrition->is_liquidated ? 'Yes' : 'No') : 'N/A',
                ])->render(),
            ]);

            User::where('id', $request->user_id)->update([
                'role' => '3',
            ]);
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
        ], 200);
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
