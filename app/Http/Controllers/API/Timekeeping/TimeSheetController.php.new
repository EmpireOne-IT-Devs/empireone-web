<?php

namespace App\Http\Controllers\API\Timekeeping;

use App\Http\Controllers\Controller;
use App\Http\Requests\Timekeeping\TimeSheetIndexRequest;
use App\Http\Resources\Timekeeping\TimeSheetResource;
use App\Models\Timekeeping\Attendance;
use App\Services\Timekeeping\TimeSheetService;
use Illuminate\Support\Facades\Gate;

class TimeSheetController extends Controller
{
    public function __construct(private TimeSheetService $service)
    {
    }

    /**
     * Time sheet rows for one employee (or all employees) with filters and a summary.
     */
    public function index(TimeSheetIndexRequest $request)
    {
        Gate::authorize('viewAny', Attendance::class);

        [$paginator, $summary] = $this->service->paginate($request->validated());

        return TimeSheetResource::collection($paginator)->additional(['summary' => $summary]);
    }

    /**
     * Stream the filtered time sheet rows as a CSV download.
     */
    public function export(TimeSheetIndexRequest $request)
    {
        Gate::authorize('export', Attendance::class);

        $filters = $request->validated();
        $rows = $this->service->export($filters);
        $filename = sprintf('time-sheets-%s-%s.csv', $filters['employee_id'] ?? 'all', now()->format('Y-m-d'));

        return response()->streamDownload(function () use ($rows) {
            $output = fopen('php://output', 'w');

            fputcsv($output, [
                'Employee ID',
                'Name',
                'Date',
                'Time In',
                'Break Out',
                'Break In',
                'Time Out',
                'Hours',
                'Late (min)',
                'Undertime (min)',
                'Overtime (min)',
                'Status',
            ]);

            foreach ($rows as $row) {
                fputcsv($output, array_map(
                    fn($value) => $this->spreadsheetSafeValue($value),
                    [
                        $row['employee_id'],
                        $row['employee_name'],
                        $row['date'],
                        $row['clock_in'],
                        $row['break_start'],
                        $row['break_end'],
                        $row['clock_out'],
                        $row['worked_hours'],
                        $row['late_minutes'],
                        $row['undertime_minutes'],
                        $row['overtime_minutes'],
                        $row['status'],
                    ],
                ));
            }

            fclose($output);
        }, $filename, ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    // Prefix formula-like values so spreadsheet apps don't execute them.
    private function spreadsheetSafeValue(mixed $value): string
    {
        $value = (string) ($value ?? '');

        if (preg_match('/^[\s\x00-\x1F]*[=+\-@]/u', $value) === 1) {
            return "'" . $value;
        }

        return $value;
    }
}
