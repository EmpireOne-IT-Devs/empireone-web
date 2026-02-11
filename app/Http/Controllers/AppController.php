<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Location;
use App\Models\Site;
use Illuminate\Http\Request;

class AppController extends Controller
{
    public function index()
    {
        $departments = Department::with(['categories'])->get();
        $locations = Location::get();
        $sites = Site::get();
        return response()->json([
            'departments' => $departments,
            'locations' => $locations,
            'sites' => $sites
        ], 200);
    }
}
