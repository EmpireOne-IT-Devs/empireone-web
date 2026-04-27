<?php

namespace App\Http\Controllers\API\Jobs;

use App\Models\Jobs\JobApplicantSchedule;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class JobApplicantScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $schedules = JobApplicantSchedule::with(['application','interviewer'])->get();
        return response()->json([
            'data' => $schedules,
            'status' => 'success',
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(JobApplicantSchedule $jobApplicantSchedule)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(JobApplicantSchedule $jobApplicantSchedule)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, JobApplicantSchedule $jobApplicantSchedule)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JobApplicantSchedule $jobApplicantSchedule)
    {
        //
    }
}
