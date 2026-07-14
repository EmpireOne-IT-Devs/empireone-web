<?php

namespace App\Http\Controllers\API\Jobs;

use App\Models\Jobs\JobApplicantSchedule;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use GuzzleHttp\Client;
use Illuminate\Http\Request;

class JobApplicantScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $schedules = JobApplicantSchedule::with(['application', 'interviewer'])->get();
        return response()->json([
            'data' => $schedules,
            'status' => 'success',
        ], 200);
    }

    public function delete_interview_schedule($data)
    {
        $scriptUrl = env('DELETE_INTERVIEW_SCHEDULE');
        $client = new Client();
        $response = $client->post($scriptUrl, [
            'headers' => [
                'Content-Type' => 'application/x-www-form-urlencoded'
            ],
            'form_params' => $data // All parameters like google_calendar_event_id are sent here safely
        ]);

        return $response->getBody()->getContents();
    }

    public function send_interview_schedule($data)
    {
        $scriptUrl = env('SEND_INTERVIEW_SCHEDULE');
        $client = new Client();
        $response = $client->post($scriptUrl, [
            'headers' => [
                'Content-Type' => 'application/x-www-form-urlencoded'
            ],
            'form_params' => $data
        ]);
        $body = $response->getBody()->getContents();
        return $body;
    }
    public function change_job_applicant_schedule(Request $request)
    {
        // 1. Place with() BEFORE first() to keep the WHERE condition intact
        $schedule = JobApplicantSchedule::with(['application'])
            ->where('id', $request->id)
            ->with(['application'])
            ->first();

        if (!$schedule) {
            return response()->json([
                'status' => 'error',
                'message' => 'Schedule not found'
            ], 404);
        }

        // 2. Format the new dates for Google Calendar


        $googleStartTime = Carbon::parse($request->scheduled_date . ' ' . $request->start_time, 'Asia/Manila')->toIso8601String();
        $googleEndTime   = Carbon::parse($request->scheduled_date . ' ' . $request->end_time, 'Asia/Manila')->toIso8601String();

        // 3. This will now safely update ONLY this single row!
        $schedule->update([
            'scheduled_date' => $request->scheduled_date,
            'start_time'     => $request->start_time,
            'end_time'       => $request->end_time,
        ]);

        $applicantUser = $schedule['application']['applicant'];

        if (!empty($schedule->google_calendar_event_id)) {
            $this->delete_interview_schedule([
                'google_calendar_event_id' => $schedule->google_calendar_event_id,
            ]);
        }

        $result =  $this->send_interview_schedule([
            'applicant_email' => $applicantUser['email'],
            'applicant_name'  =>  $applicantUser['name'],
            'start_time'      => $googleStartTime,
            'end_time'        => $googleEndTime,
            'job_title'       => $request->position,
        ]);
        // 5. Update the meet link if changed
        $googleData = json_decode($result, true);
        $meetLink = $googleData['eventId']['meetLink'];
        $eventId = $googleData['eventId']['eventId'];
        $schedule->update([
            'meeting_link' => $meetLink,
            'google_calendar_event_id' => $eventId,
        ]);

        return response()->json([
            'status' => 'success',
            'data'   => $schedule
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
