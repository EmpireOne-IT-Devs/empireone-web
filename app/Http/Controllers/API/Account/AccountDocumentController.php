<?php

namespace App\Http\Controllers\API\Account;

use App\Http\Controllers\Controller;

use App\Models\Account\AccountDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AccountDocumentController extends Controller
{

    public function get_documents_by_user()
    {
        // 1. Fetch all documents for the user (One database query)
        $documents = AccountDocument::where('user_id', Auth::id())->get();

        // 2. Return the data and use collection methods to count the statuses
        return response()->json([
            'data'  => $documents,
            'stats' => [
                'total'       => $documents->count(),
                'pending'     => $documents->where('status', 'Pending')->count(),
                'declined'    => $documents->where('status', 'Declined')->count(),
                'approved'    => $documents->where('status', 'Approved')->count(),
                're_uploaded' => $documents->where('status', 'Re-Uploaded')->count(),
            ]
        ], 200);
    }
    public function add_documents(Request $request)
    {
        if (!$request->has('documents') || !is_array($request->documents)) {
            return response()->json(['error' => 'No documents provided.'], 400);
        }

        foreach ($request->documents as $doc) {
            $filePath = null;
            if (isset($doc['file']) && $doc['file']->isValid()) {
                $originalName = $doc['file']->getClientOriginalName();
                $filePath = $doc['file']->store('unified/account/201File', 's3');
            }
            AccountDocument::updateOrCreate(
                [
                    'user_id' => Auth::id(),
                    'type'    => '201 File',
                    'name'   => $doc['name'],
                ],
                [
                    'status' => 'Pending',
                    'url'    => $filePath ? Storage::disk('s3')->url($filePath) : null,
                ]
            );
        }

        return response()->json([
            'data' => $request->documents,
            'status'  => 'success',
            'message' => 'Documents uploaded securely to S3.',
        ], 200);
    }

    public function store(Request $request)
    {
        foreach ($request->names ?? [] as $key => $name) {
            $url = null;
            if ($request->hasFile("files.$key")) {
                $path = $request->file("files.$key")->store('unified/account/201File', 's3');
                $url  = Storage::disk('s3')->url($path);
            }
            AccountDocument::updateOrCreate(
                [
                    'user_id' => Auth::id(),
                    'name'    => $name,
                ],
                [
                    'url'    => $url,
                    'status' => 'Approved',
                    'type'   => $request->types[$key] ?? null
                ]
            );
        }

        return response()->json([
            'data' => $request->all(),
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
