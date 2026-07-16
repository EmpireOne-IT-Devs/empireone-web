<?php

namespace App\Http\Controllers\API\Jobs;

use App\Http\Controllers\Controller;
use App\Mail\JobOfferAcceptedMail;
use App\Mail\JobOfferDeclinedMail;
use App\Mail\PreEmploymentMail;
use App\Models\Account\AccountEmployee;
use App\Models\Account\AccountEmployeeAllowance;
use App\Models\ER\ERLeader;
use App\Models\Jobs\JobApplication;
use App\Models\Jobs\JobOffer;
use App\Models\Jobs\JobPosting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class JobOfferController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function transfer_job_offer(Request $request)
    {
        $job_application = JobApplication::where('id', $request->id)->first();
        if ($job_application) {
            $job_application->update([
                'final_status' => 'Transferred',
                'transferred_to' => Auth::id()
            ]);
        }
        JobApplication::create([
            ...$request->all(),
            'job_posting_id' => $request->new_job_posting_id
        ]);
        return response()->json([
            'status' => 'success',
        ], 200);
    }

    public function submit_job_offer(Request $request)
    {
        $jo = JobOffer::where('id', $request->id)->with(['allowances', 'user', 'job_application'])->first();

        if ($jo) {
            $jo->update([
                'status' => $request->status,
                'declined_reason' => $request->declined_reason
            ]);

            JobApplication::updateOrCreate(
                [
                    'id' => $jo->job_application_id,
                    'user_id' => $jo->user_id,
                ],
                [
                    'final_status' => $request->status,
                ]
            );
        }

        if ($request->status == 'Declined Job Offer') {
            Mail::to('hiring@empireonegroup.com')->send(new JobOfferDeclinedMail($jo));
        } else if ($request->status == 'Accepted Job Offer') { // Replace 'amount' with the actual column name you want to sum
            $total_allowance = AccountEmployeeAllowance::where('job_offer_id', $jo->id)->sum('allowance');
            $requestor_id = $request->job_application['job_posting']['job_requisition']['user_id'];
            $er_leader = ERLeader::where('user_id', $requestor_id)->first();

            AccountEmployee::where('user_id', $request->user_id)->update([
                'e_r_leader_id' => $er_leader->id ?? 0,
                'department_id' => $request->job_application['job_posting']['job_requisition']['department_id'],
                'account_id' => $request->job_application['job_posting']['job_requisition']['account_id'] ?? null,
                'site_id' => $request->job_application['job_posting']['job_requisition']['location_id'],
                'location_id' => $request->job_application['job_posting']['job_requisition']['location_id'],
                'position' => $request->job_application['job_posting']['job_requisition']['title'],
                'started_at' => $jo->start_date,
                'position_level' => $request->job_application['job_posting']['job_requisition']['position_level'],
                'basic_pay' => $jo->salary ?? 0,
                'allowance' => $total_allowance ?? 0,
                'work_type' => "Full Time",
                'status' => "Probationary"
            ]);
            Mail::to('hiring@empireonegroup.com')->send(new JobOfferAcceptedMail($jo));
            Mail::to($jo->user['email'])->send(new PreEmploymentMail($jo));
        }
        return response()->json([
            'status' => 'success',
        ], 200);
    }
    public function get_job_offer_by_user(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $query = JobOffer::where('user_id', Auth::id())->with(['job_application', 'user', 'allowances']);

        // Apply search filter (searching in role and position/title)
        if ($request->filled('search') && $search) {
            $query->where(function ($q) use ($search) {
                // Search in role field
                $q->where('role', 'like', "%{$search}%")
                    // Search in user name and email
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    })
                    // Search in job requisition title (position)
                    ->orWhereHas('job_application.job_posting.job_requisition', function ($requisitionQuery) use ($search) {
                        $requisitionQuery->where('title', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by status
        if ($request->filled('status') && $status && $status !== 'all') {
            $query->where('status', $status);
        }

        $jo = $query->orderBy('id', 'desc')->get();

        return response()->json([
            'data' => $jo,
            'status' => 'success',
        ], 200);
    }
    public function index(Request $request)
    {
        $query = JobOffer::with(['job_application', 'user', 'allowances']);

        // Apply search filter
        if ($request->filled('search') && $request->search) {
            $search = $request->input('search');
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($request->filled('role')  && $request->role) {
            $role = $request->input('role');
            $query->where('role', $role);
        }

        // Filter by status
        if ($request->filled('status')  && $request->status) {
            $status = $request->input('status');
            $query->where('status', $status);
        }

        // Paginate results
        $jobOffers = $query->paginate(10)->appends($request->all());

        return response()->json($jobOffers, 200);
    }
    public function get_job_offers_by_job_posting($id)
    {
        $jobPostings = JobOffer::with(['job_application', 'user'])
            ->whereHas('job_application', function ($query) use ($id) {
                $query->where('job_posting_id', $id);
            })
            ->paginate(10);

        return response()->json($jobPostings, 200);
    }
    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $jobOffers = JobOffer::where('id', $id)->with(['job_application', 'user', 'employee', 'documents', 'allowances', 'manager'])->first();
        return response()->json([
            'data' => $jobOffers,
            'status' => 'success',
        ], 200);
    }
}
