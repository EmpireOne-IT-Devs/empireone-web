<?php

namespace App\Http\Controllers\API\ER;

use App\Models\ER\ERLeader;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class ERLeaderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $leaders = ERLeader::with(['user'])->get();
        return response()->json([
            'data' => $leaders,
            'status' => 'success',
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        ERLeader::create([
            'user_id' => $request->user_id
        ]);
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
