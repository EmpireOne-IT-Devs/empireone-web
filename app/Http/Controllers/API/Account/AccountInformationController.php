<?php

namespace App\Http\Controllers\API\Account;

use App\Http\Controllers\Controller;

use App\Models\Account\AccountInformation;
use Illuminate\Http\Request;

class AccountInformationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json('success', 200);
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(AccountInformation $accountInformation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AccountInformation $accountInformation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AccountInformation $accountInformation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AccountInformation $accountInformation)
    {
        //
    }
}
