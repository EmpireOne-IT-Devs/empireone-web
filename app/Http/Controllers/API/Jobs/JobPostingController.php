<?php

namespace App\Http\Controllers\API\Jobs;

use App\Http\Controllers\Controller;

use App\Models\Jobs\JobPosting;
use App\Models\Jobs\JobRequisition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JobPostingController extends Controller
{


    public function index()
    {
        $user = Auth::user(); // Administrator
        $query = JobPosting::where('status', 'Active')->with(['job_requisition', 'applications', 'applicant']);
        if ($user && $user->role == 2) { // Employee 
            $query->whereIn('target_audience', ['Internal', 'Both']);
        } elseif ($user && $user->role == 3) { // Applicant
            $query->whereIn('target_audience', ['External', 'Both']);
        }
        $query->whereIn('target_audience', ['External', 'Both']);
        $jobPostings = $query->orderBy('created_at', 'desc')->get();
        $jobPostings->map(function ($job) use ($user) {
            $job->is_applied = $job->applications()->where('user_id', $user->id ?? 0)->exists();
            return $job;
        });
        return response()->json($jobPostings);
    }

    public function store(Request $request)
    {


        $jobPosting = JobPosting::create([
            'job_requisition_id' => $request->job_requisition_id,
            'user_id' => Auth::id(),
            'application_deadline' => $request->application_deadline,
            'experience_required' => $request->experience_required,
            'education_required' => $request->education_required,
            'target_audience' => $request->target_audience,
            'status' => $request->status,
        ]);

        JobRequisition::updateOrCreate(
            ['id' =>  $request->job_requisition_id], // Condition to find existing user
            [
                'status' => 'Posted',
            ]
        );
        return response()->json([
            'message' => 'Job posting created successfully!',
            'job_posting' => $jobPosting
        ], 200);
    }

    public function destroy($id)
    {
        try {
            $jobPosting = JobPosting::findOrFail($id);



            $jobPosting->delete();

            return response()->json([
                'message' => 'Job posting deleted successfully'
            ], 201);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Job posting not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete job posting: ' . $e->getMessage()
            ], 500);
        }
    }
}
