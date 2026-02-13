<?php

namespace App\Http\Controllers;

use App\Models\Department;
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
        $sites = Site::get();
        $user = Auth::user();
        return response()->json([
            'user' => $user,
            'departments' => $departments,
            'locations' => $locations,
            'sites' => $sites
        ], 200);
    }
}
