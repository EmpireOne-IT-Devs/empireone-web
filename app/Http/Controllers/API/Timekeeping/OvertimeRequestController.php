<?php

namespace App\Http\Controllers\API\Timekeeping;

use App\Http\Controllers\Controller;
use App\Models\Timekeeping\OvertimeRequest;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OvertimeRequestController extends Controller
{
    /**
     * List the authenticated user's overtime requests for the given attendance date.
     */
    public function index(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
        ]);

        $requests = OvertimeRequest::with(['endorser', 'approver', 'decliner'])
            ->where('user_id', Auth::id())
            ->where('date', $request->date)
            ->orderByDesc('id')
            ->get();

        return response()->json(['data' => $requests], 200);
    }

    /**
     * Submit a new overtime request for the authenticated user.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'start_at' => 'required|date',
            'end_at' => 'required|date|after:start_at',
            'remark' => 'required|string',
        ]);

        $overtimeMinutes = max(0, Carbon::parse($validated['end_at'])->diffInMinutes(Carbon::parse($validated['start_at']), true));

        $overtimeRequest = OvertimeRequest::create([
            'user_id' => Auth::id(),
            'date' => $validated['date'],
            'start_at' => $validated['start_at'],
            'end_at' => $validated['end_at'],
            'overtime_minutes' => $overtimeMinutes,
            'remark' => $validated['remark'],
            'status' => 'pending',
        ]);

        return response()->json($overtimeRequest->fresh(), 201);
    }

    /**
     * Supervisor/leader endorsement — required before accounting can approve.
     */
    public function endorse(OvertimeRequest $overtimeRequest)
    {
        if ($overtimeRequest->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending requests can be endorsed.',
            ], 422);
        }

        $overtimeRequest->update([
            'status' => 'endorsed',
            'endorsed_by' => Auth::id(),
            'endorsed_at' => Carbon::now(),
        ]);

        return response()->json($overtimeRequest->fresh(['endorser', 'approver', 'decliner']), 200);
    }

    /**
     * Final approval by accounting, only allowed once endorsed by a supervisor.
     */
    public function approve(OvertimeRequest $overtimeRequest)
    {
        if ($overtimeRequest->status !== 'endorsed') {
            return response()->json([
                'message' => 'Only endorsed requests can be approved.',
            ], 422);
        }

        $overtimeRequest->update([
            'status' => 'approved',
            'approved_by' => Auth::id(),
            'approved_at' => Carbon::now(),
        ]);

        return response()->json($overtimeRequest->fresh(['endorser', 'approver', 'decliner']), 200);
    }

    /**
     * Decline a request at either the supervisor or accounting stage.
     */
    public function decline(Request $request, OvertimeRequest $overtimeRequest)
    {
        $validated = $request->validate([
            'note' => 'required|string',
        ]);

        if ($overtimeRequest->status === 'approved') {
            return response()->json([
                'message' => 'An approved request can no longer be declined.',
            ], 422);
        }

        $isAccountingStage = $overtimeRequest->status === 'endorsed';

        $overtimeRequest->update([
            'status' => 'declined',
            'declined_by' => Auth::id(),
            'declined_at' => Carbon::now(),
            'supervisor_note' => $isAccountingStage ? $overtimeRequest->supervisor_note : $validated['note'],
            'accounting_note' => $isAccountingStage ? $validated['note'] : $overtimeRequest->accounting_note,
        ]);

        return response()->json($overtimeRequest->fresh(['endorser', 'approver', 'decliner']), 200);
    }
}
