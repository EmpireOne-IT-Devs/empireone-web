<?php

namespace App\Http\Controllers\API\ER;

use App\Models\ER\ERLeader;
use App\Http\Controllers\Controller;
use App\Models\Account\AccountEmployee;
use App\Models\User;
use Illuminate\Http\Request;

class ERLeaderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $leaders = ERLeader::with('user')->withCount('subordinates')->get();
        $users = User::whereIn('role', [1, 2])->with(['personal_information'])->get();
        return response()->json([
            'data' => $leaders,
            'users' => $users,
            'status' => 'success',
        ], 200);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        ERLeader::updateOrCreate(
            // 1. Search criteria: Look for an existing record with this user_id
            ['user_id' => $request->user_id],

            // 2. Values to update: Leave empty because there are no other fields to update
            []
        );
        $user = User::where('id', $request->user_id)->first();
        if ($user) {
            $user->update([
                'role' => 1
            ]);
        }
        return response()->json([
            'status' => 'success',
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $leader = ERLeader::where('id', $id)->with(['subordinates', 'user'])->first();

        $employees = User::whereIn('role', ['1', '2'])->with(['personal_information'])->get();
        // foreach ($leader['subordinates']  as $key => $value) {
        //     AccountEmployee::where('user_id', $value['subordinate_id'])->update([
        //         'account_id' => '5',
        //         'department_id' => '4',
        //     ]);
        // }
        return response()->json([
            'data' => $leader,
            'employees' => $employees,
            'status' => 'success',
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ERLeader $eRLeader)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ERLeader $eRLeader)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ERLeader $eRLeader)
    {
        //
    }
}
