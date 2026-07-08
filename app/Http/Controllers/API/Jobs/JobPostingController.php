<?php

namespace App\Http\Controllers\API\Jobs;

use App\Http\Controllers\Controller;

use App\Models\Jobs\JobApplicantSchedule;
use App\Models\Jobs\JobApplication;
use App\Models\Jobs\JobOffer;
use App\Models\Jobs\JobPosting;
use App\Models\Jobs\JobRequisition;
use App\Models\Jobs\JobRequisitionLog;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JobPostingController extends Controller
{

    public function dashboard_stats()
    {
        $startOfWeek = Carbon::now()->startOfWeek();

        $activePostings = JobPosting::where('status', 'Active')->count();
        $newPostingsThisWeek = JobPosting::where('status', 'Active')
            ->where('created_at', '>=', $startOfWeek)->count();

        $totalApplicants = JobApplication::count();
        $newApplicantsThisWeek = JobApplication::where('created_at', '>=', $startOfWeek)->count();

        $interviewsScheduled = JobApplicantSchedule::count();
        $interviewsThisWeek = JobApplicantSchedule::where('created_at', '>=', $startOfWeek)->count();

        $totalRequisitions = JobRequisition::count();
        $newRequisitionsThisWeek = JobRequisition::where('created_at', '>=', $startOfWeek)->count();

        return response()->json([
            'active_postings' => $activePostings,
            'new_postings_this_week' => $newPostingsThisWeek,
            'total_applicants' => $totalApplicants,
            'new_applicants_this_week' => $newApplicantsThisWeek,
            'interviews_scheduled' => $interviewsScheduled,
            'interviews_this_week' => $interviewsThisWeek,
            'total_requisitions' => $totalRequisitions,
            'new_requisitions_this_week' => $newRequisitionsThisWeek,
        ]);
    }

    public function recent_activity()
    {
        $activities = collect();

        // New applications
        JobApplication::with(['applicant', 'job_posting.job_requisition'])
            ->latest()->limit(10)->get()
            ->each(function ($item) use (&$activities) {
                $title = $item->job_posting?->job_requisition?->title ?? 'a position';
                $activities->push([
                    'type'       => 'application',
                    'variant'    => 'primary',
                    'label'      => "New application for {$title}",
                    'user'       => $item->applicant?->name ?? 'Unknown',
                    'created_at' => $item->created_at,
                ]);
            });

        // Interviews scheduled
        JobApplicantSchedule::with(['application.applicant', 'application.job_posting.job_requisition'])
            ->latest()->limit(10)->get()
            ->each(function ($item) use (&$activities) {
                $title = $item->application?->job_posting?->job_requisition?->title ?? 'a position';
                $activities->push([
                    'type'       => 'schedule',
                    'variant'    => 'primary',
                    'label'      => "Interview scheduled for {$title}",
                    'user'       => $item->application?->applicant?->name ?? 'Unknown',
                    'created_at' => $item->created_at,
                ]);
            });

        // New job postings
        JobPosting::with(['job_requisition', 'applicant'])
            ->latest()->limit(10)->get()
            ->each(function ($item) use (&$activities) {
                $title = $item->job_requisition?->title ?? 'a position';
                $activities->push([
                    'type'       => 'posting',
                    'variant'    => 'success',
                    'label'      => "New job posting created: {$title}",
                    'user'       => $item->applicant?->name ?? 'System',
                    'created_at' => $item->created_at,
                ]);
            });

        // Requisition logs
        JobRequisitionLog::with(['user'])
            ->latest()->limit(10)->get()
            ->each(function ($item) use (&$activities) {
                $activities->push([
                    'type'       => 'log',
                    'variant'    => 'warning',
                    'label'      => $item->notes ?? 'Requisition updated',
                    'user'       => $item->user?->name ?? 'Unknown',
                    'created_at' => $item->created_at,
                ]);
            });

        $result = $activities
            ->sortByDesc('created_at')
            ->take(15)
            ->values()
            ->map(function ($item) {
                return array_merge($item, [
                    'time' => Carbon::parse($item['created_at'])->diffForHumans(),
                ]);
            });

        return response()->json($result);
    }

    public function top_performing_jobs()
    {
        $postings = JobPosting::withCount('applications')
            ->with(['job_requisition'])
            ->orderByDesc('applications_count')
            ->limit(10)
            ->get()
            ->map(function ($posting) {
                $applicationIds = $posting->applications()->pluck('id');
                $interviewCount = JobApplicantSchedule::whereIn('application_id', $applicationIds)->count();

                return [
                    'title'      => $posting->job_requisition?->title ?? 'Untitled',
                    'applicants' => $posting->applications_count,
                    'interviews' => $interviewCount,
                    'status'     => $posting->status,
                    'variant'    => $posting->status === 'Active' ? 'success' : 'secondary',
                ];
            });

        return response()->json($postings);
    }

    public function index()
    {
        $user = Auth::user(); // Administrator
        $query = JobPosting::where('status', 'Active')->with(['job_requisition', 'applications', 'applicant']);
        // if ($user && ($user->role == 2 || $user->role == 1)) { // Employee 
        //     $query->whereIn('target_audience', ['Internal', 'Both']);
        // } elseif ($user && $user->role == 3) { // Applicant
        //     $query->whereIn('target_audience', ['External', 'Both']);
        // }
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
