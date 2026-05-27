<?php

namespace App\Http\Controllers\API\ER;

use App\Models\ER\ERSubordinate;
use App\Http\Controllers\Controller;
use App\Models\Account\AccountEmployee;
use App\Models\ER\ERLeader;
use Illuminate\Http\Request;

class ERSubordinateController extends Controller
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
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 1. Validate the incoming request payload
        $request->validate([
            'er_leader_id' => 'required|integer',
            'subordinates' => 'required|array',
            'subordinates.*' => 'required|integer'
        ]);
        $leaderId = $request->er_leader_id;
        $leader = ERLeader::where('id', $leaderId)->with(['employee'])->first();
        $subordinates = $request->subordinates;
        foreach ($subordinates as $subordinateId) {
            if ($subordinateId) {
                ERSubordinate::firstOrCreate([
                    'er_leader_id' => $leaderId,
                    'subordinate_id' => $subordinateId
                ]);
                AccountEmployee::where('user_id', $subordinateId)->update([
                    'e_r_leader_id' => $leader->id,
                    'account_id' => $leader['employee']['account_id'] ?? null,
                    'department_id' => $leader['employee']['department_id'] ?? null,
                ]);
            }
        }
        return response()->json([
            'status' => 'success',
            'message' => 'Members successfully assigned to leader.'
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(ERSubordinate $eRSubordinate)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ERSubordinate $eRSubordinate)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ERSubordinate $eRSubordinate)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ERSubordinate $eRSubordinate)
    {
        //
    }
}
