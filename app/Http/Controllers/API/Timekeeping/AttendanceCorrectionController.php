<?php

namespace App\Http\Controllers\API\Timekeeping;

use App\Http\Controllers\Controller;
use App\Models\Timekeeping\AttendanceCorrection;
use App\Models\User;
use App\Services\Timekeeping\AttendanceCorrectionService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class AttendanceCorrectionController extends Controller
{
    public function __construct(private AttendanceCorrectionService $corrections)
    {
    }

    /**
     * List the authenticated user's correction requests for the given attendance date.
     */
    public function index(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
        ]);

        $corrections = AttendanceCorrection::with(['endorser', 'granter', 'decliner'])
            ->where('user_id', Auth::id())
            ->where('date', $request->date)
            ->orderByDesc('id')
            ->get();

        return response()->json(['data' => $corrections], 200);
    }

    /**
     * Submit a new attendance correction request for the authenticated user.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'reason' => 'nullable|string',
            'time_in_correction' => 'nullable|date',
            'time_out_correction' => 'nullable|date',
            'clock_in_correction' => 'nullable|date',
            'clock_out_correction' => 'nullable|date',
            'break_start_correction' => 'nullable|date',
            'break_end_correction' => 'nullable|date',
            'break1_start' => 'nullable|date',
            'break1_end' => 'nullable|date|after_or_equal:break1_start',
            'break2_start' => 'nullable|date',
            'break2_end' => 'nullable|date|after_or_equal:break2_start',
            'break3_start' => 'nullable|date',
            'break3_end' => 'nullable|date|after_or_equal:break3_start',
            'time_in_2_correction' => 'nullable|date',
            'time_out_2_correction' => 'nullable|date',
            'clock_in_2_correction' => 'nullable|date',
            'clock_out_2_correction' => 'nullable|date',
            'shift2_break1_start' => 'nullable|date',
            'shift2_break1_end' => 'nullable|date|after_or_equal:shift2_break1_start',
            'shift2_break2_start' => 'nullable|date',
            'shift2_break2_end' => 'nullable|date|after_or_equal:shift2_break2_start',
            'shift2_break3_start' => 'nullable|date',
            'shift2_break3_end' => 'nullable|date|after_or_equal:shift2_break3_start',
        ]);

        $correction = AttendanceCorrection::create([
            ...$validated,
            'user_id' => Auth::id(),
            'status' => 'pending',
        ]);

        return response()->json($correction->fresh(), 201);
    }

    /**
     * Supervisor/leader endorsement — required before HR/Admin can grant.
     */
    public function endorse(AttendanceCorrection $attendanceCorrection)
    {
        $this->authorizeLeaderStage($attendanceCorrection);

        if ($attendanceCorrection->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending requests can be endorsed.',
            ], 422);
        }

        $attendanceCorrection->update([
            'status' => 'endorsed',
            'endorsed_by' => Auth::id(),
            'endorsed_at' => Carbon::now(),
        ]);

        return response()->json($attendanceCorrection->fresh(['endorser', 'granter', 'decliner']), 200);
    }

    /**
     * Final grant by HR/Admin, only allowed once endorsed by a supervisor.
     * Applies the corrected values to the employee's attendance record and
     * recomputes late/undertime minutes against the employee's schedule.
     */
    public function grant(AttendanceCorrection $attendanceCorrection)
    {
        if ($attendanceCorrection->status !== 'endorsed') {
            return response()->json([
                'message' => 'Only endorsed requests can be granted.',
            ], 422);
        }

        $attendanceCorrection->update([
            'status' => 'granted',
            'granted_by' => Auth::id(),
            'granted_at' => Carbon::now(),
        ]);

        $this->corrections->applyToAttendance($attendanceCorrection);

        return response()->json($attendanceCorrection->fresh(['endorser', 'granter', 'decliner']), 200);
    }

    /**
     * Decline a request at either the supervisor or HR/Admin stage.
     */
    public function decline(Request $request, AttendanceCorrection $attendanceCorrection)
    {
        $validated = $request->validate([
            'note' => 'required|string',
        ]);

        if ($attendanceCorrection->status === 'granted') {
            return response()->json([
                'message' => 'A granted request can no longer be declined.',
            ], 422);
        }

        if ($attendanceCorrection->status === 'pending') {
            $this->authorizeLeaderStage($attendanceCorrection);
        }

        $isAdminStage = $attendanceCorrection->status === 'endorsed';

        $attendanceCorrection->update([
            'status' => 'declined',
            'declined_by' => Auth::id(),
            'declined_at' => Carbon::now(),
            'supervisor_note' => $isAdminStage ? $attendanceCorrection->supervisor_note : $validated['note'],
            'accounting_note' => $isAdminStage ? $validated['note'] : $attendanceCorrection->accounting_note,
        ]);

        return response()->json($attendanceCorrection->fresh(['endorser', 'granter', 'decliner']), 200);
    }

    // The leader stage belongs to the owner's leader; admins keep full access.
    private function authorizeLeaderStage(AttendanceCorrection $attendanceCorrection): void
    {
        if (Auth::user()->role !== User::ROLE_ADMIN) {
            Gate::authorize('review', $attendanceCorrection);
        }
    }
}
