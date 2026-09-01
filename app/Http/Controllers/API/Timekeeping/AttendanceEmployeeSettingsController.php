<?php

namespace App\Http\Controllers\API\Timekeeping;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Timekeeping\AttendanceEmployeeSettings;

class AttendanceEmployeeSettingsController extends Controller
{
    /**
     * Return the weekly attendance schedule for a given employee.
     */
    public function index(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:account_employees,employee_id',
        ]);

        $settings = AttendanceEmployeeSettings::where('employee_id', $request->employee_id)->get();

        return response()->json($settings, 200);
    }

    /**
     * Save (create or update) the weekly attendance schedule for an employee.
     * Accepts one row per day, upserted by employee_id + day.
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:account_employees,user_id',
            'employee_id' => 'required|exists:account_employees,employee_id',
            'settings' => 'required|array|min:1',
            'settings.*.day' => 'required|string',
            'settings.*.time_in' => 'nullable|date_format:H:i:s',
            'settings.*.time_out' => 'nullable|date_format:H:i:s',
            'settings.*.is_day_off' => 'nullable|boolean',
        ]);

        $saved = collect($request->settings)->map(function ($item) use ($request) {
            $isDayOff = (bool) ($item['is_day_off'] ?? false);

            return AttendanceEmployeeSettings::updateOrCreate(
                [
                    'employee_id' => $request->employee_id,
                    'day' => $item['day'],
                ],
                [
                    'user_id' => $request->user_id,
                    'time_in' => $isDayOff ? null : ($item['time_in'] ?? null),
                    'time_out' => $isDayOff ? null : ($item['time_out'] ?? null),
                    'is_day_off' => $isDayOff ? '1' : '0',
                ]
            );
        });

        return response()->json($saved->values(), 201);
    }
}
