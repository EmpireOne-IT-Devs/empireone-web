<?php

namespace App\Http\Resources\Timekeeping;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TimeSheetResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $row = $this->resource;

        return [
            'employee_id' => $row['employee_id'],
            'employee_name' => $row['employee_name'],
            'date' => $row['date'],
            'clock_in' => $row['clock_in'],
            'break_start' => $row['break_start'],
            'break_end' => $row['break_end'],
            'clock_out' => $row['clock_out'],
            'worked_hours' => $row['worked_hours'],
            'late_minutes' => $row['late_minutes'],
            'undertime_minutes' => $row['undertime_minutes'],
            'overtime_minutes' => $row['overtime_minutes'],
            'status' => $row['status'],
        ];
    }
}
