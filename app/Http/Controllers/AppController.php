<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Account\AccountEmployee;
use App\Models\Department;
use App\Models\ER\ERPerformanceEvaluationForm;
use App\Models\Jobs\JobApplication;
use App\Models\Jobs\JobOffer;
use App\Models\Jobs\JobPosition;
use App\Models\Jobs\JobPosting;
use App\Models\Location;
use App\Models\Site;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class AppController extends Controller
{

    public function employee_assessment_notifications()
    {
        $threeMonthStart = Carbon::now()->subMonths(3)->toDateString();
        $threeMonthEnd   = Carbon::now()->addDays(7)->subMonths(3)->toDateString();
        $fiveMonthStart  = Carbon::now()->subMonths(5)->toDateString();
        $fiveMonthEnd    = Carbon::now()->addDays(7)->subMonths(5)->toDateString();
        $employees = AccountEmployee::whereRaw(
            "STR_TO_DATE(started_at, '%M %d, %Y') BETWEEN ? AND ?",
            [$threeMonthStart, $threeMonthEnd]
        )->orWhereRaw(
            "STR_TO_DATE(started_at, '%M %d, %Y') BETWEEN ? AND ?",
            [$fiveMonthStart, $fiveMonthEnd]
        )->get();

        // Loop through the results and append the evaluation status
        $employees->map(function ($employee) use ($threeMonthStart, $threeMonthEnd) {
            $startDate = Carbon::parse($employee->started_at)->toDateString();
            if ($startDate >= $threeMonthStart && $startDate <= $threeMonthEnd) {
                $employee->evaluation_period = '3 Months';
            } else {
                $employee->evaluation_period = '5 Months';
            }

            return $employee;
        });

        foreach ($employees as $key => $value) {
            ERPerformanceEvaluationForm::updateOrCreate(
                [
                    'user_id' => $value['user_id'],
                    'evaluation_period' => $value['evaluation_period'],
                ],
                []
            );
        }


        return response()->json([
            'users'  => $employees,
            'status' => 'success'
        ], 200);
    }
    public function index()
    {

        $auth = User::where('id', Auth::id())->with(['department', 'personal_information', 'documents', 'skills', 'working_experience', 'account_employee'])->first();
        $requiredFields = collect([
            'first_name',
            'middle_name',
            'last_name',
            'gender',
            'date_of_birth',
            'year_graduated',
            'contact',
            'region',
            'province',
            'city',
            'barangay',
            'street',
            'zip_code',
            'degree',
            'school_name',
            'course',
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
        $locations = Location::with(['sites'])->get();
        $position = JobPosition::with(['job_requisition'])->get();
        $sites = Site::get();
        $accounts = Account::get();
        $user = Auth::user()->load(['account_employee', 'is_passed', 'personal_information', 'documents', 'working_experience', 'skills', 'leader']);

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
