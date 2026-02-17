<?php

namespace App\Http\Controllers\API\Account;

use App\Http\Controllers\Controller;

use App\Models\Account\AccountDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AccountDocumentController extends Controller
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
        // foreach ($request->names as $key => $name) {

        //     if ($request->hasFile("files.$key")) {
        //         $path = $request->file("files.$key")->store('unified/account', 's3');
        //         $url  = Storage::disk('s3')->url($path);

        //         AccountDocument::updateOrCreate(
        //             [
        //                 'user_id' => Auth::id(),
        //                 'name'    => $name,
        //             ],
        //             [
        //                 'url' => $url,
        //             ]
        //         );
        //     }
        // }
        

        return response()->json([
            'data'=>$request->all(),
            'status'  => 'success',
            'message' => 'Documents saved successfully.',
        ], 200);
    }


    /**
     * Display the specified resource.
     */
    public function show(AccountDocument $accountDocument)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AccountDocument $accountDocument)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AccountDocument $accountDocument)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AccountDocument $accountDocument)
    {
        //
    }
}
