<?php

namespace App\Http\Controllers\API\Account;

use App\Http\Controllers\Controller;

use App\Models\Account\AccountWorkingExperience;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AccountWorkingExperienceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function store(Request $request)
    {
        foreach ($request->experiences as $value) {
            AccountWorkingExperience::updateOrCreate(
                ['user_id' => Auth::id()], // check by user_id only
                [
                    'company_name'   => $value['company_name'],
                    'position'       => $value['position'],
                    'start_date'     => $value['start_date'],
                    'end_date'       => $value['end_date'],
                    'job_description' => $value['job_description'],
                    'status'         => $value['status'],
                ]
            );
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'Working Experience saved successfully.',
        ], 200);
    }


    /**
     * Display the specified resource.
     */
    public function show(AccountWorkingExperience $accountWorkingExperience)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AccountWorkingExperience $accountWorkingExperience)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AccountWorkingExperience $accountWorkingExperience)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AccountWorkingExperience $accountWorkingExperience)
    {
        //
    }
}
