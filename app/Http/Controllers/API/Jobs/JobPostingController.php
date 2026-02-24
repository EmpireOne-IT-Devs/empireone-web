<?php

namespace App\Http\Controllers\API\Jobs;

use App\Http\Controllers\Controller;

use App\Models\Jobs\JobPosting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JobPostingController extends Controller
{

    public function index()
    {
        $jobPostings = JobPosting::orderBy('created_at', 'desc')->with(['job_requisition'])->get();
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
