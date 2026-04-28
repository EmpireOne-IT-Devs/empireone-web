<?php

namespace App\Http\Controllers\API\Jobs;

use App\Http\Controllers\Controller;
use App\Mail\DocumentFileInstructions;
use App\Mail\JobOfferMail;
use App\Mail\SendEmailAccountCreation;
use App\Models\Account\AccountDocument;
use App\Models\Account\AccountEmployee;
use App\Models\Account\AccountEmployeeAllowance;
use App\Models\Account\AccountPersonalInformation;
use App\Models\Account\AccountSkills;
use App\Models\Account\AccountWorkingExperience;
use App\Models\Jobs\JobApplicantSchedule;
use App\Models\Jobs\JobApplication;
use App\Models\Jobs\JobInterviewerSchedule;
use App\Models\Jobs\JobOffer;
use App\Models\Jobs\JobPosting;
use App\Models\Jobs\JobRequisition;
use App\Models\User;
use App\Services\GoogleCalendarService;
use Carbon\Carbon;
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
        $applications =  JobApplication::where('user_id', Auth::id())->with(['applicant', 'job_posting'])->get();

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
                JobApplication::create([
                    $ja,
                    'user_id' => $ja->user_id,
                    'job_posting_id' => $request->job_posting_id,
                    'final_status' => 'Sent Job Offer',
                ]);
            } else {
                $ja->update([
                    'final_status' => 'Sent Job Offer',
                    'job_posting_id' => $request->job_posting_id,
                ]);
            }
        }
        $ja->load('job_posting');
        $jo = JobOffer::create([
            'user_id' => $request->user_id,
            'job_application_id' => $ja->id,
            'status' => 'Pending',
            'start_date' => $request->start_date,
            'salary' => $request->salary,
            'role' => $request->role,
        ]);
        $jo->load('user');
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



    public function apply_job_application(Request $request, GoogleCalendarService $calendarService)
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
            ]
        );

        // 4. Format Times (DB vs Google Calendar)
        // DB needs H:i:s
        $formattedStartTime = Carbon::parse($request->start_time)->format('H:i:s');
        $formattedEndTime   = Carbon::parse($request->end_time)->format('H:i:s');


        $googleStartTime = Carbon::parse($request->scheduled_date . ' ' . $request->start_time, 'Asia/Manila')->toIso8601String();
        $googleEndTime   = Carbon::parse($request->scheduled_date . ' ' . $request->end_time, 'Asia/Manila')->toIso8601String();
        // 5. Save Schedule to Database
        $schedule = JobApplicantSchedule::create([
            'application_id' => $application->id,
            'interviewer_id' => $request->interviewer_id,
            'scheduled_date' => $request->scheduled_date,
            'start_time'     => $formattedStartTime,
            'end_time'       => $formattedEndTime,
            'status'         => 'Pending',
        ]);

        // 6. Generate Google Meet Link
        // Fetch the interviewer to get their email address
        $interviewer = User::find($request->interviewer_id);

        if ($interviewer) {
            $googleEvent = $calendarService->createInterviewEvent([
                'title'             => 'Interview: ' . $user->name,
                'description'       => 'Schedule for Initial Interview.',
                'start_time'        => $googleStartTime,
                'end_time'          => $googleEndTime,
                'applicant_email'   => $user->email,
                'interviewer_email' => $interviewer->email,
            ]);

            // Update the schedule with the generated Meet link
            $schedule->update([
                'meeting_link' => $googleEvent['meet_link'],
                'status'       => 'Scheduled' // Change status since it is officially booked
            ]);

            Mail::to($user->email)->send(
                new SendEmailAccountCreation($user, url('/auth/login'), [
                    ...$googleEvent,
                    'start_time'        => $googleStartTime,
                    'end_time'          => $googleEndTime,
                    'meet_link' => $googleEvent['meet_link']
                ])
            );
        }

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
