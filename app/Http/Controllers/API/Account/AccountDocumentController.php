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
            $url = null;
            if ($request->hasFile("files.$key")) {

                $file = $request->file("files.$key");

                // Convert to Base64
                $fileContents = file_get_contents($file->getRealPath());
                $base64 = base64_encode($fileContents);

                // Decode Base64 back to binary
                $decodedFile = base64_decode($base64);

                // Create temporary file
                $tmpFilePath = sys_get_temp_dir() . '/' . Str::uuid();
                file_put_contents($tmpFilePath, $decodedFile);

                // Create UploadedFile instance
                $tempFile = new \Illuminate\Http\UploadedFile(
                    $tmpFilePath,
                    $file->getClientOriginalName(),
                    $file->getMimeType(),
                    null,
                    true // mark as test file
                );

                // ✅ Now you can use store()
                $path = $tempFile->store('unified/account', 's3');

                $url = Storage::disk('s3')->url($path);

                // Optional: delete temp file
                unlink($tmpFilePath);
            }


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
            'message' => 'Documents uploaded successfully.',
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
