<?php

namespace App\Http\Controllers\API\Jobs;

use App\Http\Controllers\Controller;
use App\Mail\ApplicantRejected;
use App\Mail\JobOfferMail;
use App\Models\Account\AccountDocument;
use App\Models\Account\AccountEmployee;
use App\Models\Account\AccountEmployeeAllowance;
use App\Models\Account\AccountPersonalInformation;
use App\Models\Jobs\JobAIInterview;
use App\Models\Jobs\JobApplicantSchedule;
use App\Models\Jobs\JobApplication;
use App\Models\Jobs\JobOffer;
use App\Models\Jobs\JobPosting;
use App\Models\Jobs\JobRequisition;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use GuzzleHttp\Client;

class JobApplicationController extends Controller
{


    function base64ToFile($base64String)
    {
        // Split "data:mime/type;base64,XXXXX"
        [$meta, $data] = explode(',', $base64String, 2);

        // Decode Base64
        return base64_decode($data);
    }

    public function application_failed_notification(Request $request)
    {
        return 'hello';
    }
    public function employee_applicants(Request $request)
    {
        $applications = JobApplication::where([
            ['interview_status', '=', 'Passed'],
            ['final_status', '=', 'Passed']
        ])
            ->with(['job_posting', 'applicant', 'user', 'change_form'])
            ->whereHas('user', function ($query) use ($request) {
                $query->whereIn('role', [1, 2]);

                // Check if employee_id is present in the request
                if ($request->filled('employee_id')) {
                    // Since account_employee is likely a relationship on the User model,
                    // you need a nested whereHas to query its columns.
                    $query->whereHas('account_employee', function ($subQuery) use ($request) {
                        $subQuery->where('employee_id', $request->employee_id);
                    });
                }
            })
            ->get();

        return response()->json([
            'data' => $applications,
            'status' => 'success',
        ], 200);
    }

    public function get_applicant_pooling()
    {
        $applications = JobApplication::whereIn('final_status', ['Pooled', 'Sent Job Offer', 'Accepted Job Offer'])->with(['job_posting', 'applicant'])->get();

        return response()->json([
            'data' => $applications,
            'status' => 'success',
        ], 200);
    }
    public function get_job_application_from_email(Request $request)
    {
        // The Google Apps Script sends an array of email objects
        $emails = $request->all();

        if (empty($emails)) {
            return response()->json(['status' => 'ignored', 'message' => 'No data received.']);
        }

        foreach ($emails as $emailData) {
            // 1. Extract raw data from the JS payload
            $rawSubject = $emailData['subject'] ?? '';
            $applicantEmail = $emailData['from'] ?? null;

            // Initialize defaults
            $applicantName = 'Unknown Applicant';
            $jobTitle = null;

            // Parse the subject to extract Job Title and Applicant Name
            // This Regex looks for "Application: [Job Title] - [Name]" (is flexible with spaces)
            if (preg_match('/Application:\s*(.*?)\s*-\s*(.*)/i', $rawSubject, $matches)) {
                $jobTitle = trim($matches[1]);       // Extracts: "Web Developer"
                $applicantName = trim($matches[2]);  // Extracts: "Marlou Flores Pepito"
            }

            // Ensure we have the minimum required data to proceed
            if (!$applicantEmail || !$jobTitle) {
                continue;
            }

            // 2. Create or find the User (prevents duplicate email crashes)
            $user = User::firstOrCreate(
                ['email' => $applicantEmail],
                [
                    'name' => $applicantName,
                    'password' => Hash::make('Business12'), // Always hash passwords!
                    'role' => 3
                ]
            );


            if ($user->wasRecentlyCreated) {
                // Mail::to($user->email)->send(
                //     new SendEmailAccountCreation($user, url('/auth/login'))
                // );
            }

            if (!empty($emailData['attachments'])) {
                foreach ($emailData['attachments'] as $attachment) {

                    // Decode the base64 string from Google Apps Script
                    $fileContent = base64_decode($attachment['base64']);

                    // Create a unique filename utilizing the original extension and user ID
                    $extension = pathinfo($attachment['name'], PATHINFO_EXTENSION);
                    $fileName = 'resume_' . $user->id . '_' . time() . '.' . $extension;

                    // MUST append the filename to the S3 path!
                    $path = "unified/account/resume/" . $fileName;

                    Storage::disk('s3')->put($path, $fileContent);
                    $url = Storage::disk('s3')->url($path);

                    AccountDocument::updateOrCreate(
                        [
                            'user_id' => $user->id,
                            'type'    => 'Resume',
                        ],
                        [
                            'name'   => $attachment['name'], // Keep original name for display purposes
                            'url'    => $url,
                            'status' => 'Approved',
                        ]
                    );
                }
            }


            // 3. Find the Active Job Requisition
            $job_requisition = JobRequisition::where('title', $jobTitle)
                ->with(['job_posting'])
                ->whereHas('job_posting', function ($query) {
                    $query->where('status', 'Active');
                })
                ->first();

            // 4. Create the Job Application (if the posting exists)
            if ($job_requisition && $job_requisition->job_posting) {
                JobApplication::firstOrCreate([
                    'user_id' => $user->id,
                    'threadId' => $request->threadId,
                    'job_posting_id' => $job_requisition->job_posting->id,
                    'source' => $request->source
                ]);
            }

            // 5. (Optional) Handle Attachments
            // You have Base64 encoded PDFs coming in $emailData['attachments']!
            // Example:
            // foreach($emailData['attachments'] as $attachment) {
            //     $decodedFile = base64_decode($attachment['base64']);
            //     // Storage::put('resumes/' . $attachment['name'], $decodedFile);
            // }
        }

        return response()->json([
            'status' => 'success',
            'processed' => count($emails)
        ]);
    }

    public function get_job_application_by_user(Request $request)
    {
        $applications =  JobApplication::where('user_id', Auth::id())->with(['applicant', 'job_posting.job_requisition'])->get();

        return response()->json([
            'status' => 'success',
            'data' => $applications
        ], 200);
    }


    public function send_job_offer(Request $request)
    {
        $request->validate([
            'job_posting_id' => 'required',
            'job_application_id' => 'required',
            'start_date' => 'required|string',
            'salary' => 'required|numeric',
            'allowances' => 'nullable|array', // Ensure it's an array if present
            'allowance.*.allowance' => 'nullable|numeric',
            'allowance.*.allowance_type' => 'nullable|string',
        ]);
        $data = $request->all();
        if (!isset($data['allowances'])) {
            $data['allowances'] = [];
        }
        $send_to = $request->applicant['email'];
        if ($request->status == 'Re-Offered') {
            JobOffer::where('id', $request->id)
                ->update([
                    'status' => $request->status,
                ]);
        }

        $ja = JobApplication::where('id', $request->job_application_id)->with(['job_posting'])->first();
        if ($ja) {
            if ($ja->job_posting_id != $request->job_posting_id) {
                $ja->update([
                    'final_status' => 'Transferred',
                    'transferred_to' => Auth::id()
                ]);
                $nja =  JobApplication::create([
                    $ja,
                    'user_id' => $ja->user_id,
                    'job_posting_id' => $request->job_posting_id,
                    'final_status' => 'Sent Job Offer',
                ]);
                $jo = JobOffer::create([
                    'user_id' => $request->user_id,
                    'job_application_id' => $nja->id,
                    'status' => 'Pending',
                    'start_date' => $request->start_date,
                    'salary' => $request->salary,
                    'role' => $request->role,
                ]);
                $jo->load('user');
            } else {
                $ja->update([
                    'final_status' => 'Sent Job Offer',
                    'job_posting_id' => $request->job_posting_id,
                ]);
                $jo = JobOffer::create([
                    'user_id' => $request->user_id,
                    'job_application_id' => $ja->id,
                    'status' => 'Pending',
                    'start_date' => $request->start_date,
                    'salary' => $request->salary,
                    'role' => $request->role,
                ]);
            }
        }
        $ja->load('job_posting');

        foreach ($request->allowances as $key => $value) {
            AccountEmployeeAllowance::create([
                'user_id' => $request->user_id,
                'job_offer_id' => $jo->id,
                'allowance_type' => $value['allowance_type'],
                'allowance' => $value['allowance'],
            ]);
        }

        Mail::to($send_to)->send(new JobOfferMail(
            array_merge($data, [
                'job_offer_id' => $jo->id,
                'user_role' => $jo->user->role,
                'position' => $ja->job_posting['job_requisition']['title']
            ])
        ));

        return response()->json([
            'status' => 'success',
        ], 200);
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


    public function apply_job_application(Request $request)
    {
        // 1. Create or Find User
        $user = User::firstOrCreate(
            ['email' => $request->email],
            [
                'name' => $request->first_name,
                'password' => Hash::make('Business12'),
                'role' => 3,
                'email_verified_at' => now()
            ]
        );

        // 2. Save Personal Info
        AccountPersonalInformation::updateOrCreate(
            ['user_id' => $user->id],
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
                'date_of_birth' => $request->date_of_birth ?? null,
                'birth_place' => $request->birth_place ?? null,
                'nationality' => $request->nationality ?? null,
                'previous_employee_status' => $request->previous_employee_status ?? null,
                'marital_status' => $request->marital_status ?? null,
                'contact' => $request->contact ?? null,
                'school_name' => $request->school_name ?? null,
                'course' => $request->course ?? null,
                'year_graduated' => $request->year_graduated ?? null,
                'awards' => $request->award ?? null,
                'degree' => $request->degree ?? null,
            ]
        );

        // 3. Save Job Application
        $referral_id = $request->referral_id ? base64_decode($request->referral_id) : null;

        $application = JobApplication::firstOrCreate(
            [
                'user_id'        => $user->id,
                'job_posting_id' => $request->job_posting_id,
            ],
            [
                'referral_id'    => $referral_id,
                'source'         => $request->source ?? null,
                'interview_type' => $request->interview_type
            ]
        );

        // 4. Format Times (DB vs Google Calendar)
        // DB needs H:i:s
        $formattedStartTime = Carbon::parse($request->start_time)->format('H:i:s');
        $formattedEndTime   = Carbon::parse($request->end_time)->format('H:i:s');


        $googleStartTime = Carbon::parse($request->scheduled_date . ' ' . $request->start_time, 'Asia/Manila')->toIso8601String();
        $googleEndTime   = Carbon::parse($request->scheduled_date . ' ' . $request->end_time, 'Asia/Manila')->toIso8601String();
        // 5. Save Schedule to Database
        $schedule = JobApplicantSchedule::updateOrCreate(
            // 1. Search criteria: find the existing schedule for this specific application
            [
                'application_id' => $application->id,
            ],
            // 2. Values to update or create
            [
                'interviewer_id' => $request->interviewer_id,
                'scheduled_date' => $request->scheduled_date,
                'start_time'     => $formattedStartTime,
                'end_time'       => $formattedEndTime,
                'status'         => 'Pending', // Resets to 'Pending' if the schedule is updated
            ]
        );

        // 6. Generate Google Meet Link
        // Fetch the interviewer to get their email address
        $interviewer = User::find($request->interviewer_id);

        if ($interviewer) {

            // $ji = JobAIInterview::create([
            //     'user_id'        => $user->id,
            //     'job_title' => $request->position,
            //     'questions_limit' => 5,
            //     'current_step' => 0,
            // ]);

            $result =  $this->send_interview_schedule([
                // 'job_interview_id' => url("/accounts/talent/{$ji->id}/ai_interview"),
                'applicant_email' => $user->email,
                'applicant_name'  => $user->name, // Pass the real name so Apps Script doesn't have to guess
                'start_time'      => $googleStartTime, // Must be a valid date string (e.g., '2026-05-22T10:40:00')
                'end_time'        => $googleEndTime,
                'job_title'       => $request->position,
            ]);

            $googleData = json_decode($result, true);
            $meetLink = $googleData['eventId']['meetLink'];
            // $eventId = $googleData['eventId']['eventId'];
            $schedule->update([
                'meeting_link' => $meetLink,
                'status'       => 'Scheduled' // Change status since it is officially booked
            ]);

            // Mail::to($user->email)->send(
            //     new SendEmailAccountCreation($user, url('/auth/login'), [
            //         ...$googleEvent,
            //         // FIXED: Changed to double quotes and wrapped the variable in curly braces
            //         'job_interview_id'  => url("/accounts/talent/{$ji->id}/ai_interview"),
            //         'start_time'        => $googleStartTime,
            //         'end_time'          => $googleEndTime,
            //         'meet_link'         => $googleEvent['meet_link']
            //     ])
            // );

            // 7. Handle Resume Upload
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
        }



        // 8. Send Email & Return Response


        return response()->json([
            'status' => 'success',
        ], 200);
    }
    public function generate_employee_id() {}
    public function update_job_application_status(Request $request)
    {
        $ja = JobApplication::with(['job_posting.job_requisition', 'applicant'])
            ->find($request->id);
        if ($request->final_status == 'Failed' || $request->interview_status == 'Failed') {
            Mail::to('webdev@empireonegroup.com')->send(new ApplicantRejected($ja));
        }
        if (!$ja) {
            return response()->json([
                'status' => 'error',
                'message' => 'Job application not found'
            ], 404);
        }
        $ja->update($request->only(['final_status', 'interview_status', 'screening_status']));

        return response()->json([
            'status' => $ja,
            'message' => 'Job application updated successfully.'
        ], 200);
        // if (
        //     $request->final_status === 'Hired' &&
        //     $ja->interview_status === 'Passed' &&
        //     $ja->screening_status === 'Passed'
        // ) {
        //     $send_to =$ja->applicant['email'];
        //     Mail::to('webdev@empireonegroup.com')->send(new JobOfferMail($ja));
        // } else 

        if (
            $request->final_status === 'Hired' &&
            $ja->interview_status === 'Passed' &&
            $ja->screening_status === 'Screened Passed'
        ) {
            // generate employee_id
            // $todayEmployeeIds = AccountEmployee::whereDate('created_at', Carbon::today())
            //     ->pluck('employee_id')
            //     ->toArray();
            // $todaySequences = array_map(function ($id) {
            //     return (int)substr($id, -2);
            // }, $todayEmployeeIds);
            // $sequence = 1;
            // while (in_array($sequence, $todaySequences)) {
            //     $sequence++;
            // }
            // $employee_id = date('y') . date('m') . date('d') . str_pad($sequence, 2, '0', STR_PAD_LEFT);
            // $position = optional($ja->job_posting->job_requisition)->title ?? 'N/A';
            // $isExist = in_array($request->applicant['account_employee']['employee_id'], $todayEmployeeIds);

            // if (!$isExist || $request->applicant['account_employee']['employee_id'] == null) {
            //     AccountEmployee::updateOrCreate(
            //         ['user_id' => $ja->user_id],
            //         [
            //             'employee_id' => $employee_id,
            //             'account_id' => $ja->account_id,
            //             'position' => $position,
            //         ]
            //     );
            //     $user = User::findOrFail($request->user_id);
            //     Mail::to($user->email)->send(new DocumentFileInstructions($user));
            // }


            $position = optional($ja->job_posting->job_requisition)->title ?? 'N/A';
            AccountEmployee::updateOrCreate(
                ['user_id' => $ja->user_id],
                [
                    'account_id' => $ja->account_id,
                    'position' => $position,
                ]
            );
        } else {
            AccountEmployee::updateOrCreate(
                ['user_id' => $ja->user_id],
                [
                    'employee_id' => null,
                    'position' => null,
                ]
            );
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Job application updated successfully.'
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

    public function applicants(Request $request)
    {
        $locationId = Auth::user()->account_employee->location_id;

        // 1. Create a base query to avoid repeating the location filter
        $baseQuery = JobApplication::whereHas('job_posting.job_requisition', function ($query) use ($locationId) {
            $query->where('location_id', $locationId);
        });

        // 2. Fetch the paginated applications
        $applications = (clone $baseQuery)->with(['job_posting', 'applicant', 'job_offer', 'user', 'personal_information'])
            ->when($request->search, function ($query) use ($request) {
                $searchTerm = '%' . $request->search . '%';

                // Group the search conditions so it acts as (User Matches OR Personal Info Matches)
                $query->where(function ($subQuery) use ($searchTerm) {

                    // 1. Search the User relationship
                    $subQuery->whereHas('user', function ($q) use ($searchTerm) {
                        $q->where('name', 'like', $searchTerm)
                            ->orWhere('email', 'like', $searchTerm);
                    });

                    // 2. Search the Personal Information relationship
                    /* * Note: If 'personal_information' belongs directly to the Application model, use this:
             */
                    $subQuery->orWhereHas('personal_information', function ($q) use ($searchTerm) {
                        $q->where('first_name', 'like', $searchTerm)
                            ->orWhere('last_name', 'like', $searchTerm);
                    });

                    /*
             * ALTERNATIVE: If 'personal_information' actually belongs to the 'applicant' model, 
             * you can chain them using dot notation inside orWhereHas like this:
             *
             * $subQuery->orWhereHas('applicant.personal_information', function ($q) use ($searchTerm) {
             * $q->where('first_name', 'like', $searchTerm)
             * ->orWhere('last_name', 'like', $searchTerm);
             * });
             */
                });
            })
            ->paginate();

        // 3. Count today's statuses using conditional aggregates
        // Note: I am assuming "initial" refers to `interview_status`. If you meant `screening_status`, simply swap the column names below.
        $statuses = (clone $baseQuery)
            ->whereDate('updated_at', now()->toDateString())
            ->selectRaw("
        SUM(CASE WHEN interview_status = 'Passed' THEN 1 ELSE 0 END) as initial_passed,
        SUM(CASE WHEN interview_status = 'Failed' THEN 1 ELSE 0 END) as initial_failed,
        SUM(CASE WHEN final_status = 'Passed' THEN 1 ELSE 0 END) as final_passed,
        SUM(CASE WHEN final_status = 'Failed' THEN 1 ELSE 0 END) as final_failed,
        SUM(CASE WHEN final_status = 'Pooled' THEN 1 ELSE 0 END) as final_pooled,
        SUM(CASE WHEN interview_status IS NULL AND final_status IS NULL THEN 1 ELSE 0 END) as remaining_applicants,
        COUNT(id) as total_applicant
    ")
            ->first();

        return response()->json([
            'data' => $applications,
            'statuses' => [
                'initial_passed' => (int) $statuses->initial_passed,
                'initial_failed' => (int) $statuses->initial_failed,
                'final_passed' => (int) $statuses->final_passed,
                'final_failed' => (int) $statuses->final_failed,
                'final_pooled' => (int) $statuses->final_pooled,
                'total_applicant' => (int) $statuses->total_applicant,
                'remaining_applicants' => (int) $statuses->remaining_applicants,
            ],
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
        $applications = JobApplication::where('job_posting_id', $id)->with(['job_posting', 'applicant', 'job_offer', 'user'])->get();
        $job_posting = JobPosting::where('id', $id)->with(['job_requisition', 'job_application'])->first();
        return response()->json([
            'job_applications' => $applications,
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
