<?php

namespace App\Http\Controllers\API\Timekeeping;

use App\Http\Controllers\Controller;
use App\Models\Timekeeping\Attendance;
use App\Models\Timekeeping\AttendanceCorrection;
use App\Models\Timekeeping\AttendanceEmployeeSettings;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AttendanceCorrectionController extends Controller
{
    private const SCHEDULE_IN  = '08:00:00';
    private const SCHEDULE_OUT = '17:00:00';
    private const DEFAULT_BREAK_MINUTES = 60;

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

        $this->applyToAttendance($attendanceCorrection);

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

    /**
     * Apply the granted correction values to the employee's attendance record,
     * then recompute late/undertime minutes against the employee's schedule.
     */
    private function applyToAttendance(AttendanceCorrection $correction): void
    {
        $attendance = Attendance::firstOrCreate([
            'user_id' => $correction->user_id,
            'date' => $correction->date->toDateString(),
        ]);

        $update = [];

        // The Attendance table only stores clock in/out, so a Time In/Out
        // correction is applied when no explicit Clock In/Out correction exists.
        $clockIn = $correction->clock_in_correction ?? $correction->time_in_correction;
        $clockOut = $correction->clock_out_correction ?? $correction->time_out_correction;

        if ($clockIn) {
            $update['clock_in_date'] = Carbon::parse($clockIn)->toDateString();
            $update['clock_in_time'] = Carbon::parse($clockIn)->format('H:i:s');
        }

        if ($clockOut) {
            $update['clock_out_date'] = Carbon::parse($clockOut)->toDateString();
            $update['clock_out_time'] = Carbon::parse($clockOut)->format('H:i:s');
        }

        if ($correction->break_start_correction) {
            $update['break_start_date'] = Carbon::parse($correction->break_start_correction)->toDateString();
            $update['break_start_time'] = Carbon::parse($correction->break_start_correction)->format('H:i:s');
        }

        if ($correction->break_end_correction) {
            $update['break_end_date'] = Carbon::parse($correction->break_end_correction)->toDateString();
            $update['break_end_time'] = Carbon::parse($correction->break_end_correction)->format('H:i:s');
        }

        if (empty($update)) {
            return;
        }

        $attendance->update($update);
        $attendance = $attendance->fresh();

        $schedule = $this->getScheduleForDate(
            $correction->user_id,
            $correction->date->toDateString()
        );

        // Compare only the time-of-day portion against the schedule, since a
        // shift may end after midnight on the following calendar day.
        $recompute = [];

        if ($attendance->clock_in_time) {
            $clockInTime = Carbon::createFromFormat('H:i:s', $attendance->clock_in_time);
            $scheduleIn = Carbon::createFromFormat('H:i:s', $schedule['time_in']);
            $recompute['late_minutes'] = max(0, $scheduleIn->diffInMinutes($clockInTime, false));
        }

        if ($attendance->clock_out_time) {
            $clockOutTime = Carbon::createFromFormat('H:i:s', $attendance->clock_out_time);
            $scheduleOut = Carbon::createFromFormat('H:i:s', $schedule['time_out']);
            $recompute['undertime_minutes'] = max(0, $clockOutTime->diffInMinutes($scheduleOut, false));
            $recompute['status'] = 'clocked_out';

            if ($attendance->is_regular_holiday || $attendance->is_special_holiday) {
                $workedMinutes = $this->getWorkedMinutes($attendance);

                if ($attendance->is_regular_holiday) {
                    $recompute['regular_holiday_mins'] = $workedMinutes;
                }

                if ($attendance->is_special_holiday) {
                    $recompute['special_holiday_mins'] = $workedMinutes;
                }
            }
        } elseif ($attendance->clock_in_time) {
            $recompute['status'] = 'clocked_in';
        }

        if (!empty($recompute)) {
            $attendance->update($recompute);
        }
    }

    /**
     * Total minutes actually worked between clock-in and clock-out, minus any
     * break taken. Uses full datetimes so overnight shifts compute correctly.
     */
    private function getWorkedMinutes(Attendance $attendance): int
    {
        if (
            !$attendance->clock_in_date || !$attendance->clock_in_time ||
            !$attendance->clock_out_date || !$attendance->clock_out_time
        ) {
            return 0;
        }

        $clockIn = Carbon::parse($attendance->clock_in_date->toDateString() . ' ' . $attendance->clock_in_time);
        $clockOut = Carbon::parse($attendance->clock_out_date->toDateString() . ' ' . $attendance->clock_out_time);

        $totalMinutes = max(0, $clockIn->diffInMinutes($clockOut, false));

        if (
            $attendance->break_start_date && $attendance->break_start_time &&
            $attendance->break_end_date && $attendance->break_end_time
        ) {
            $breakStart = Carbon::parse($attendance->break_start_date->toDateString() . ' ' . $attendance->break_start_time);
            $breakEnd = Carbon::parse($attendance->break_end_date->toDateString() . ' ' . $attendance->break_end_time);

            $totalMinutes -= max(0, $breakStart->diffInMinutes($breakEnd, false));
        }

        return max(0, $totalMinutes);
    }

    /**
     * Resolve the given employee's configured time in/time out for the
     * day-of-week of the given date, falling back to the default schedule
     * when no employee setting exists for that day.
     */
    private function getScheduleForDate(int $userId, string $date): array
    {
        $day = Carbon::parse($date)->format('l');

        $setting = AttendanceEmployeeSettings::forEmployeeAndDay($userId, $day);

        return [
            'time_in' => $setting?->time_in ?? self::SCHEDULE_IN,
            'time_out' => $setting?->time_out ?? self::SCHEDULE_OUT,
            'is_day_off' => (bool) ($setting?->is_day_off ?? false),
            'break_minutes' => (int) ($setting?->break_minutes ?? self::DEFAULT_BREAK_MINUTES),
        ];
    }
}
