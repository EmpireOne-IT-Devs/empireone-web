<?php

namespace App\Http\Controllers\API\Account;

use App\Http\Controllers\Controller;
use App\Mail\DocumentFileInstructions;
use App\Models\Account\AccountContract;
use App\Models\Account\AccountEmployee;
use App\Models\Jobs\JobApplication;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class AccountContractController extends Controller
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
    public function agree_onboarding(Request $request)
    {

        $employee = AccountEmployee::where('user_id', '=', $request->user_id)->first();

        $employment = AccountContract::where('user_id', '=', $request->user_id)->first();
        if ($employee) {
            $employee->update([
                'onboarding_agree_on' => $request->onboarding_agree_on
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
