<?php

namespace App\Http\Controllers\API\Timekeeping;

use App\Http\Controllers\Controller;
use App\Models\Timekeeping\Holiday;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HolidayController extends Controller
{
    /**
     * List holidays, optionally filtered by a date range (e.g. the visible
     * calendar month) via start_date/end_date query params.
     */
    public function index(Request $request)
    {
        $query = Holiday::query()->with('creator:id,name')->orderBy('date');

        if ($request->filled('start_date')) {
            $query->whereDate('date', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('date', '<=', $request->end_date);
        }

        return response()->json($query->get(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'date' => 'required|date',
            'type' => 'required|in:Regular,Special',
            'site' => 'required|string|max:255',
        ]);

        $holiday = Holiday::create([
            ...$validated,
            'created_by' => Auth::id(),
        ]);

        return response()->json($holiday->load('creator:id,name'), 201);
    }

    public function destroy(Holiday $holiday)
    {
        $holiday->delete();

        return response()->json(['message' => 'Holiday removed.'], 200);
    }
}
