<?php

namespace App\Http\Controllers\API\Jobs;

use App\Http\Controllers\Controller;
use App\Models\Account\AccountAccess;
use App\Models\Account\AccountEmployee;
use App\Models\Jobs\JobPosition;
use App\Models\Jobs\JobPosting;
use App\Models\Jobs\JobRequisition;
use App\Models\Jobs\JobRequisitionLog;
use App\Models\User;
use App\Notifications\JobRequisitionNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Notification;

class JobRequisitionController extends Controller
{
    // juring approval
    // create send to site director and the status is pending
    // pending send to Recruitment Director and the status is In Progress
    // In Progress send to Recruitment Staff 
    // The Staff will Create Job Posting

    public function get_job_requisitions_by_user(Request $request)
    {
        $search = $request->query('search');
        $status = $request->query('status');
        $userId = Auth::id();

        // 1. Create a reusable closure to group the user access logic safely.
        // This generates: WHERE (user_id = ? OR recruiter = ? OR ...)
        $userAccessScope = function ($query) use ($userId) {
            $query->where('user_id', $userId)
                ->orWhere('recruiter_id', $userId)
                ->orWhere('approver1_id', $userId)
                ->orWhere('approver2_id', $userId)
                ->orWhere('approver3_id', $userId);
        };

        // 2. Get total count using the scope
        $totalRequisitions = JobRequisition::where($userAccessScope)->count();

        // 3. Get status counts using the scope
        $statusCounts = JobRequisition::where($userAccessScope)
            ->whereIn('status', ['Pending', 'Final Approved', 'In Progress', 'Declined'])
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $stats = [
            'total'       => $totalRequisitions,
            'pending'     => $statusCounts->get('Pending', 0),
            'approved'    => $statusCounts->get('Final Approved', 0),
            'in_progress' => $statusCounts->get('In Progress', 0),
            'declined'    => $statusCounts->get('Declined', 0),
        ];

        // 4. Fetch Requisitions using the scope and search filters
        $jobRequisitions = JobRequisition::where($userAccessScope)
            ->with(['department', 'location', 'logs', 'user', 'job_posting', 'account', 'recruiter', 'approver1', 'approver2', 'approver3'])
            ->when($search, function ($q) use ($search) {
                // Keep this search block grouped so it uses 'AND (search conditions)'
                $q->where(function ($query) use ($search) {
                    $query->where('title', 'LIKE', "%{$search}%")
                        ->orWhere('status', 'LIKE', "%{$search}%")
                        ->orWhereHas('department', function ($depQuery) use ($search) {
                            $depQuery->where('name', 'LIKE', "%{$search}%");
                        })
                        ->orWhereHas('location', function ($locQuery) use ($search) {
                            $locQuery->where('name', 'LIKE', "%{$search}%");
                        });
                });
            })
            ->when($status, function ($q) use ($status) {
                $q->where('status', $status);
            })
            ->orderBy('id', 'desc')
            ->get();

        $users = User::where('role', 1)->get();

        return response()->json([
            'status' => 'success',
            'stats'  => $stats,
            'data'   => $jobRequisitions,
            'users'  => [
                'users' => $users,
            ]
        ]);
    }

    public function approve_job_requisition(Request $request)
    {

        $auth = Auth::user()->load(['account_employee']);
        $jobRequisition = JobRequisition::findOrFail($request->id);
        $transitions = [
            'Pending'     => ['In Progress', 'Director'],
            'In Progress' => ['Director Approved', 'Recruitment Manager'],
            'Director Approved' => ['Final Approved', 'Recruitment Staff'],
        ];
        if (isset($transitions[$request->status])) {
            [$nextStatus, $position] = $transitions[$request->status];
            if ($position == 'Director') {
                $account = AccountEmployee::where('user_id', $jobRequisition->approver2_id)->first();
                if ($account && $account->eogs_email) {
                    $account->notify(new JobRequisitionNotification($jobRequisition));
                }
            } else if ($position == 'Recruitment Manager') {
                $account = AccountEmployee::where('user_id', $jobRequisition->approver3_id)->first();
                if ($account && $account->eogs_email) {
                    $account->notify(new JobRequisitionNotification($jobRequisition));
                }
            } else {
                foreach ($request->interviewers as $key => $interviewer) {
                    if ($interviewer) {
                        $account_employee = AccountEmployee::where('user_id', $interviewer)->first();
                        if ($account_employee) {
                            $account_employee->notify(new JobRequisitionNotification($jobRequisition));
                        }
                    }
                }
                $jobRequisition->update(['interviewers' => $request->interviewers]);
                JobPosting::create([
                    'job_requisition_id' => $jobRequisition->id,
                    'user_id' => $auth->id,
                    'target_audience' => $jobRequisition->target_audience,
                    'status' => 'Active',
                ]);
            }

            $jobRequisition->update(['status' => $nextStatus]);
            JobRequisitionLog::create([
                'job_requisitions_id' => $request->id,
                'user_id' => $auth->id,
                'notes' => "The " . $jobRequisition->title . ' position is ' . $nextStatus,
            ]);
        } else {
            $jobRequisition->update(['status' => 'Declined']);
            JobRequisitionLog::create([
                'job_requisitions_id' => $request->id,
                'user_id' => $auth->id,
                'notes' => "The " . $jobRequisition->title . ' position is Declined',
            ]);
        }

        return response()->json([
            'message' => 'Requisition updated successfully',
            'status'  => 'success',
        ]);
    }
    public function index(Request $request)
    {
        $search = $request->query('search');
        $status = $request->query('status');

        // 1. Create a base query that filters out expired requisitions at the database level
        $unexpiredQuery = JobRequisition::where(function ($query) {
            $query->whereNull('created_at') // Retain records with no creation date
                ->orWhere(function ($q) {
                    $q->where(function ($sub) {
                        $sub->whereIn(DB::raw('LOWER(position_level)'), ['agent', 'rank and file'])
                            ->where('created_at', '>=', Carbon::now()->subWeeks(3));
                    })
                        ->orWhere(function ($sub) {
                            $sub->where(DB::raw('LOWER(position_level)'), 'supervisor')
                                ->where('created_at', '>=', Carbon::now()->subWeeks(5));
                        })
                        ->orWhere(function ($sub) {
                            $sub->where(DB::raw('LOWER(position_level)'), 'manager')
                                ->where('created_at', '>=', Carbon::now()->subMonths(2));
                        })
                        ->orWhere(function ($sub) {
                            $sub->whereIn(DB::raw('LOWER(position_level)'), ['director', 'executive'])
                                ->where('created_at', '>=', Carbon::now()->subMonths(3));
                        })
                        ->orWhere(function ($sub) {
                            // Default fallback: keep if level doesn't match above, or is null
                            $sub->whereNotIn(DB::raw('LOWER(position_level)'), [
                                'agent',
                                'rank and file',
                                'supervisor',
                                'manager',
                                'director',
                                'executive'
                            ])->orWhereNull('position_level');
                        });
                });
        });

        // 2. Calculate stats using cloned instances of the base query (so we don't mutate it)
        $stats = [
            'total'       => (clone $unexpiredQuery)->count(),
            'pending'     => (clone $unexpiredQuery)->where('status', 'Pending')->count(),
            'approved'    => (clone $unexpiredQuery)->where('status', 'Final Approved')->count(),
            'in_progress' => (clone $unexpiredQuery)->where('status', 'In Progress')->count(),
            'declined'    => (clone $unexpiredQuery)->where('status', 'Declined')->count(),
        ];

        // 3. Build the query for the table (Filtered Data)
        $nonExpiredRequisitions = (clone $unexpiredQuery)
            ->with([
                'department',
                'location',
                'logs',
                'user',
                'job_posting',
                'account',
                'recruiter',
                'approver1',
                'approver2',
                'approver3'
            ])
            ->when($search, function ($q) use ($search) {
                $q->where(function ($subQuery) use ($search) {
                    $subQuery->where('title', 'LIKE', "%{$search}%")
                        ->orWhere('status', 'LIKE', "%{$search}%")
                        ->orWhereHas('department', function ($userQuery) use ($search) {
                            $userQuery->where('name', 'LIKE', "%{$search}%");
                        })
                        ->orWhereHas('location', function ($userQuery) use ($search) {
                            $userQuery->where('name', 'LIKE', "%{$search}%");
                        });
                });
            })
            ->when($status, function ($q) use ($status) {
                $q->where('status', $status);
            })
            ->orderBy('id', 'desc')
            ->get();

        $users = User::where('role', 1)->get();
        $access = AccountAccess::where('type', 'Job Requisition Approval')->get();

        return response()->json([
            'status' => 'success',
            'stats'  => $stats,
            'data'   => $nonExpiredRequisitions,
            'users'  => [
                'users'  => $users,
                'access' => $access
            ]
        ]);
    }
    public function store(Request $request)
    {
        $auth = Auth::user()->load(['account_employee']);
        $jobRequisition = JobRequisition::create([
            ...$request->all(),
            'user_id' =>  $auth->id,
        ]);

        $jr = JobRequisition::where('title', $request->title)->where('type', 'New Position')->first();
        if ($jr) {
            $jr->update([
                'qualifications' => $request->qualifications,
                'responsibilities' => $request->responsibilities,
            ]);
        }

        $account = AccountEmployee::where('user_id', $request->approver1_id)->first();

        JobPosition::firstOrCreate(
            ['title' => $request->title],
            ['department_id' => $request->department_id]
        );
        if ($account && $account->eogs_email) {
            $account->notify(new JobRequisitionNotification($jobRequisition));
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Job requisition created successfully',
            'data' => $jobRequisition
        ], 200);
    }

    public function show($id)
    {
        $jobRequisition = JobRequisition::with(['department', 'location', 'logs'])->find($id);

        if (!$jobRequisition) {
            return response()->json([
                'status' => 'error',
                'message' => 'Job requisition not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $jobRequisition
        ]);
    }

    public function update(Request $request, $id)
    {
        $jobRequisition = JobRequisition::find($id);

        if (!$jobRequisition) {
            return response()->json([
                'status' => 'error',
                'message' => 'Job requisition not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'position_type' => 'sometimes|string|in:new,existing',
            'position_title' => 'sometimes|string|max:255',
            'department' => 'sometimes|string|max:255',
            'location' => 'sometimes|string|max:255',
            'employment_type' => 'sometimes|string|in:full-time,part-time,contract,temporary',
            'number_of_positions' => 'sometimes|integer|min:1',
            'priority' => 'sometimes|string|in:low,medium,high,urgent',
            'salary_range' => 'sometimes|string|max:255',
            'target_start_date' => 'sometimes|date',
            'interviewer' => 'sometimes|string|max:255',
            'sub_interviewer' => 'sometimes|string|max:255',
            'interview_date' => 'sometimes|date',
            'interview_time' => 'sometimes|string|max:255',
            'justification_for_position' => 'sometimes|string',
            'required_qualifications' => 'sometimes|string',
            'key_responsibilities' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $jobRequisition->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Job requisition updated successfully',
            'data' => $jobRequisition
        ]);
    }

    public function destroy($id)
    {
        $jobRequisition = JobRequisition::find($id);

        if (!$jobRequisition) {
            return response()->json([
                'status' => 'error',
                'message' => 'Job requisition not found'
            ], 404);
        }

        $jobRequisition->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Job requisition deleted successfully'
        ]);
    }
}
