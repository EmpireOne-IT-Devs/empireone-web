<?php

namespace App\Http\Controllers\API\Timekeeping;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Timekeeping\AttendanceEmployeeSettings;

class AttendanceEmployeeSettingsController extends Controller
{
    public function index() {}

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'employee_id' => 'required|exists:users,id',
            'day' => 'nullable|string',
            'time_in' => 'nullable|date_format:H:i:s',
            'time_out' => 'nullable|date_format:H:i:s',
            'is_day_off' => 'nullable|string',
        ]);

        $settings = AttendanceEmployeeSettings::create($request->all());

        return response()->json($settings, 201);
    }
}
