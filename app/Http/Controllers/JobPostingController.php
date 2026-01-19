<?php

namespace App\Http\Controllers;

use App\Models\JobPosting;
use Illuminate\Http\Request;

class JobPostingController extends Controller
{
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
}
