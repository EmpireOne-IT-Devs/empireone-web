<?php
namespace App\Http\Controllers\API\Jobs;
use App\Http\Controllers\Controller;

use App\Models\Jobs\JobPosting;
use Illuminate\Http\Request;

class JobPostingController extends Controller
{

    public function index()
    {
        $jobPostings = JobPosting::orderBy('created_at', 'desc')->get();
        return response()->json($jobPostings);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'employment_type' => 'required|in:full-time,part-time,contract,temporary,internship',
            'salary' => 'nullable|numeric',
            'status' => 'required|string|max:255',
            'application_deadline' => 'nullable|date',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'experience_required' => 'nullable|string|max:255',
            'education_required' => 'nullable|string|max:255',
        ]);

        $jobPosting = JobPosting::create($validatedData);

        return response()->json([
            'message' => 'Job posting created successfully!',
            'job_posting' => $jobPosting
        ], 201);
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
