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
use App\Models\Jobs\JobApplication;
use App\Models\Jobs\JobOffer;
use App\Models\Jobs\JobPosting;
use App\Models\User;
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
            'position' => 'required|string',
            'salary' => 'required|numeric',
            'allowances' => 'nullable|array', // Ensure it's an array if present
            'allowance.*.allowance' => 'nullable|numeric',
            'allowance.*.allowance_type' => 'nullable|string',
        ]);
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

        $jo = JobOffer::updateOrCreate(
            [
                'user_id' => $request->user_id,
                'job_application_id' => $request->id,
            ],
            [
                'salary' => $request->salary,
                'role' => $request->role,
            ]
        );
        $jo->load('user');
        foreach ($request->allowances as $key => $value) {
            AccountEmployeeAllowance::updateOrCreate(
                [
                    'user_id' => $request->user_id,
                    'job_offer_id' => $jo->id,
                    'allowance_type' => $value['allowance_type'],
                ],
                [
                    'allowance' => $value['allowance'],
                ]
            );
        }

        JobApplication::updateOrCreate(
            ['id' => $request->id], // Match criteria
            ['final_status' => 'Sent Job Offer'] // Data to update/create
        );

        $data = [
            'name'           => $jo->user->name, // Assuming 'name' is on User
            'position'       => $request->role, // The job title being offered
            'salary'         => $request->salary,
            'allowances'     => $request->allowances,
            'job_offer_id'   => $jo->id,
            'user_role'      => $jo->user->role, // Accessing role from the User model
        ];
        Mail::to($send_to)->send(new JobOfferMail($data));

        return response()->json([
            'status' => 'success',
        ], 200);
    }
    public function apply_job_application(Request $request)
    {

        $user = User::firstOrCreate(
            ['email' => $request->email], // Condition to find existing user
            [
                'name' => $request->first_name,
                'password' => Hash::make('Business12'),
                'role' => 3,
                'email_verified_at' => now()
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
                'contact' => $request->contact ?? null,
                'school_name' => $request->school_name ?? null, //educational
                'course' => $request->course ?? null,
                'year_graduated' => $request->year_graduated ?? null,
                'awards' => $request->award ?? null,
                'degree' => $request->degree ?? null,

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

        $referral_id = $request->referral_id ? base64_decode($request->referral_id) : null;

        JobApplication::firstOrCreate(
            [
                'user_id' => $user->id,
                'job_posting_id' => $request->job_posting_id,
                'referral_id' => $referral_id,
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
