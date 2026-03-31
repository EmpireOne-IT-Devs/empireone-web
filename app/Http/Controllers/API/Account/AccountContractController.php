<?php

namespace App\Http\Controllers\API\Account;

use App\Http\Controllers\Controller;
use App\Models\Account\AccountContract;
use App\Models\Account\AccountEmployee;
use Illuminate\Http\Request;

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

        $ae = AccountEmployee::where('user_id', '=', $request->user_id)->first();
        if ($ae) {
            $ae->update([
                'onboarding_agree_on' => $request->onboarding_agree_on
            ]);
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

        // 3. Return a response
        return response()->json([
            'message' => 'Employment record saved successfully',
            'data' => $employment
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
