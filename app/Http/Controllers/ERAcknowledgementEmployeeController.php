<?php

namespace App\Http\Controllers;

use App\Models\ER\ERAcknowledgementEmployee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ERAcknowledgementEmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'acknowledgement_item_id' => 'nullable|integer',
            'acknowledgement_id'      => 'nullable|integer',
        ]);

        $userId = Auth::id();

        // 2. Handle Item Acknowledgement
        if ($request->acknowledgement_item_id) {
            ERAcknowledgementEmployee::firstOrCreate([
                'user_id' => $userId,
                'e_r_acknowledgement_item_id' => $request->acknowledgement_item_id
            ]);
        }

        if ($request->acknowledgement_id) {
            ERAcknowledgementEmployee::firstOrCreate([
                'user_id' => $userId,
                'e_r_acknowledgement_id' => $request->acknowledgement_id
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Acknowledgement recorded successfully.'
        ]);
    }
    /**
     * Display the specified resource.
     */
    public function show(ERAcknowledgementEmployee $eRAcknowledgementEmployee)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ERAcknowledgementEmployee $eRAcknowledgementEmployee)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ERAcknowledgementEmployee $eRAcknowledgementEmployee)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ERAcknowledgementEmployee $eRAcknowledgementEmployee)
    {
        //
    }
}
