<?php

namespace App\Http\Controllers\API\Jobs;

use App\Http\Controllers\Controller;
use App\Mail\JobOfferAcceptedMail;
use App\Mail\JobOfferDeclinedMail;
use App\Mail\PreEmploymentMail;
use App\Models\Jobs\JobOffer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class JobOfferController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function submit_job_offer(Request $request)
    {
        $jo = JobOffer::where('id', $request->id)->with(['allowances', 'user', 'job_application'])->first();
        if ($jo) {
            $jo->update([
                'status' => $request->status,
                'declined_reason' => $request->declined_reason
            ]);
        }
        if ($request->status == 'Declined') {
            Mail::to('hiring@empireonegroup.com')->send(new JobOfferDeclinedMail($jo));
            // change the status of job application into Declined Job Offer
        } else if ($request->status == 'Accepted') {
            Mail::to('hiring@empireonegroup.com')->send(new JobOfferAcceptedMail($jo));
            Mail::to($jo->user['email'])->send(new PreEmploymentMail($jo));
            // change the status of job application into Accepted Job Offer
        }
        return response()->json([
            'status' => 'success',
        ], 200);
    }
    public function get_job_offer_by_user()
    {
        $jo = JobOffer::where('user_id', Auth::id())->with(['job_application', 'user', 'allowances'])->orderBy('id', 'desc')->get();
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

        return response()->json([
            'data' => $jobOffers,
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
    public function show(JobOffer $jobOffer)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(JobOffer $jobOffer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, JobOffer $jobOffer)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JobOffer $jobOffer)
    {
        //
    }
}
