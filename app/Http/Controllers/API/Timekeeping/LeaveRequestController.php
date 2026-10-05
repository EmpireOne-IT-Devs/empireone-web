<?php

namespace App\Http\Controllers\API\Timekeeping;

use App\Http\Controllers\Controller;
use App\Models\Timekeeping\LeaveRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LeaveRequestController extends Controller
{
    /**
     * List the authenticated user's leave requests for the given attendance date.
     */
    public function index(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
        ]);

        $requests = LeaveRequest::where('user_id', Auth::id())
            ->where('date', $request->date)
            ->orderByDesc('id')
            ->get();

        return response()->json(['data' => $requests], 200);
    }

    /**
     * File a leave request (or Voluntary Time Off) for the authenticated user.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'leave_type' => 'required|string|max:255',
            'reason' => 'required|string',
        ]);

        $exists = LeaveRequest::where('user_id', Auth::id())
            ->where('date', $validated['date'])
            ->where('status', '!=', 'declined')
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'A leave request is already filed for this date.',
            ], 422);
        }

        $leaveRequest = LeaveRequest::create([
            ...$validated,
            'user_id' => Auth::id(),
            'status' => 'pending',
        ]);

        return response()->json($leaveRequest->fresh(), 201);
    }
}
