<?php

namespace App\Http\Controllers;

use App\Models\ER\ERAcknowledgement;
use App\Models\ER\ERAcknowledgementEmployee;
use App\Models\ER\ERAcknowledgementItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ERAcknowledgementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $acknowledgements = ERAcknowledgement::with(['items'])->get();
        $acknowledgedRecords = ERAcknowledgementEmployee::where('user_id', Auth::id())->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Acknowledgements fetched successfully.',
            'data' => [
                'acknowledgements' => $acknowledgements,
                'user_acknowledgements' => $acknowledgedRecords
            ],
        ], 200); // Changed to 200 OK
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 1. Validate the incoming FormData
        $request->validate([
            'title' => 'nullable|string|max:255',
            'file' => 'nullable|file', // Add mimes:pdf,jpg,png etc. if needed
            'items' => 'nullable|array',
            'items.*.title' => 'nullable|string|max:255',
            'items.*.file' => 'nullable|file',
        ]);


        try {
            // 3. Handle Main Acknowledgement File Upload
            $mainFilePath = null;
            if ($request->hasFile('file')) {
                $path = $request->file("file")->store('unified/account/acknowledgements', 's3');
                $mainFilePath  = Storage::disk('s3')->url($path);
            }

            $acknowledgement = ERAcknowledgement::create([
                'title' => $request->title,
                'file' => $mainFilePath,
            ]);

            // 5. Handle Dynamic Items
            if ($request->has('items') && is_array($request->items)) {
                foreach ($request->items as $index => $item) {
                    $itemFilePath = null;
                    if ($request->hasFile("items.{$index}.file")) {
                        $path = $request->file("items.{$index}.file")->store('unified/account/acknowledgements', 's3');
                        $itemFilePath  = Storage::disk('s3')->url($path);
                    }
                    ERAcknowledgementItem::create([
                        'e_r_acknowledgement_id' => $acknowledgement->id,
                        'title' => $item['title'] ?? null,
                        'file' => $itemFilePath,
                    ]);
                }
            }


            return response()->json([
                'status' => 'success',
                'message' => 'Acknowledgements saved successfully.',
            ], 201);
        } catch (\Exception $e) {

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to save acknowledgements: ' . $e->getMessage()
            ], 500);
        }
    }

    public function add_sub_acknowledgement(Request $request)
    {
        // 1. Validate the incoming FormData
        $request->validate([
            'acknowledgement_id' => 'nullable',
            'items' => 'nullable|array',
            'items.*.title' => 'nullable|string|max:255',
            'items.*.file' => 'nullable|file',
        ]);

        try {


            // 5. Handle Dynamic Items
            if ($request->has('items') && is_array($request->items)) {
                foreach ($request->items as $index => $item) {
                    $itemFilePath = null;
                    if ($request->hasFile("items.{$index}.file")) {
                        $path = $request->file("items.{$index}.file")->store('unified/account/acknowledgements', 's3');
                        $itemFilePath  = Storage::disk('s3')->url($path);
                    }
                    ERAcknowledgementItem::create([
                        'e_r_acknowledgement_id' => $request->acknowledgement_id,
                        'title' => $item['title'] ?? null,
                        'file' => $itemFilePath,
                    ]);
                }
            }


            return response()->json([
                'status' => 'success',
                'message' => 'Acknowledgements saved successfully.',
            ], 201);
        } catch (\Exception $e) {

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to save acknowledgements: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ERAcknowledgement $eRAcknowledgement)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ERAcknowledgement $eRAcknowledgement)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ERAcknowledgement $eRAcknowledgement)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ERAcknowledgement $eRAcknowledgement)
    {
        //
    }
}
