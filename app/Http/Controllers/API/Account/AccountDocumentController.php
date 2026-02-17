<?php

namespace App\Http\Controllers\API\Account;

use App\Http\Controllers\Controller;
use App\Models\Account\AccountDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

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
        // 1. Validate inputs to prevent processing bad data
        $request->validate([
            'names'   => 'required|array',
            'files'   => 'required|array',
            'files.*' => 'file|max:10240', // Example: Max 10MB per file
        ]);

        try {
            foreach ($request->names as $key => $name) {

                // Check if the specific file index exists
                if ($request->hasFile("files.$key")) {

                    $file = $request->file("files.$key");

                    // 2. Upload with error checking
                    $path = $file->store('unified/account', 's3');

                    // CRITICAL: If store returns false/empty, stop here before causing errors downstream
                    if (empty($path)) {
                        throw new \Exception("Failed to upload file for {$name}. Path returned empty.");
                    }

                    $url = Storage::disk('s3')->url($path);

                    // 3. Update Database
                    // Note: If this line crashes, the issue is in your AccountDocument Model (See Part 2)
                    AccountDocument::updateOrCreate(
                        [
                            'user_id' => Auth::id(),
                            'name'    => $name,
                        ],
                        [
                            'url' => $url,
                        ]
                    );
                }
            }

            return response()->json([
                'status'  => 'success',
                'message' => 'Documents saved successfully.',
            ], 200);
        } catch (\Exception $e) {
            // Log the full error so you can see it in storage/logs/laravel.log
            Log::error("Document Upload Error: " . $e->getMessage());
            Log::error($e->getTraceAsString());

            return response()->json([
                'status'  => 'error',
                'message' => 'An error occurred while saving documents: ' . $e->getMessage(),
            ], 500);
        }
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
