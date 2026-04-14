<?php

namespace App\Http\Controllers\API\Jobs;

use App\Http\Controllers\Controller;
use App\Models\Account\AccountAccess;
use App\Models\Account\AccountEmployee;
use App\Models\Jobs\JobPosition;
use App\Models\Jobs\JobRequisition;
use App\Models\Jobs\JobRequisitionLog;
use App\Models\User;
use App\Notifications\JobRequisitionNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Notification;

class JobRequisitionController extends Controller
{
    // juring approval
    // create send to site director and the status is pending
    // pending send to Recruitment Director and the status is In Progress
    // In Progress send to Recruitment Staff 
    // The Staff will Create Job Posting

    public function approve_job_requisition(Request $request)
    {

        $auth = Auth::user()->load(['account_employee']);
        $jobRequisition = JobRequisition::findOrFail($request->id);
        $transitions = [
            'Pending'     => ['In Progress', 2],
            'In Progress' => ['Approved',    'Recruitment Staff'],
        ];

        if (isset($transitions[$request->status])) {
            [$nextStatus, $order] = $transitions[$request->status];
            if ($order == 2) {
                $account = AccountAccess::where([
                    ['order', '=', $order],
                    ['type', '=', 'Job Requisition Approval']
                ])->whereHas('user.account_employee', function ($query) use ($auth) {
                    $query->where('location_id', $auth['account_employee']->location_id);
                })->with(['user'])->first();

                if ($account->user['account_employee'] && $account->user['account_employee']['eogs_email']) {
                    $account->user['account_employee']->notify(new JobRequisitionNotification($jobRequisition));
                }
            } else {
                if ($request->recruiter_id) {
                    $account_employee = AccountEmployee::where('user_id', $request->recruiter_id)->first();
                    if ($account_employee) {
                        $jobRequisition->update(['recruiter_id' => $request->recruiter_id]);
                        $account_employee->notify(new JobRequisitionNotification($jobRequisition));
                    }
                }
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

        $stats = [
            'total'       => JobRequisition::count(),
            'pending'     => JobRequisition::where('status', 'Pending')->count(),
            'approved'    => JobRequisition::where('status', 'Approved')->count(),
            'in_progress' => JobRequisition::where('status', 'In Progress')->count(),
            'declined'    => JobRequisition::where('status', 'Declined')->count(),
        ];

        // 2. Build the query for the table (Filtered Data)
        $jobRequisitions = JobRequisition::with(['department', 'location', 'logs', 'user', 'job_posting', 'account'])
            ->when($search, function ($q) use ($search) {
                // Use a nested where to group the 'OR' logic
                $q->where(function ($subQuery) use ($search) {
                    $subQuery->where('title', 'LIKE', "%{$search}%")
                        ->orWhere('status', 'LIKE', "%{$search}%");
                });
                $q->orWhereHas('department', function ($userQuery) use ($search) {
                    $userQuery->where('name', 'LIKE', "%{$search}%");
                });
                $q->orWhereHas('location', function ($userQuery) use ($search) {
                    $userQuery->where('name', 'LIKE', "%{$search}%");
                });
            })
            ->orderBy('id', 'desc')
            ->get();

        $users = User::where('role', 1)->get();
        $access = AccountAccess::where('type', 'Job Requisition Approval')->get();

        return response()->json([
            'status' => 'success',
            'stats'  => $stats,
            'data'   => $jobRequisitions,
            'users' => [
                'users' => $users,
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

        $account = AccountAccess::where([
            ['order', '=', 1],
            ['type', '=', 'Job Requisition Approval']
        ])->whereHas('user.account_employee', function ($query) use ($auth) {
            $query->where('location_id', $auth['account_employee']->location_id);
        })->with(['user'])->first();

        JobPosition::firstOrCreate(
            ['title' => $request->title],
            ['department_id' => $request->department_id]
        );

        if ($account->user['account_employee'] && $account->user['account_employee']['eogs_email']) {
            $account->user['account_employee']->notify(new JobRequisitionNotification($jobRequisition));
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
