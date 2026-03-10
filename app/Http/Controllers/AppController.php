<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Jobs\JobPosition;
use App\Models\Location;
use App\Models\Site;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AppController extends Controller
{
    public function index()
    {
        $departments = Department::with(['categories'])->get();
        $locations = Location::get();
        $position = JobPosition::with(['job_requisition'])->get();
        $sites = Site::get();
        $user = Auth::user()->load(['account_employee']);
        return response()->json([
            'user' => $user,
            'departments' => $departments,
            'locations' => $locations,
            'sites' => $sites,
            'position' => $position
        ], 200);
    }
}
