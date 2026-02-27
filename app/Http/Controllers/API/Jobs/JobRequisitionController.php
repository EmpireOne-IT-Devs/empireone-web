<?php

namespace App\Http\Controllers\API\Jobs;

use App\Http\Controllers\Controller;
use App\Models\Account\AccountEmployee;
use App\Models\Jobs\JobRequisition;
use App\Models\User;
use App\Notifications\JobRequisitionNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Notification;

class JobRequisitionController extends Controller
{
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
        $jobRequisitions = JobRequisition::with(['department', 'location', 'logs', 'user', 'job_posting'])
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

        return response()->json([
            'status' => 'success',
            'stats'  => $stats,
            'data'   => $jobRequisitions
        ]);
    }
    public function store(Request $request)
    {
        $auth = Auth::user();
        $jobRequisition = JobRequisition::create([
            ...$request->all(),
            'user_id' =>  $auth->id,
        ]);

        $approver = AccountEmployee::where('user_id', Auth::id())->first();
        if ($approver && $approver->eogs_email) {
            $approver->notify(new JobRequisitionNotification($jobRequisition));
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
