<?php

namespace App\Http\Controllers\API\Account;

use App\Http\Controllers\Controller;
use App\Models\Account\AccountContract;
use App\Models\Account\AccountEmployee;
use App\Models\Account\AccountPersonalInformation;
use App\Models\Account\AccountSkills;
use App\Models\Account\AccountWorkingExperience;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class AccountContractController extends Controller
{


    public function edit_information(Request $request)
    {
        AccountPersonalInformation::where('user_id', $request->id)->update([
            'first_name' => $request->first_name,
            'middle_name' => $request->middle_name,
            'last_name' => $request->last_name,
            'suffix' => $request->suffix,
            'gender' => $request->gender,
            'date_of_birth' => $request->date_of_birth,
            'birth_place' => $request->birth_place,
            'nationality' => $request->nationality,
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
                    'user_id' => $request->id,
                    'skill' => $value['skill'] ?? null,
                    'percentage' => $value['percentage'] ?? null,
                ]
            );

            $skillIds[] = $skill->id;
        }

        // 🔥 Delete skills not in request
        AccountSkills::where('user_id', $request->id)
            ->whereNotIn('id', $skillIds)
            ->delete();

        $experienceIds = [];

        foreach ($request->experiences ?? [] as $value) {
            $exp = AccountWorkingExperience::updateOrCreate(
                ['id' => $value['id'] ?? null],
                [
                    'user_id' => $request->id,
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

        // 🔥 Delete experiences not in request
        AccountWorkingExperience::where('user_id', $request->id)
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

        $employee = AccountEmployee::where('user_id', '=', $request->user_id)->first();

        $employment = AccountContract::where('user_id', '=', $request->user_id)->first();
        if ($employee) {
            $employee->update([
                'onboarding_agree_on' => $request->onboarding_agree_on
            ]);
            User::where('id', '=', $request->user_id)->update([
                'role' => 2
            ]);
        }

        if ($employee->account_contract_id && $employee->onboarding_agree_on) {
            $todayEmployeeIds = AccountEmployee::whereDate('created_at', Carbon::today())
                ->pluck('employee_id')
                ->toArray();
            $todaySequences = array_map(function ($id) {
                return (int)substr($id, -2);
            }, $todayEmployeeIds);
            $sequence = 1;
            while (in_array($sequence, $todaySequences)) {
                $sequence++;
            }
            $employee_id = date('y') . date('m') . date('d') . str_pad($sequence, 2, '0', STR_PAD_LEFT);
            $isExist = in_array($employee->employee_id, $todayEmployeeIds);

            if (!$isExist || $employee->employee_id == null) {
                $account =  AccountEmployee::where('user_id', '=', $employment->user_id)->first();
                if ($account) {
                    $account->update([
                        'employee_id' => $employee_id
                    ]);
                }
            }
        }
        return response()->json([
            'message' => 'Onboarding documents record saved successfully',
        ], 200);
    }
    public function store(Request $request)
    {
        $employment = AccountContract::firstOrCreate(
            ['user_id' => $request->user_id],
            $request->all()
        );

        $employee = AccountEmployee::updateOrCreate(
            ['user_id' => $request->user_id],
            ['account_contract_id' => $employment->id]
        );

        $user = User::where('id', '=', $request->user_id)->first();
        if ($user) {
            $user->update([
                'role' => 2
            ]);
        }

        if ($employee->account_contract_id && $employee->onboarding_agree_on) {
            $todayEmployeeIds = AccountEmployee::whereDate('created_at', Carbon::today())
                ->pluck('employee_id')
                ->toArray();
            $todaySequences = array_map(function ($id) {
                return (int)substr($id, -2);
            }, $todayEmployeeIds);
            $sequence = 1;
            while (in_array($sequence, $todaySequences)) {
                $sequence++;
            }
            $employee_id = date('y') . date('m') . date('d') . str_pad($sequence, 2, '0', STR_PAD_LEFT);
            $isExist = in_array($employee->employee_id, $todayEmployeeIds);

            if (!$isExist || $employee->employee_id == null) {
                $account =  AccountEmployee::where('user_id', '=', $employment->user_id)->first();
                if ($account) {
                    $account->update([
                        'employee_id' => $employee_id
                    ]);
                }
            }
        }

        // 3. Return a response
        return response()->json([
            'message' => 'Employment record saved successfully',
            'data' => $employment,
            'employee' => $employee
        ], 200);
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
