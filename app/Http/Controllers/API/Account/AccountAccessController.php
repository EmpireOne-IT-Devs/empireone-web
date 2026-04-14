<?php

namespace App\Http\Controllers\API\Account;

use App\Models\Account\AccountAccess;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AccountAccessController extends Controller
{

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 1. Define which keys we are looking for from the frontend
        $approvalKeys = ['first_approval', 'second_approval'];

        foreach ($approvalKeys as $key) {
            if ($request->has($key)) {
                $data = $request->input($key);
                AccountAccess::updateOrCreate(
                    [
                        'type'  => $data['type'],
                        'order' => $data['order'],
                    ],
                    [
                        'user_id' => $data['user_id'],
                    ]
                );
            }
        }

        return response()->json([
            'message' => 'Settings updated successfully',
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(AccountAccess $accountAccess)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AccountAccess $accountAccess)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AccountAccess $accountAccess)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AccountAccess $accountAccess)
    {
        //
    }
}
