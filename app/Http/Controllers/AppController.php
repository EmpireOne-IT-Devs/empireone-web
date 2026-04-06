<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Department;
use App\Models\Jobs\JobApplication;
use App\Models\Jobs\JobOffer;
use App\Models\Jobs\JobPosition;
use App\Models\Jobs\JobPosting;
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
        $accounts = Account::get();
        $user = Auth::user()->load(['account_employee', 'is_passed', 'personal_information', 'documents', 'working_experience', 'skills']);

        $total_job_opening = JobPosting::whereIn('target_audience', ['Internal', 'Both'])->count();
        $total_application_submitted = JobApplication::where('user_id', $user->id)->count();
        $total_job_offer = JobOffer::where('user_id', $user->id)->count();
        return response()->json([
            'user' => $user,
            'departments' => $departments,
            'locations' => $locations,
            'sites' => $sites,
            'position' => $position,
            'accounts' => $accounts,
            'dashboard' => [
                'total_job_opening' => $total_job_opening,
                'total_application_submitted' => $total_application_submitted,
                'total_job_offer' => $total_job_offer
            ]
        ], 200);
    }
}
