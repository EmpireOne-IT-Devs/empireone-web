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

    public function get_erps()
    {
        $erps = JobApplication::whereNotNull('referral_id')
            ->whereNull('removed_by')
            ->with(['referral', 'applicant', 'employee'])
            ->paginate(10);
        return response()->json($erps, 200);
    }
    public function get_job_posting_by_location($id)
    {
        $user = Auth::user();

        $jobPostings = JobPosting::where('status', 'Active')
            ->with(['job_requisition', 'applications', 'applicant'])
            ->whereHas('job_requisition', function ($query) use ($id) {
                $query->where('location_id', $id);
            })
            ->whereIn('target_audience', ['External', 'Both'])
            ->orderBy('created_at', 'desc')
            ->get();

        // 1. Filter out expired job postings
        $activeJobPostings = $jobPostings->reject(function ($job) {
            if (!$job->created_at) {
                return false;
            }

            $level = strtolower($job->job_requisition->position_level ?? $job->position_level ?? '');
            $createdDate = Carbon::parse($job->created_at);

            $expiryDate = match ($level) {
                'agent', 'rank and file' => $createdDate->copy()->addWeeks(3),
                'supervisor'            => $createdDate->copy()->addWeeks(5),
                'manager'               => $createdDate->copy()->addMonths(2),
                'director', 'executive' => $createdDate->copy()->addMonths(3),
                default                 => null,
            };

            // Reject if current time is past the allowed duration
            return $expiryDate ? Carbon::now()->greaterThan($expiryDate) : false;
        });

        // 2. Map through non-expired results to append 'is_applied'
        $activeJobPostings->transform(function ($job) use ($user) {
            $job->is_applied = $user ? $job->applications->contains('user_id', $user->id) : false;

            return $job;
        });

        return response()->json($activeJobPostings->values(), 200);
    }
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

    public function index(Request $request)
    {
        $user = Auth::user()?->load('personal_information', 'account_employee');

        $query = JobPosting::where('status', 'Active')
            ->with(['job_requisition', 'applications', 'applicant']);

        // Determine the location ID: either from the request, or fallback to the user's profile
        $locationId = $request->location_id ?? $user?->account_employee?->location_id;
        // Apply the filter if we have a location ID from EITHER source
        if ($locationId) {
            $query->whereHas('job_requisition', function ($q) use ($locationId) {
                $q->where('location_id', $locationId);
            });
        }

        // CORRECTED IF STATEMENT:
        // Checks if user exists, if their department is NOT 1 or 2, and if their role is 1 or 2
        if ($user && in_array($user->account_employee?->department_id, [1, 2])) {
            $query->whereIn('target_audience', ['Internal', 'Both', 'External']);
        } else if ($user && in_array($user->role, [1, 2])) {
            // Standard Employees and Admins (Roles 1 & 2) see Internal and Both
            $query->whereIn('target_audience', ['Internal', 'Both']);
        } else {
            // Guests, External Applicants (Role 3), OR specific departments (1 & 2) see External and Both
            $query->whereIn('target_audience', ['External', 'Both']);
        }

        $jobPostings = $query->orderBy('created_at', 'desc')->get();

        // 2. Filter out expired job postings
        $activeJobPostings = $jobPostings->reject(function ($job) {
            if (!$job->created_at) {
                return false;
            }

            $level = strtolower($job->job_requisition->position_level ?? $job->position_level ?? '');
            $createdDate = Carbon::parse($job->created_at);

            $expiryDate = match ($level) {
                'agent', 'rank and file' => $createdDate->copy()->addWeeks(3),
                'supervisor'            => $createdDate->copy()->addWeeks(5),
                'manager'               => $createdDate->copy()->addMonths(2),
                'director', 'executive' => $createdDate->copy()->addMonths(3),
                default                 => null,
            };

            // Reject if current time is greater than the calculated expiry date
            return $expiryDate ? Carbon::now()->greaterThan($expiryDate) : false;
        });

        // 3. Map through non-expired results to append 'is_applied'
        $activeJobPostings->transform(function ($job) use ($user) {
            if ($user) {
                // Uses eager-loaded relation to avoid N+1 query issue
                $job->is_applied = $job->applications->contains('user_id', $user->id);
            } else {
                $job->is_applied = false;
            }

            return $job;
        });

        return response()->json($activeJobPostings->values());
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
