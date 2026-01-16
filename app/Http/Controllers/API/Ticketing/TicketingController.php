<?php

namespace App\Http\Controllers\API\Ticketing;

use App\Http\Controllers\Controller;

use App\Models\Ticketing;
use App\Models\TicketingImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TicketingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return 'success';
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
        $ticket =  Ticketing::create([
            ...$request->all(),
            'ticketing_id' => "TCK-ID-" . date('mdYHis')
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store(
                'unified/ticketing',
                's3'
            );
            $url = Storage::disk('s3')->url($path);
            TicketingImage::create([
                'ticketing_id' => $ticket->id,
                'url' => $url,
            ]);
        }

        return response()->json(['message' => 'Created successfully!']);
    }

    /**
     * Display the specified resource.
     */
    public function show(Ticketing $ticketing)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ticketing $ticketing)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ticketing $ticketing)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticketing $ticketing)
    {
        //
    }
}
