<?php

namespace App\Http\Controllers\API\Account;

use App\Http\Controllers\Controller;

use App\Models\Account\AccountSkills;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AccountSkillsController extends Controller
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
            AccountSkills::updateOrCreate(
                ['user_id' => Auth::id()], // only check by user_id
                [
                    'skill'      => $value['skill'],
                    'percentage' => $value['percentage'],
                ]
            );
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'Skills saved successfully.',
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(AccountSkills $accountSkills)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AccountSkills $accountSkills)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AccountSkills $accountSkills)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AccountSkills $accountSkills)
    {
        //
    }
}
