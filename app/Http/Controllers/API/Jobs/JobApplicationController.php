<?php

namespace App\Http\Controllers\API\Jobs;

use App\Http\Controllers\Controller;
use App\Mail\SendEmailAccountCreation;
use App\Models\Account\AccountDocument;
use App\Models\Account\AccountPersonalInformation;
use App\Models\Account\AccountSkills;
use App\Models\Account\AccountWorkingExperience;
use App\Models\Jobs\JobApplication;
use App\Models\Jobs\JobPosting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class JobApplicationController extends Controller
{

    function base64ToFile($base64String)
    {
        // Split "data:mime/type;base64,XXXXX"
        [$meta, $data] = explode(',', $base64String, 2);

        // Decode Base64
        return base64_decode($data);
    }

    public function apply_job_application(Request $request)
    {

        $user = User::firstOrCreate(
            ['email' => $request->email], // Condition to find existing user
            [
                'name' => $request->first_name,
                'password' => Hash::make('Business12'),
                'role' => 2,
            ]
        );
        AccountPersonalInformation::updateOrCreate(
            ['user_id' => $user->id], // Condition to find the record
            [
                'street' => $request->street ?? null,
                'region' => $request->region ?? null,
                'province' => $request->province ?? null,
                'city' => $request->city ?? null,
                'barangay' => $request->barangay ?? null,
                'zip_code' => $request->zip_code ?? null,
                'first_name' => $request->first_name ?? null,
                'middle_name' => $request->middle_name ?? null,
                'last_name' => $request->last_name ?? null,
                'suffix' => $request->suffix ?? null,
                'gender' => $request->gender ?? null,
                'date_of_birth' => $request->date_of_birth,
                'birth_place' => $request->birth_place ?? null,
                'nationality' => $request->nationality ?? null,
                'marital_status' => $request->marital_status ?? null,
            ]
        );

        foreach ($request->experiences as $key => $value) {
            if ($value) {
                AccountWorkingExperience::updateOrCreate(
                    ['user_id' => $user->id], // Condition to find the record
                    [
                        'company_name' => $value['company_name'],
                        'position' => $value['position'],
                        'start_date' => $value['start_at'],
                        'end_date' => $value['end_at'],
                        'job_description' => $value['job_description'],
                    ]
                );
            }
        }


        foreach ($request->skills as $key => $value) {
            if ($value) {
                AccountSkills::updateOrCreate(
                    ['user_id' => $user->id], // Condition to find the record
                    [
                        'skill' => $value['skill'],
                        'percentage' => $value['percentage'],
                    ]
                );
            }
        }

        JobApplication::firstOrCreate(
            [
                'user_id' => $user->id,
                'job_posting_id' => $request->job_posting_id,
            ]
        );

        if ($request->file) {
            $fileContent = $this->base64ToFile($request->file);
            $fileName = 'resume_' . time();
            $path = "unified/account/resume";
            Storage::disk('s3')->put($path, $fileContent);
            $url = Storage::disk('s3')->url($path);
            AccountDocument::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'type'    => 'Resume',
                ],
                [
                    'name'   => $fileName,
                    'url'    => $url,
                    'status' => 'Approved',
                ]
            );
        }

        Mail::to($user->email)->send(
            new SendEmailAccountCreation($user, url('/auth/login'))
        );
        // marital_status
        // nationality
        // birth_place
        //suffix
        return response()->json([
            'status' => 'success',
        ], 200);
    }
    public function update_job_application_status(Request $request)
    {
        $ja = JobApplication::where('id', $request->id)->first();
        if ($ja) {
            $ja->update($request->all());
        }
        return response()->json([
            'status' => 'success',
        ], 200);
    }
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
        $applications = JobApplication::with(['job_posting', 'applicant'])->paginate();
        return response()->json([
            'data' => $applications,
            'status' => 'success',
        ], 200);
    }
    public function index()
    {

        $applications = JobApplication::where('status', 'Active')->with(['job_posting', 'applicant'])->get();

        return response()->json([
            'data' => $applications,
            'status' => 'success',
        ], 200);
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
        $applications = JobApplication::where('job_posting_id', $id)->with(['job_posting', 'applicant'])->get();
        // $stats = [
        //     'total'    => $applications->count(),
        //     'pending'  => $applications->where('screening_status', 'Pending')->count(),
        //     'initial'  => $applications->where('screening_status', 'Initial Phase')->count(),
        //     'final'    => $applications->where('screening_status', 'Final Phase')->count(),
        //     'passed'   => $applications->where('screening_status', 'Passed')->count(),
        //     'failed'   => $applications->where('screening_status', 'Failed')->count(),
        // ];
        $job_posting = JobPosting::where('id', $id)->with(['job_requisition'])->first();
        return response()->json([
            'job_applications' => $applications,
            // 'stats'  => $stats,
            'job_posting' => $job_posting
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
