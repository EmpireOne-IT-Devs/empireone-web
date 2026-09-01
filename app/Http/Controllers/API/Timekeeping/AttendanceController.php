<?php

namespace App\Http\Controllers\API\Timekeeping;

use App\Http\Controllers\Controller;
use App\Models\Timekeeping\Attendance;
use App\Models\Timekeeping\AttendanceEmployeeSettings;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    private const SCHEDULE_IN  = '08:00:00';
    private const SCHEDULE_OUT = '17:00:00';

    /**
     * Return the attendance record and the employee's schedule for the given date (defaults to today).
     */
    public function today(Request $request)
    {
        $date = $request->filled('date') ? $request->date : Carbon::today()->toDateString();

        $attendance = Attendance::where('user_id', Auth::id())
            ->where('date', $date)
            ->first();

        return response()->json([
            'attendance' => $attendance,
            'schedule' => $this->getScheduleForDate($date),
        ], 200);
    }

    /**
     * Resolve the authenticated user's configured time in/time out for the
     * day-of-week of the given date, falling back to the default schedule
     * when no employee setting exists for that day.
     */
    private function getScheduleForDate(string $date): array
    {
        $day = Carbon::parse($date)->format('l');

        $setting = AttendanceEmployeeSettings::forEmployeeAndDay(Auth::id(), $day);

        return [
            'day' => $day,
            'time_in' => $setting?->time_in ?? self::SCHEDULE_IN,
            'time_out' => $setting?->time_out ?? self::SCHEDULE_OUT,
            'is_day_off' => (bool) ($setting?->is_day_off ?? false),
        ];
    }

    /**
     * Return paginated attendance records for the authenticated user.
     */
    public function logs(Request $request)
    {
        $logs = Attendance::where('user_id', Auth::id())
            ->orderBy('date', 'desc')
            ->paginate(20);

        return response()->json($logs, 200);
    }

    /**
     * Record clock-in for today.
     */
    public function clock_in(Request $request)
    {
        $date = $this->getAttendanceDate($request);
        $schedule = $this->getScheduleForDate($date);

        $attendance = Attendance::firstOrCreate(
            [
                'user_id' => Auth::id(),
                'date' => $date,
            ]
        );

        if ($attendance->clock_in) {
            return response()->json([
                'message' => 'Already clocked in for this date.'
            ], 422);
        }

        $clockIn = Carbon::now();

        $clockInTime = Carbon::createFromFormat(
            'H:i:s',
            $clockIn->format('H:i:s')
        );

        $scheduleTime = Carbon::createFromFormat(
            'H:i:s',
            $schedule['time_in']
        );

        $lateMinutes = max(
            0,
            $scheduleTime->diffInMinutes($clockInTime, false)
        );
        $attendance->update([
            'clock_in' => $clockIn->format('H:i:s'),
            'status' => 'clocked_in',
            'late_minutes' => $lateMinutes,
        ]);

        return response()->json($attendance->fresh(), 200);
    }

    /**
     * Record break start.
     */
    public function break_start(Request $request)
    {
        $attendance = $this->getAttendanceRecord($request);

        if (!$attendance) {
            return response()->json([
                'message' => 'Please clock in first.'
            ], 422);
        }

        if ($attendance->break_start) {
            return response()->json([
                'message' => 'Break already started.'
            ], 422);
        }

        $attendance->update([
            'break_start' => now()->format('H:i:s'),
            'status' => 'on_break',
        ]);

        return response()->json($attendance->fresh());
    }

    /**
     * Record break end.
     */
    public function break_end(Request $request)
    {
        $attendance = $this->getAttendanceRecord($request);

        if (!$attendance) {
            return response()->json([
                'message' => 'Attendance not found.'
            ], 404);
        }

        if (!$attendance->break_start) {
            return response()->json([
                'message' => 'Break has not started.'
            ], 422);
        }

        if ($attendance->break_end) {
            return response()->json([
                'message' => 'Break already ended.'
            ], 422);
        }

        $attendance->update([
            'break_end' => now()->format('H:i:s'),
            'status' => 'clocked_in',
        ]);

        return response()->json($attendance->fresh());
    }
    /**
     * Record clock-out for today.
     */
    public function clock_out(Request $request)
    {
        $attendance = $this->getAttendanceRecord($request);

        if (!$attendance) {
            return response()->json([
                'message' => 'Attendance not found.'
            ], 404);
        }

        if ($attendance->clock_out) {
            return response()->json([
                'message' => 'Already clocked out.'
            ], 422);
        }

        $schedule = $this->getScheduleForDate($attendance->date);

        $clockOut = Carbon::now();

        $clockOutTime = Carbon::createFromFormat(
            'H:i:s',
            $clockOut->format('H:i:s')
        );

        $scheduleOutTime = Carbon::createFromFormat(
            'H:i:s',
            $schedule['time_out']
        );

        $undertimeMinutes = max(
            0,
            $clockOutTime->diffInMinutes($scheduleOutTime, false)
        );

        $attendance->update([
            'clock_out' => $clockOutTime->format('H:i:s'),
            'status' => 'clocked_out',
            'undertime_minutes' => $undertimeMinutes,
        ]);

        return response()->json($attendance->fresh());
    }

    private function getAttendanceRecord(Request $request): ?Attendance
    {
        $date = $this->getAttendanceDate($request);

        return Attendance::where('user_id', Auth::id())
            ->where('date', $date)
            ->first();
    }

    private function getAttendanceDate(Request $request): string
    {
        return $request->filled('date')
            ? Carbon::parse($request->date)->toDateString()
            : Carbon::today()->toDateString();
    }
}
