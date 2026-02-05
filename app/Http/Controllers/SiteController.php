<?php

namespace App\Http\Controllers;

use App\Models\Site;
use Illuminate\Http\Request;

class SiteController extends Controller
{
    public function index()
    {
        $sites = Site::orderBy('created_at', 'desc')->get();

        return response()->json([
            'message' => 'Sites retrieved successfully!',
            'data' => $sites
        ], 200);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'status' => 'nullable|string|max:255',
        ]);

        // Set default status if not provided
        if (!isset($validatedData['status'])) {
            $validatedData['status'] = 'Active';
        }

        $site = Site::create($validatedData);

        return response()->json([
            'message' => 'Site created successfully!',
            'site' => $site
        ], 201);
    }
}
