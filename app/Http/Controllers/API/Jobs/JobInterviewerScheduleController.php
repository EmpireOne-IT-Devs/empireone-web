<?php

namespace App\Http\Controllers\API\Jobs;

use App\Models\Jobs\JobInterviewerSchedule;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class JobInterviewerScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $interviewers = JobInterviewerSchedule::with(['interviewer'])
            ->get()
            ->sortBy(function ($schedule) {
                return $schedule->interviewer->name ?? '';
            })
            ->values(); // Reset keys to maintain a clean JSON array

        return response()->json([
            'data' => $interviewers,
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
        JobInterviewerSchedule::create($request->all());
        return response()->json([
            'data' =>  'sucess',
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show($interviewer_id)
    {
        $interviewer = JobInterviewerSchedule::where('interviewer_id', $interviewer_id)->with(['upcoming_schedules'])->first();
        return response()->json([
            'data' =>  $interviewer,
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(JobInterviewerSchedule $jobInterviewerSchedule)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, JobInterviewerSchedule $jobInterviewerSchedule)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JobInterviewerSchedule $jobInterviewerSchedule)
    {
        //
    }
}
