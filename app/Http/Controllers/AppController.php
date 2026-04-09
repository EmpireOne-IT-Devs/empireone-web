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
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AppController extends Controller
{
    public function index()
    {

        $auth = User::where('id', Auth::id())->with(['department', 'personal_information', 'documents', 'skills', 'working_experience', 'account_employee'])->first();
        $requiredFields = collect([
            'first_name',
            'middle_name',
            'last_name',
            'gender',
            'date_of_birth',
            'birth_place',
            'region',
            'province',
            'city',
            'barangay',
            'street',
            'zip_code',
            'highest_level_of_education',
            'contact'
        ]);
        $percent = '0%';
        $info = $auth->personal_information;

        // 2. Only calculate if personal_information actually exists
        if ($info) {
            // Use the collection's filter method to count how many fields are NOT empty
            $filledCount = $requiredFields->filter(function ($field) use ($info) {
                return !empty($info->{$field});
            })->count();
            // Calculate percentage
            $percent = round(($filledCount / $requiredFields->count()) * 100);
        }

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
            'profile_percent' => $percent, // Renamed slightly for clarity
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
