<?php

namespace App\Http\Controllers\API\Timekeeping;

use App\Http\Controllers\Controller;
use App\Models\Timekeeping\Attendance;
use App\Models\Timekeeping\AttendanceEmployeeSettings;
use App\Models\Timekeeping\Holiday;
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
     * Resolve the holiday (if any) configured for the given date that applies
     * to the authenticated user's site (or an "All" site holiday).
     */
    private function getHolidayForDate(string $date): ?Holiday
    {
        $site = Auth::user()?->account_employee?->site?->name;

        return Holiday::forDateAndSite($date, $site);
    }

    /**
     * Return attendance records for the authenticated user for every date in the
     * filtered range, defaulting to the trailing 20 days from today when no date
     * range is given. Dates without an attendance record are filled with a
     * placeholder row (Day Off / Absent based on the employee's schedule) so the
     * cutoff range always renders a row per day. The upper bound only restricts
     * results when an end_date is explicitly requested, so records logged for a
     * future/advanced date still show up by default.
     */
    public function logs(Request $request)
    {
        $startDate = $request->filled('start_date')
            ? Carbon::parse($request->start_date)
            : Carbon::today()->subDays(19);

        $requestEndDate = $request->filled('end_date')
            ? Carbon::parse($request->end_date)
            : null;

        $query = Attendance::where('user_id', Auth::id())
            ->where('date', '>=', $startDate->toDateString());

        if ($requestEndDate) {
            $query->where('date', '<=', $requestEndDate->toDateString());
        }

        $logs = $query->get()->keyBy(
            fn($log) => Carbon::parse($log->date)->toDateString()
        );

        $endDate = $requestEndDate ?? Carbon::parse(
            max(Carbon::today()->toDateString(), $logs->keys()->max() ?? Carbon::today()->toDateString())
        );

        $records = [];

        for ($date = $endDate->copy(); $date->gte($startDate); $date->subDay()) {
            $dateString = $date->toDateString();

            if ($logs->has($dateString)) {
                $records[] = $logs->get($dateString);
                continue;
            }

            $schedule = $this->getScheduleForDate($dateString);
            $holiday = $this->getHolidayForDate($dateString);

            $records[] = [
                'user_id' => Auth::id(),
                'date' => $dateString,
                'clock_in_date' => null,
                'clock_in_time' => null,
                'break_start_date' => null,
                'break_start_time' => null,
                'break_end_date' => null,
                'break_end_time' => null,
                'clock_out_date' => null,
                'clock_out_time' => null,
                'clock_in_at' => null,
                'break_start_at' => null,
                'break_end_at' => null,
                'clock_out_at' => null,
                'status' => $schedule['is_day_off'] ? 'day_off' : 'absent',
                'late_minutes' => 0,
                'undertime_minutes' => 0,
                'remarks' => null,
                'holiday_name' => $holiday?->name,
                'is_regular_holiday' => $holiday?->type === 'Regular',
                'is_special_holiday' => $holiday?->type === 'Special',
                'regular_holiday_mins' => 0,
                'special_holiday_mins' => 0,
                'display_status' => $schedule['is_day_off'] ? 'Day Off' : 'Absent',
            ];
        }

        return response()->json(['data' => $records], 200);
    }

    /**
     * Record clock-in for today.
     */
    public function clock_in(Request $request)
    {
        $date = $this->getAttendanceDate($request);
        $schedule = $this->getScheduleForDate($date);
        $holiday = $this->getHolidayForDate($date);

        $attendance = Attendance::firstOrCreate(
            [
                'user_id' => Auth::id(),
                'date' => $date,
            ],
            [
                'holiday_id' => $holiday?->id,
                'holiday_name' => $holiday?->name,
                'is_regular_holiday' => $holiday?->type === 'Regular',
                'is_special_holiday' => $holiday?->type === 'Special',
            ]
        );

        if ($attendance->clock_in_time) {
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
            'clock_in_date' => $clockIn->toDateString(),
            'clock_in_time' => $clockIn->format('H:i:s'),
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

        if ($attendance->break_start_time) {
            return response()->json([
                'message' => 'Break already started.'
            ], 422);
        }

        $breakStart = Carbon::now();

        $attendance->update([
            'break_start_date' => $breakStart->toDateString(),
            'break_start_time' => $breakStart->format('H:i:s'),
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

        if (!$attendance->break_start_time) {
            return response()->json([
                'message' => 'Break has not started.'
            ], 422);
        }

        if ($attendance->break_end_time) {
            return response()->json([
                'message' => 'Break already ended.'
            ], 422);
        }

        $breakEnd = Carbon::now();

        $attendance->update([
            'break_end_date' => $breakEnd->toDateString(),
            'break_end_time' => $breakEnd->format('H:i:s'),
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

        if ($attendance->clock_out_time) {
            return response()->json([
                'message' => 'Already clocked out.'
            ], 422);
        }

        $schedule = $this->getScheduleForDate($attendance->date);

        $clockOut = Carbon::now();

        // Compare only the time-of-day portion against the scheduled time out,
        // since the shift may end after midnight on the following calendar day.
        $clockOutTimeOfDay = Carbon::createFromFormat(
            'H:i:s',
            $clockOut->format('H:i:s')
        );

        $scheduleOutTime = Carbon::createFromFormat(
            'H:i:s',
            $schedule['time_out']
        );

        $undertimeMinutes = max(
            0,
            $clockOutTimeOfDay->diffInMinutes($scheduleOutTime, false)
        );

        $update = [
            'clock_out_date' => $clockOut->toDateString(),
            'clock_out_time' => $clockOut->format('H:i:s'),
            'status' => 'clocked_out',
            'undertime_minutes' => $undertimeMinutes,
        ];

        if ($attendance->is_regular_holiday || $attendance->is_special_holiday) {
            $workedMinutes = $this->getWorkedMinutes($attendance, $clockOut);

            if ($attendance->is_regular_holiday) {
                $update['regular_holiday_mins'] = $workedMinutes;
            }

            if ($attendance->is_special_holiday) {
                $update['special_holiday_mins'] = $workedMinutes;
            }
        }

        $attendance->update($update);

        return response()->json($attendance->fresh());
    }

    /**
     * Total minutes actually worked between clock-in and clock-out, minus any break taken.
     * Uses full datetimes (not just time-of-day) so overnight shifts are computed correctly.
     */
    private function getWorkedMinutes(Attendance $attendance, Carbon $clockOut): int
    {
        $clockIn = Carbon::parse(
            $attendance->clock_in_date . ' ' . $attendance->clock_in_time
        );

        $totalMinutes = max(
            0,
            $clockIn->diffInMinutes($clockOut, false)
        );

        if (
            $attendance->break_start_date && $attendance->break_start_time &&
            $attendance->break_end_date && $attendance->break_end_time
        ) {

            $breakStart = Carbon::parse(
                $attendance->break_start_date . ' ' . $attendance->break_start_time
            );

            $breakEnd = Carbon::parse(
                $attendance->break_end_date . ' ' . $attendance->break_end_time
            );

            $totalMinutes -= max(
                0,
                $breakStart->diffInMinutes($breakEnd, false)
            );
        }

        return max(0, $totalMinutes);
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
