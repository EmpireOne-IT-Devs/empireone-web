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
        // Validate both name and file
        $request->validate([
            'documents.*.name'  => 'required|string|max:255',
            'documents.*.image' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        foreach ($request->documents as $key => $value) {
            if ($request->hasFile("documents.$key.image")) {
                $file = $request->file("documents.$key.image");

                if ($file->isValid()) {
                    $path = $file->store('unified/account', 's3');
                    $url  = Storage::disk('s3')->url($path);

                    // Use updateOrCreate on both user_id + document name
                    AccountDocument::updateOrCreate(
                        [
                            'user_id' => Auth::id(),
                            'name'    => $value['name'],
                        ],
                        [
                            'url' => $url,
                        ]
                    );
                }
            }
        }

        return response()->json([
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
