<?php

namespace App\Services\Timekeeping;

use App\Http\Controllers\API\Timekeeping\AttendanceController;
use App\Models\Account\AccountEmployee;
use App\Models\Timekeeping\Attendance;
use App\Models\Timekeeping\OvertimeRequest;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator as PaginatorContract;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class TimeSheetService
{
    private const EXPORT_MAX_DAYS = 92;

    private const OVERTIME_KEYS = [
        'regular_overtime_mins',
        'dayoff_overtime_mins',
        'dayoff_overtime_beyond_8hrs_mins',
        'dayoff_overtime_regular_holiday_mins',
        'dayoff_overtime_special_holiday_mins',
        'regular_holiday_overtime_mins',
        'special_holiday_overtime_mins',
    ];

    private const ATTENDED_STATUSES = ['Present', 'Late', 'Undertime', 'Clocked In', 'On Break'];

    public function __construct(private AttendanceController $attendance)
    {
    }

    /**
     * Paginated time sheet rows plus a summary over the whole filtered set.
     *
     * @return array{0: PaginatorContract, 1: array}
     */
    public function paginate(array $filters): array
    {
        $start = isset($filters['start_date'])
            ? Carbon::parse($filters['start_date'])
            : Carbon::today()->subDays(19);
        $end = isset($filters['end_date']) ? Carbon::parse($filters['end_date']) : null;
        $status = $filters['status'] ?? null;
        $perPage = (int) ($filters['per_page'] ?? 20);
        $page = (int) ($filters['page'] ?? 1);

        return !empty($filters['employee_id'])
            ? $this->forEmployee($filters['employee_id'], $start, $end, $status, $perPage, $page)
            : $this->forAllEmployees($start, $end, $status, $perPage, $page);
    }

    private function forEmployee(string $employeeId, Carbon $start, ?Carbon $end, ?string $status, int $perPage, int $page): array
    {
        $rows = $this->employeeRows($employeeId, $start, $end, $status);

        $summary = [
            'working_days' => $rows->filter(fn($row) => !$row['is_day_off'] && $row['date'] <= Carbon::today()->toDateString())->count(),
            'present' => $rows->filter(fn($row) => in_array($row['status'], self::ATTENDED_STATUSES, true))->count(),
            'late' => $rows->filter(fn($row) => $row['late_minutes'] > 0)->count(),
            'overtime_hours' => round($rows->sum('overtime_minutes') / 60, 1),
        ];

        $paginator = new LengthAwarePaginator(
            $rows->forPage($page, $perPage)->values(),
            $rows->count(),
            $perPage,
            $page,
            ['path' => request()->url()],
        );

        return [$paginator, $summary];
    }

    private function forAllEmployees(Carbon $start, ?Carbon $end, ?string $status, int $perPage, int $page): array
    {
        $query = $this->allEmployeesQuery($start, $end, $status);

        $paginator = (clone $query)
            ->with('user.account_employee.personal_information')
            ->orderByDesc('date')
            ->orderBy('user_id')
            ->paginate($perPage, ['*'], 'page', $page);

        $summaryRecords = (clone $query)->get(['user_id', 'date', 'status', 'late_minutes', 'undertime_minutes']);
        $overtime = $this->overtimeByUserAndDate($summaryRecords->pluck('user_id')->unique(), $start, $end);

        $paginator->through(function (Attendance $record) use ($overtime) {
            $employee = $record->user?->account_employee;
            $key = $record->user_id . '|' . Carbon::parse($record->date)->toDateString();

            return $this->row(
                $record,
                $employee?->employee_id,
                $employee ? $this->employeeName($employee) : null,
                null,
                (int) ($overtime[$key] ?? 0),
            );
        });

        $overtimeMinutes = $summaryRecords->sum(
            fn($record) => (int) ($overtime[$record->user_id . '|' . Carbon::parse($record->date)->toDateString()] ?? 0)
        );

        $summary = [
            'working_days' => $summaryRecords->count(),
            'present' => $summaryRecords->count(),
            'late' => $summaryRecords->where('late_minutes', '>', 0)->count(),
            'overtime_hours' => round($overtimeMinutes / 60, 1),
        ];

        return [$paginator, $summary];
    }

    /**
     * Every filtered row (unpaginated) for CSV export, streamed lazily for all-employees mode.
     */
    public function export(array $filters): iterable
    {
        $start = isset($filters['start_date'])
            ? Carbon::parse($filters['start_date'])
            : Carbon::today()->subDays(19);
        $end = isset($filters['end_date']) ? Carbon::parse($filters['end_date']) : null;
        $status = $filters['status'] ?? null;

        if (!empty($filters['employee_id'])) {
            return $this->employeeRows($filters['employee_id'], $start, $end, $status);
        }

        if ($start->diffInDays($end ?? Carbon::today()) > self::EXPORT_MAX_DAYS) {
            throw ValidationException::withMessages([
                'end_date' => 'Select a date range of ' . self::EXPORT_MAX_DAYS . ' days or less to export all employees.',
            ]);
        }

        return $this->allEmployeeRows($start, $end, $status);
    }

    private function allEmployeeRows(Carbon $start, ?Carbon $end, ?string $status): \Generator
    {
        $query = $this->allEmployeesQuery($start, $end, $status);
        $overtime = $this->overtimeByUserAndDate((clone $query)->distinct()->pluck('user_id'), $start, $end);

        $records = $query
            ->with('user.account_employee.personal_information')
            ->orderByDesc('date')
            ->orderBy('user_id')
            ->orderBy('id')
            ->lazy(500);

        foreach ($records as $record) {
            $employee = $record->user?->account_employee;
            $key = $record->user_id . '|' . Carbon::parse($record->date)->toDateString();

            yield $this->row(
                $record,
                $employee?->employee_id,
                $employee ? $this->employeeName($employee) : null,
                null,
                (int) ($overtime[$key] ?? 0),
            );
        }
    }

    private function employeeRows(string $employeeId, Carbon $start, ?Carbon $end, ?string $status): Collection
    {
        $employee = AccountEmployee::with('personal_information')
            ->where('employee_id', $employeeId)
            ->firstOrFail();

        $name = $this->employeeName($employee);

        return collect($this->attendance->buildLogRecords($employee->user_id, $start, $end))
            ->map(fn($record) => $this->row($record, $employee->employee_id, $name, data_get($record, 'breaktime_minutes')))
            ->when($status, fn(Collection $rows) => $rows->filter(fn($row) => $this->matchesStatus($row, $status)))
            ->values();
    }

    private function allEmployeesQuery(Carbon $start, ?Carbon $end, ?string $status)
    {
        $query = Attendance::query()
            ->where('date', '>=', $start->toDateString())
            ->when($end, fn($q) => $q->where('date', '<=', $end->toDateString()));

        $this->applyStatusFilter($query, $status);

        return $query;
    }

    private function applyStatusFilter($query, ?string $status): void
    {
        match ($status) {
            'Present' => $query->where('status', 'clocked_out')->where('late_minutes', '<=', 0)->where('undertime_minutes', '<=', 0),
            'Late' => $query->where('status', 'clocked_out')->where('late_minutes', '>', 0),
            'Undertime' => $query->where('status', 'clocked_out')->where('late_minutes', '<=', 0)->where('undertime_minutes', '>', 0),
            'Clocked In' => $query->where('status', 'clocked_in'),
            'On Break' => $query->where('status', 'on_break'),
            'Holiday' => $query->where(fn($q) => $q->where('is_regular_holiday', true)->orWhere('is_special_holiday', true)),
            // Absent / Day Off / On Leave have no stored attendance record.
            'Absent', 'Day Off', 'On Leave' => $query->whereRaw('1 = 0'),
            default => null,
        };
    }

    private function matchesStatus(array $row, string $status): bool
    {
        return $status === 'Holiday' ? $row['is_holiday'] : $row['status'] === $status;
    }

    /**
     * Approved-or-pending overtime minutes keyed by "user_id|Y-m-d".
     */
    private function overtimeByUserAndDate(Collection $userIds, Carbon $start, ?Carbon $end): Collection
    {
        if ($userIds->isEmpty()) {
            return collect();
        }

        return OvertimeRequest::whereIn('user_id', $userIds)
            ->where('date', '>=', $start->toDateString())
            ->when($end, fn($q) => $q->where('date', '<=', $end->toDateString()))
            ->where('status', '!=', 'declined')
            ->get(['user_id', 'date', 'overtime_minutes'])
            ->groupBy(fn($r) => $r->user_id . '|' . Carbon::parse($r->date)->toDateString())
            ->map(fn($group) => (int) $group->sum('overtime_minutes'));
    }

    /**
     * Normalize an attendance model or placeholder array into a table row.
     */
    private function row($record, ?string $employeeId, ?string $employeeName, $breaktimeMinutes, ?int $overtimeMinutes = null): array
    {
        $clockIn = data_get($record, 'clock_in_at');
        $clockOut = data_get($record, 'clock_out_at');
        $breakStart = data_get($record, 'break_start_at');
        $breakEnd = data_get($record, 'break_end_at');

        $breakMinutes = $breaktimeMinutes ?? ($breakStart && $breakEnd ? max(0, $breakStart->diffInMinutes($breakEnd, false)) : 0);
        $workedMinutes = $clockIn && $clockOut
            ? max(0, (int) $clockIn->diffInMinutes($clockOut, false) - (int) $breakMinutes)
            : null;

        $overtimeMinutes ??= (int) collect(self::OVERTIME_KEYS)->sum(fn($key) => (int) data_get($record, $key, 0));

        $format = fn($value) => $value?->format('h:i A');

        return [
            'employee_id' => $employeeId,
            'employee_name' => $employeeName,
            'date' => Carbon::parse(data_get($record, 'date'))->toDateString(),
            'clock_in' => $format($clockIn),
            'break_start' => $format($breakStart),
            'break_end' => $format($breakEnd),
            'clock_out' => $format($clockOut),
            'worked_hours' => $workedMinutes === null ? null : round($workedMinutes / 60, 2),
            'late_minutes' => (int) data_get($record, 'late_minutes', 0),
            'undertime_minutes' => (int) data_get($record, 'undertime_minutes', 0),
            'overtime_minutes' => $overtimeMinutes,
            'status' => data_get($record, 'display_status'),
            'is_day_off' => (bool) data_get($record, 'is_day_off', false),
            'is_holiday' => (bool) (data_get($record, 'is_regular_holiday') || data_get($record, 'is_special_holiday')),
        ];
    }

    private function employeeName(AccountEmployee $employee): string
    {
        $info = $employee->personal_information;

        return trim(($info?->last_name ?? '') . ', ' . ($info?->first_name ?? ''), ' ,');
    }
}
