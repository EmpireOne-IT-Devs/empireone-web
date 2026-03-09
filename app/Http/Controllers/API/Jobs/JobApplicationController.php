<?php

namespace App\Http\Controllers\API\Jobs;

use App\Http\Controllers\Controller;
use App\Models\Jobs\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JobApplicationController extends Controller
{

    public function get_applications_by_user()
    {

        $ja = JobApplication::where('user_id', Auth::id())->with(['job_posting', 'applicant'])->get();
        return response()->json([
            'data' => $ja,
            'status' => 'success',
        ], 200);
    }

    public function applicants()
    {
        $applicants = JobApplication::with(['job_posting', 'applicant'])->paginate();
        return response()->json([
            'data' => $applicants,
            'status' => 'success',
        ], 200);
    }
    public function index()
    {
        //
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        JobApplication::create([
            'user_id' => Auth::id(),
            'job_posting_id' => $request->job_posting_id,
        ]);
        return response()->json([
            'status' => 'success',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {

        // 1. Fetch all applications for this specific job once
        $applications = JobApplication::where('id', $id)->with(['job_posting', 'applicants'])->first();

        $stats = [
            'total'    => $applications->count(),
            'pending'  => $applications->where('status', 'Pending')->count(),
            'initial'  => $applications->where('status', 'Initial Phase')->count(),
            'final'    => $applications->where('status', 'Final Phase')->count(),
            'passed'   => $applications->where('status', 'Passed')->count(),
            'failed'   => $applications->where('status', 'Failed')->count(),
        ];
        $ja =  JobApplication::where('id', $id)->with(['applicants', 'job_posting'])->get();

        return response()->json([
            'data' => $ja,
            'job_application' => $applications,
            'stats'  => $stats,
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(JobApplication $jobApplication)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, JobApplication $jobApplication)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JobApplication $jobApplication)
    {
        //
    }
}
