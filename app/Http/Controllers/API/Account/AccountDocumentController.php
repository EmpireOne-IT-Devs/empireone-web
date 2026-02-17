<?php

namespace App\Http\Controllers\API\Account;

use App\Http\Controllers\Controller;

use App\Models\Account\AccountDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
    

    foreach ($request->names as $key => $name) {
        
        $url = null; // Initialize URL to null to avoid undefined variable errors

        if ($request->hasFile("files.$key")) {
            $file = $request->file("files.$key");

            // 1. Read the file binary data
            $fileContents = file_get_contents($file->getRealPath());

            // 2. Encode to Base64
            $base64 = base64_encode($fileContents);
            $mimeType = $file->getMimeType();
            
            // Format: "data:image/png;base64,....."
            $base64Data = 'data:' . $mimeType . ';base64,' . $base64;

            // 3. Define the path (Use .txt or .b64 extension since it is now text)
            $filename = Str::uuid() . '.txt';
            $path = 'unified/account/' . $filename;

            // 4. Upload the TEXT string to S3
            Storage::disk('s3')->put($path, $base64Data);

            // 5. Get the URL
            $url = Storage::disk('s3')->url($path);
        }

        // Only update DB if we have a new URL or you want to update just the name
        if ($url) {
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
        'message' => 'Documents converted to Base64 and saved to S3.',
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
