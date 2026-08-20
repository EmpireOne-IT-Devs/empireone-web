<?php

namespace App\Http\Controllers\API\Account;

use App\Http\Controllers\Controller;
use App\Models\Account\AccountContract;
use App\Models\Account\AccountEmployee;
use App\Models\Account\AccountPersonalInformation;
use App\Models\Account\AccountSkills;
use App\Models\Account\AccountWorkingExperience;
use App\Models\ER\ERLeader;
use App\Models\ER\ERSubordinate;
use App\Models\Jobs\JobApplication;
use App\Models\Jobs\JobOffer;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class AccountContractController extends Controller
{


    public function edit_information(Request $request)
    {
        AccountPersonalInformation::where('user_id', Auth::id())->update([
            'first_name' => $request->first_name,
            'middle_name' => $request->middle_name,
            'last_name' => $request->last_name,
            'suffix' => $request->suffix,
            'gender' => $request->gender,
            'date_of_birth' => $request->date_of_birth,
            'birth_place' => $request->birth_place,
            'nationality' => $request->nationality,
            'previous_employee_status' => $request->previous_employee_status,
            'marital_status' => $request->marital_status,
            'region' => $request->region,
            'province' => $request->province,
            'city' => $request->city,
            'barangay' => $request->barangay,
            'street' => $request->street,
            'zip_code' => $request->zip_code,
            'school_name' => $request->school_name,
            'degree' => $request->degree,
            'course' => $request->course,
            'year_graduated' => $request->year_graduated,
            'awards' => $request->awards,
            'government_type' => $request->government_type,
            'id_number' => $request->id_number,
            'sss' => $request->sss,
            'tin' => $request->tin,
            'philhealth' => $request->philhealth,
            'pagibig' => $request->pagibig,
            'contact' => $request->contact,
            'contact_name' => $request->contact_name,
            'contact_address' => $request->contact_address,
            'contact_relationship' => $request->contact_relationship,
            'contact_number' => $request->contact_number,
        ]);

        $skillIds = [];

        foreach ($request->skills ?? [] as $value) {
            $skill = AccountSkills::updateOrCreate(
                ['id' => $value['id'] ?? null],
                [
                    'user_id' => Auth::id(),
                    'skill' => $value['skill'] ?? null,
                    'percentage' => $value['percentage'] ?? null,
                ]
            );

            $skillIds[] = $skill->id;
        }

        // 🔥 Delete skills not in request
        AccountSkills::where('user_id', Auth::id())
            ->whereNotIn('id', $skillIds)
            ->delete();

        $experienceIds = [];

        foreach ($request->experiences ?? [] as $value) {
            $exp = AccountWorkingExperience::updateOrCreate(
                ['id' => $value['id'] ?? null],
                [
                    'user_id' => Auth::id(),
                    'company_name' => $value['company_name'] ?? null,
                    'position' => $value['position'] ?? null,
                    'start_date' => $value['start_date'] ?? null,
                    'end_date' => $value['end_date'] ?? null,
                    'job_description' => $value['job_description'] ?? null,
                    'status' => $value['status'] ?? null,
                ]
            );
            $experienceIds[] = $exp->id;
        }

        AccountEmployee::updateOrCreate(
            ['user_id' => Auth::id()],
            [
                'employee_id' => $request->employee_id ?? null,
                'account_id' => $request->account_id ?? null,
                'department_id' => $request->department_id ?? null,
                'position' => $request->position ?? null,
                'eogs_email' => $request->eogs_email ?? null,
                'status' => $request->status ?? null,
                'e_r_leader_id' => $request->e_r_leader_id ?? null,
                'started_at' => $request->started_at ?? null,
                'position_level' => $request->position_level ?? null,
                'basic_pay' => $request->basic_pay ?? null,
                'allowance' => $request->allowance ?? null,
            ]
        );

        $leader = ERLeader::find($request->e_r_leader_id);
        if ($leader && $request->position_level != 'Executive') {
            ERSubordinate::updateOrCreate(
                ['subordinate_id' => $request->user_id], // 1. The condition to search for
                ['er_leader_id'   => $leader->id]       // 2. The data to update or create
            );
        }

        AccountWorkingExperience::where('user_id', Auth::id())
            ->whereNotIn('id', $experienceIds)
            ->delete();

        return response()->json([
            'message' => 'Information record saved successfully',
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function agree_onboarding(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'onboarding_agree_on' => 'required',
        ]);

        $employee = AccountEmployee::firstOrCreate(
            ['user_id' => $request->user_id]
        );

        $employee->update([
            'onboarding_agree_on' => $request->onboarding_agree_on
        ]);

        $this->processEmployeeHiring($employee, $request->user_id);

        return response()->json([
            'message' => 'Onboarding documents record saved successfully',
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $employee = AccountEmployee::updateOrCreate(
            ['user_id' => $request->user_id],
            ['is_has_contract' => true]
        );

        $this->processEmployeeHiring($employee, $request->user_id);

        return response()->json([
            'message' => 'Contract record saved successfully',
        ], 200);
    }

    /**
     * Handles employee ID assignment and onboarding status updates.
     */
    protected function processEmployeeHiring(AccountEmployee $employee, $userId): void
    {
        // Only run if contract is active, agreed on onboarding, and employee doesn't already have an ID
        if (!$employee->is_has_contract || !$employee->onboarding_agree_on || !empty($employee->employee_id)) {
            return;
        }
        // Generate unique employee ID for today (YYMMDDXX)
        $prefix = now()->format('ymd');

        $lastSequence = AccountEmployee::where('employee_id', 'like', $prefix . '%')
            ->selectRaw('MAX(CAST(RIGHT(employee_id, 2) AS UNSIGNED)) as max_seq')
            ->value('max_seq') ?? 0;

        $nextSequence = str_pad($lastSequence + 1, 2, '0', STR_PAD_LEFT);
        $newEmployeeId = $prefix . $nextSequence;

        // Assign ID and promote user
        $employee->update(['employee_id' => $newEmployeeId]);

        User::where('id', $userId)->update(['role' => 2]);

        JobApplication::where('user_id', $userId)
            ->where('final_status', 'Sent Documents')
            ->update(['final_status' => 'Hired']);
    }

    /**
     * Display the specified resource.
     */
    public function show(AccountContract $accountContract)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AccountContract $accountContract)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AccountContract $accountContract)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AccountContract $accountContract)
    {
        //
    }
}
