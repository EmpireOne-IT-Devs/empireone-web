<?php

namespace App\Http\Controllers\API\Timekeeping;

use App\Http\Controllers\Controller;
use App\Models\Timekeeping\Attendance;
use App\Models\Timekeeping\AttendanceCorrection;
use App\Models\Timekeeping\AttendanceEmployeeSettings;
use App\Models\Timekeeping\Holiday;
use App\Models\Timekeeping\LeaveRequest;
use App\Models\Timekeeping\OvertimeRequest;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    private const SCHEDULE_IN  = '08:00:00';
    private const SCHEDULE_OUT = '17:00:00';
    private const DEFAULT_BREAK_MINUTES = 60;
    private const DAYOFF_REGULAR_MINUTES = 480;

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
            'break_minutes' => (int) ($setting?->break_minutes ?? self::DEFAULT_BREAK_MINUTES),
        ];
    }

    /**
     * Flatten a filed correction request into the fields the logs table shows.
     * Datetimes are plain app-timezone strings so the client doesn't re-shift them.
     */
    private function correctionSummary(?AttendanceCorrection $correction): array
    {
        $format = fn($value) => $value?->format('Y-m-d H:i:s');

        return [
            'clock_in_correction' => $format($correction?->clock_in_correction),
            'clock_out_correction' => $format($correction?->clock_out_correction),
            'correction_status' => $correction?->status,
            'correction_endorsed_at' => $format($correction?->endorsed_at),
            'correction_granted_at' => $format($correction?->granted_at),
        ];
    }

    /**
     * Time in/out for one specific date: a filed, non-declined correction
     * overrides the weekday schedule for that date only.
     */
    private function resolveTimes(array $schedule, ?AttendanceCorrection $correction): array
    {
        $active = $correction && $correction->status !== 'declined';

        return [
            'time_in' => ($active ? $correction->time_in_correction?->format('H:i:s') : null) ?? $schedule['time_in'],
            'time_out' => ($active ? $correction->time_out_correction?->format('H:i:s') : null) ?? $schedule['time_out'],
        ];
    }

    /**
     * Clock in/out for one date: a filed, non-declined correction wins over the
     * stored punch. A Time In/Out correction stands in when no explicit Clock
     * In/Out correction exists, mirroring how a granted correction is applied.
     */
    private function effectivePunch(?AttendanceCorrection $correction, string $clockColumn, string $timeColumn): ?Carbon
    {
        if (!$correction || $correction->status === 'declined') {
            return null;
        }

        return $correction->{$clockColumn} ?? $correction->{$timeColumn};
    }

    /**
     * Overtime, holiday and night-differential minutes for one date, driven by
     * the filed overtime requests and the effective clock in/out.
     */
    private function derivedFields(
        array $schedule,
        bool $isRegularHoliday,
        bool $isSpecialHoliday,
        Collection $overtimeRequests,
        ?Carbon $clockIn,
        ?Carbon $clockOut,
        int $breaktimeMinutes,
    ): array {
        $isDayOff = $schedule['is_day_off'];
        $overtimeMinutes = (int) $overtimeRequests->sum('overtime_minutes');

        $fields = [
            'regular_overtime_mins' => 0,
            'dayoff_overtime_mins' => 0,
            'dayoff_overtime_beyond_8hrs_mins' => 0,
            'dayoff_overtime_regular_holiday_mins' => 0,
            'dayoff_overtime_special_holiday_mins' => 0,
            'regular_holiday_overtime_mins' => 0,
            'special_holiday_overtime_mins' => 0,
            'night_diff_mins' => 0,
            'regular_holiday_night_diff_mins' => 0,
            'special_holiday_night_diff_mins' => 0,
            'overtime_night_diff_mins' => 0,
            'dayoff_overtime_night_diff_mins' => 0,
        ];

        if ($isDayOff && $isRegularHoliday) {
            $fields['dayoff_overtime_regular_holiday_mins'] = $overtimeMinutes;
        } elseif ($isDayOff && $isSpecialHoliday) {
            $fields['dayoff_overtime_special_holiday_mins'] = $overtimeMinutes;
        } elseif ($isDayOff) {
            $fields['dayoff_overtime_mins'] = min($overtimeMinutes, self::DAYOFF_REGULAR_MINUTES);
            $fields['dayoff_overtime_beyond_8hrs_mins'] = max(0, $overtimeMinutes - self::DAYOFF_REGULAR_MINUTES);
        } elseif ($isRegularHoliday) {
            $fields['regular_holiday_overtime_mins'] = $overtimeMinutes;
        } elseif ($isSpecialHoliday) {
            $fields['special_holiday_overtime_mins'] = $overtimeMinutes;
        } else {
            $fields['regular_overtime_mins'] = $overtimeMinutes;
        }

        $overtimeNightDiff = $overtimeRequests->sum(fn($r) => $this->nightDiffMinutes($r->start_at, $r->end_at));
        $fields[$isDayOff ? 'dayoff_overtime_night_diff_mins' : 'overtime_night_diff_mins'] = $overtimeNightDiff;

        if (!$clockIn || !$clockOut || $clockOut->lessThanOrEqualTo($clockIn)) {
            return $fields;
        }

        // Night diff from the overtime window is reported separately, so exclude it from the regular figure.
        $overtimeNightDiffWorked = $overtimeRequests->sum(function ($r) use ($clockIn, $clockOut) {
            $start = $r->start_at->greaterThan($clockIn) ? $r->start_at : $clockIn;
            $end = $r->end_at->lessThan($clockOut) ? $r->end_at : $clockOut;

            return $end->greaterThan($start) ? $this->nightDiffMinutes($start, $end) : 0;
        });
        $nightDiff = max(0, $this->nightDiffMinutes($clockIn, $clockOut) - $overtimeNightDiffWorked);

        if ($isRegularHoliday) {
            $fields['regular_holiday_night_diff_mins'] = $nightDiff;
        } elseif ($isSpecialHoliday) {
            $fields['special_holiday_night_diff_mins'] = $nightDiff;
        } else {
            $fields['night_diff_mins'] = $nightDiff;
        }

        if ($isRegularHoliday || $isSpecialHoliday) {
            $workedMinutes = max(0, intdiv($clockOut->timestamp - $clockIn->timestamp, 60) - $breaktimeMinutes);
            $fields[$isRegularHoliday ? 'regular_holiday_mins' : 'special_holiday_mins'] = $workedMinutes;
        }

        return $fields;
    }

    /**
     * Minutes of the given period that fall inside the 10:00 PM - 6:00 AM night differential window.
     */
    private function nightDiffMinutes(Carbon $start, Carbon $end): int
    {
        $total = 0;

        for ($day = $start->copy()->startOfDay()->subDay(); $day->lte($end); $day->addDay()) {
            $windowStart = $day->copy()->setTime(22, 0);
            $windowEnd = $day->copy()->addDay()->setTime(6, 0);

            $from = $start->greaterThan($windowStart) ? $start : $windowStart;
            $to = $end->lessThan($windowEnd) ? $end : $windowEnd;

            if ($to->greaterThan($from)) {
                $total += intdiv($to->timestamp - $from->timestamp, 60);
            }
        }

        return $total;
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

        $corrections = AttendanceCorrection::where('user_id', Auth::id())
            ->where('date', '>=', $startDate->toDateString())
            ->where('date', '<=', $endDate->toDateString())
            ->orderBy('id')
            ->get()
            ->keyBy(fn($c) => $c->date->toDateString());

        // Declined filings are ignored; anything else reflects on the logs as soon as it is filed.
        $overtimeRequests = OvertimeRequest::where('user_id', Auth::id())
            ->where('date', '>=', $startDate->toDateString())
            ->where('date', '<=', $endDate->toDateString())
            ->where('status', '!=', 'declined')
            ->get()
            ->groupBy(fn($r) => Carbon::parse($r->date)->toDateString());

        $leaveRequests = LeaveRequest::where('user_id', Auth::id())
            ->where('date', '>=', $startDate->toDateString())
            ->where('date', '<=', $endDate->toDateString())
            ->where('status', '!=', 'declined')
            ->orderBy('id')
            ->get()
            ->keyBy(fn($l) => $l->date->toDateString());

        for ($date = $endDate->copy(); $date->gte($startDate); $date->subDay()) {
            $dateString = $date->toDateString();
            $schedule = $this->getScheduleForDate($dateString);
            $breaktimeLimit = $schedule['is_day_off'] ? 0 : $schedule['break_minutes'];
            $requiredMinutes = $this->getRequiredMinutes($schedule);
            $correctionModel = $corrections->get($dateString);
            $correction = $this->correctionSummary($correctionModel);
            $times = $this->resolveTimes($schedule, $correctionModel);
            $holiday = $this->getHolidayForDate($dateString);
            $leave = $leaveRequests->get($dateString);
            $isVoluntaryTimeOff = $leave?->leave_type === LeaveRequest::VOLUNTARY_TIME_OFF;
            $leaveFields = [
                'is_on_leave' => $leave !== null && !$isVoluntaryTimeOff,
                'is_voluntary_time_off' => $isVoluntaryTimeOff,
                'leave_type' => $leave?->leave_type,
            ];

            if ($logs->has($dateString)) {
                $record = $logs->get($dateString);
                $breaktimeMinutes = $this->getBreaktimeMinutes($record);
                $isRegularHoliday = $record->is_regular_holiday || $holiday?->type === 'Regular';
                $isSpecialHoliday = !$isRegularHoliday && ($record->is_special_holiday || $holiday?->type === 'Special');
                $derived = $this->derivedFields(
                    $schedule,
                    $isRegularHoliday,
                    $isSpecialHoliday,
                    $overtimeRequests->get($dateString, collect()),
                    $this->effectivePunch($correctionModel, 'clock_in_correction', 'time_in_correction') ?? $record->clock_in_at,
                    $this->effectivePunch($correctionModel, 'clock_out_correction', 'time_out_correction') ?? $record->clock_out_at,
                    $breaktimeMinutes,
                );
                $record->is_regular_holiday = $isRegularHoliday;
                $record->is_special_holiday = $isSpecialHoliday;
                $record->holiday_name = $record->holiday_name ?? $holiday?->name;
                foreach ([...$derived, ...$leaveFields] as $key => $value) {
                    $record->{$key} = $value;
                }
                $record->breaktime_limit = $breaktimeLimit;
                $record->breaktime_minutes = $breaktimeMinutes;
                $record->overbreak_minutes = max(0, $breaktimeMinutes - $breaktimeLimit);
                $record->schedule_time_in = $schedule['time_in'];
                $record->schedule_time_out = $schedule['time_out'];
                $record->time_in = $times['time_in'];
                $record->time_out = $times['time_out'];
                $record->is_day_off = $schedule['is_day_off'];
                $record->required_minutes = $requiredMinutes;
                foreach ($correction as $key => $value) {
                    $record->{$key} = $value;
                }
                $records[] = $record;
                continue;
            }

            $isRegularHoliday = $holiday?->type === 'Regular';
            $isSpecialHoliday = $holiday?->type === 'Special';
            $derived = $this->derivedFields(
                $schedule,
                $isRegularHoliday,
                $isSpecialHoliday,
                $overtimeRequests->get($dateString, collect()),
                $this->effectivePunch($correctionModel, 'clock_in_correction', 'time_in_correction'),
                $this->effectivePunch($correctionModel, 'clock_out_correction', 'time_out_correction'),
                0,
            );
            $onLeave = $leaveFields['is_on_leave'] || $leaveFields['is_voluntary_time_off'];
            $placeholderStatus = $schedule['is_day_off'] ? 'Day Off' : ($onLeave ? 'On Leave' : 'Absent');

            $records[] = [
                ...$correction,
                ...$derived,
                ...$leaveFields,
                'user_id' => Auth::id(),
                'date' => $dateString,
                'breaktime_limit' => $breaktimeLimit,
                'breaktime_minutes' => 0,
                'overbreak_minutes' => 0,
                'schedule_time_in' => $schedule['time_in'],
                'schedule_time_out' => $schedule['time_out'],
                'time_in' => $times['time_in'],
                'time_out' => $times['time_out'],
                'is_day_off' => $schedule['is_day_off'],
                'required_minutes' => $requiredMinutes,
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
                'status' => strtolower(str_replace(' ', '_', $placeholderStatus)),
                'late_minutes' => 0,
                'undertime_minutes' => 0,
                'remarks' => null,
                'holiday_name' => $holiday?->name,
                'is_regular_holiday' => $isRegularHoliday,
                'is_special_holiday' => $isSpecialHoliday,
                'regular_holiday_mins' => $derived['regular_holiday_mins'] ?? 0,
                'special_holiday_mins' => $derived['special_holiday_mins'] ?? 0,
                'display_status' => $placeholderStatus,
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

    /**
     * Minutes actually spent on break (0 if the break hasn't ended yet).
     */
    private function getBreaktimeMinutes(Attendance $attendance): int
    {
        if (!$attendance->break_start_at || !$attendance->break_end_at) {
            return 0;
        }

        return max(0, $attendance->break_start_at->diffInMinutes($attendance->break_end_at, false));
    }

    /**
     * Scheduled shift duration (time_in to time_out, wrapping past midnight for
     * overnight shifts) minus the employee's break allowance, in minutes.
     */
    private function getRequiredMinutes(array $schedule): int
    {
        if ($schedule['is_day_off'] || !$schedule['time_in'] || !$schedule['time_out']) {
            return 0;
        }

        $start = Carbon::createFromFormat('H:i:s', $schedule['time_in']);
        $end = Carbon::createFromFormat('H:i:s', $schedule['time_out']);

        if ($end->lessThanOrEqualTo($start)) {
            $end->addDay();
        }

        return max(0, $end->diffInMinutes($start, true) - $schedule['break_minutes']);
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
