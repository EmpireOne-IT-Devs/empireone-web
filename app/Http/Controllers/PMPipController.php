<?php

namespace App\Http\Controllers;

use App\Models\PM\PMPip;
use App\Http\Controllers\Controller;
use App\Mail\PipEnrollmentMail;
use App\Models\ER\ERLeader;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class PMPipController extends Controller
{
    public function acknowledge(Request $request, PmPip $pmPip)
    {


        $pmPip->update(['status' => 'ACKNOWLEDGED']);
        return redirect(env('FRONTEND_URL') . '/human-resources/pip/2/acknowledge');
    }
    public function index(Request $request)
    {
        try {
            $authId = Auth::id();
            $leaderIds = ERLeader::where('user_id', $authId)->pluck('id');

            $query = PmPip::query()
                ->with(['account'])
                ->where(function ($q) use ($authId, $leaderIds) {
                    $q->where('created_by', $authId)
                        ->orWhere('supervisor_id', $authId)
                        ->orWhere('manager_id', $authId)
                        ->orWhere('supervisor_user_id', $authId)
                        ->orWhere('manager_user_id', $authId);

                    if ($leaderIds->isNotEmpty()) {
                        $q->orWhereIn('supervisor_id', $leaderIds)
                            ->orWhereIn('manager_id', $leaderIds);
                    }
                });

            // Search functionality
            $search = trim((string) $request->input('search', ''));
            if ($search !== '') {
                $escaped = addcslashes($search, '%_\\');
                $terms = preg_split('/\s+/', $escaped, -1, PREG_SPLIT_NO_EMPTY);

                $query->where(function ($q) use ($escaped, $terms) {
                    $q->where('employee_id', 'like', "%{$escaped}%")
                        ->orWhere('employee_email', 'like', "%{$escaped}%")
                        ->orWhere('first_name', 'like', "%{$escaped}%")
                        ->orWhere('last_name', 'like', "%{$escaped}%")
                        ->orWhere('supervisor_name', 'like', "%{$escaped}%")
                        ->orWhere('manager_name', 'like', "%{$escaped}%")
                        ->orWhereRaw(
                            "TRIM(CONCAT(COALESCE(first_name, ''), ' ', COALESCE(last_name, ''))) LIKE ?",
                            ["%{$escaped}%"]
                        )
                        ->orWhere(function ($nameQuery) use ($terms) {
                            foreach ($terms as $term) {
                                $nameQuery->where(function ($wordQuery) use ($term) {
                                    $wordQuery->where('first_name', 'like', "%{$term}%")
                                        ->orWhere('last_name', 'like', "%{$term}%");
                                });
                            }
                        });
                });
            }

            // Optional: Filter by status (case-insensitive, ignore 'all' / empty)
            $status = trim((string) $request->input('status', ''));
            if ($status !== '' && strtolower($status) !== 'all') {
                $query->whereRaw('LOWER(status) = ?', [strtolower($status)]);
            }

            // Optional: Filter by specific employee_id
            if ($request->filled('employee_id')) {
                $query->where('employee_id', $request->input('employee_id'));
            }

            $perPage = max(1, min((int) $request->input('per_page', 10), 100));
            $pips = $query->latest()->paginate($perPage);

            return response()->json($pips, 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve PIP records.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'user_id'              => 'nullable',
                'employee_id'          => 'nullable',
                'first_name'           => 'nullable',
                'last_name'            => 'nullable',
                'position'             => 'nullable',
                'account_id'             => 'nullable',

                'employee_email'       => 'nullable',

                'supervisor_id'        => 'nullable',
                'supervisor_user_id'   => 'nullable',
                'supervisor_name'      => 'nullable',
                'supervisor_email'     => 'nullable',

                'manager_id'           => 'nullable',
                'manager_user_id'      => 'nullable',
                'manager_name'         => 'nullable',
                'manager_email'        => 'nullable',

                'pip_start_date'       => 'nullable',
                'pip_end_date'         => 'nullable',
                'pip_cycle'            => 'nullable',

                'history_kpi'          => 'nullable',
                'history_target'       => 'nullable',
                'history_actual'       => 'nullable',

                'root_cause_analysis'  => 'nullable',

                'action_kpi_goal'      => 'nullable',
                'action_target_action' => 'nullable',
                'action_date'          => 'nullable',
            ]);

            // Assign the currently authenticated user as the creator
            $validatedData['created_by'] = Auth::id();

            // Set default status
            $validatedData['status'] = 'Pending';

            $pip = PmPip::create([
                ...$validatedData,
                'hr_user_id'       => 58,
                'hr_id'            => '26011207',
                'hr_first_name'    => 'Anthony',
                'hr_last_name'     => 'Aragon',
                'hr_email'         => 'anthony@empireonegroup.com',
            ]);


            // if (!empty($pip->employee_email)) {
            //     Mail::to($pip->employee_email)->send(new PipEnrollmentMail($pip, false));
            // }

            // // Optional: Send CC to Supervisor
            // if (!empty($pip->supervisor_email)) {
            //     Mail::to($pip->supervisor_email)->send(new PipEnrollmentMail($pip, true));
            // }

            if (!empty($pip->supervisor_email)) {
                $ccRecipients = array_values(array_filter([
                    $pip->supervisor_email,
                    'anthony@empireonegroup.com',
                    $pip->manager_email,
                ], fn($email) => filter_var($email, FILTER_VALIDATE_EMAIL)));

                $mail = Mail::to('webdev@empireonegroup.com');
                if (!empty($ccRecipients)) {
                    $mail->cc($ccRecipients);
                }
                $mail->send(new PipEnrollmentMail($pip, 'PIP Enrollment Approval'));
            }

            return response()->json([
                'success' => true,
                'message' => 'Performance Improvement Plan created successfully.',
                'data'    => $pip
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors'  => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create PIP.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {

        $pMPip = PMPip::where('id', $id)->with(['supervisor', 'manager', 'hr', 'employee'])->first();
        return response()->json($pMPip, 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PMPip $pMPip)
    {
        //
    }


    public function update(Request $request, $id)
    {
        $pMPip = PMPip::where('id', $id)->first();
        if (!$pMPip) {
            return response()->json(['message' => 'PIP record not found.'], 404);
        }

        $role = $request->input('role');

        // Expanded allowed flags matching your database schema & frontend roles
        $allowedFlags = [
            'is_employee_acknowledged',
            'is_hr_approved',
            'is_supervisor_approved',
            'is_manager_approved',

            'is_employee_final_acknowledged',
            'is_hr_final_approved',
            'is_supervisor_final_approved',
            'is_manager_final_approved',
            'is_operations_manager_final_approved'
        ];

        if (in_array($role, $allowedFlags)) {
            $pMPip->{$role} = 1;
        }
        // Fallback handlers for descriptive strings if any remain
        elseif ($role === 'employee_acknowledge') {
            $pMPip->is_employee_acknowledged = 1;
        } elseif ($role === 'hr_approve') {
            $pMPip->is_hr_approved = 1;
        } elseif ($role === 'supervisor_approve' || $role === 'manager_approve') {
            $pMPip->is_manager_approved = 1;
        }

        // Save action notes if present in request
        if ($request->has('action_notes')) {
            $pMPip->action_notes = $request->input('action_notes');
        }

        // Handle numeric is_passed (1 or 0)
        if ($request->has('is_passed')) {
            $pMPip->is_passed = (int) $request->input('is_passed');
        }

        // Handle sanction based on numeric is_passed value
        if ($request->has('sanction')) {
            $pMPip->sanction = ((int) $pMPip->is_passed === 1) ? null : $request->input('sanction');
        }

        // Check if all four final progress report approvals are complete
        $isFinalApproved = (
            (int) $pMPip->is_hr_final_approved === 1 &&
            (int) $pMPip->is_manager_final_approved === 1 &&
            (int) $pMPip->is_supervisor_final_approved === 1 &&
            (int) $pMPip->is_employee_final_acknowledged === 1
        );

        // Evaluate and update status progression automatically
        if ($isFinalApproved) {
            $pMPip->status = ((int) $pMPip->is_passed === 1) ? 'CLOSED - PASSED' : 'CLOSED - FAILED';
        } else {
            // Fallback to initial enrollment status progression if not fully closed yet
            if ($pMPip->is_employee_acknowledged == 1 && $pMPip->is_supervisor_final_approved == 0) {
                $pMPip->status = 'ACTIVE PIP';
            } elseif ($pMPip->is_manager_approved != 1 && $pMPip->is_supervisor_final_approved == 0) {
                $pMPip->status = 'PENDING MANAGER APPROVAL';
            } elseif ($pMPip->is_hr_approved != 1 && $pMPip->is_supervisor_final_approved == 0) {
                $pMPip->status = 'PENDING HR APPROVAL';
            } else {
                if ($pMPip->is_supervisor_final_approved == 0) {
                    $pMPip->status = 'AWAITING EMPLOYEE ACKNOWLEDGMENT';
                }
            }
        }



        if ($request->role == 'is_supervisor_final_approved') {
            $pMPip->status = 'PENDING FINAL ACKNOWLEDGMENT';
            $mail = Mail::to('webdev@empireonegroup.com');
            $ccRecipients = array_values(array_filter([
                $pMPip->supervisor_email,
                $pMPip->manager_email,
                $pMPip->hr_email,
                $pMPip->employee_email,
            ], fn($email) => filter_var($email, FILTER_VALIDATE_EMAIL)));
            $mail->send(new PipEnrollmentMail($pMPip, 'PIP Decision'));
        }

        $pMPip->save();
        // Check if current action was an HR or Manager initial approval, AND both are now approved
        $isApproverAction = in_array($role, ['is_hr_approved', 'is_manager_approved', 'hr_approve', 'supervisor_approve', 'manager_approve']);
        if ($isApproverAction && $pMPip->is_hr_approved == 1 && $pMPip->is_manager_approved == 1) {
            $ccRecipients = array_values(array_filter([
                $pMPip->employee_email,
            ], fn($email) => filter_var($email, FILTER_VALIDATE_EMAIL)));

            $mail = Mail::to('webdev@empireonegroup.com');
            if (!empty($ccRecipients)) {
                $mail->cc($ccRecipients);
            }
            $mail->send(new PipEnrollmentMail($pMPip, 'PIP Decision'));
        }

        if ($request->sanction == 'Recommended for Termination') {
            $mail = Mail::to('anthony@empireonegroup.com');
            $mail->send(new PipEnrollmentMail($pMPip, $request->sanction));
        }

        return response()->json([
            'message' => 'PIP record updated and approved successfully.',
            'pip' => $pMPip
        ], 200);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PMPip $pMPip)
    {
        //
    }
}
