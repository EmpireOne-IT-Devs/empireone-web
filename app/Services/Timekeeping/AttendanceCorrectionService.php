<?php

namespace App\Services\Timekeeping;

use App\Models\Timekeeping\Attendance;
use App\Models\Timekeeping\AttendanceCorrection;
use App\Models\Timekeeping\AttendanceEmployeeSettings;
use Carbon\Carbon;

class AttendanceCorrectionService
{
    private const SCHEDULE_IN  = '08:00:00';
    private const SCHEDULE_OUT = '17:00:00';
    private const DEFAULT_BREAK_MINUTES = 60;

    /**
     * Apply the granted correction values to the employee's attendance record,
     * then recompute late/undertime minutes against the employee's schedule.
     */
    public function applyToAttendance(AttendanceCorrection $correction): void
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
