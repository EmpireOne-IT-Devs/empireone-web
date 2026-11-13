<?php

namespace App\Http\Controllers;

use App\Models\PM\PMPip;
use App\Http\Controllers\Controller;
use App\Mail\PipEnrollmentMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class PMPipController extends Controller
{
    public function acknowledge(Request $request, PmPip $pmPip)
    {
     

        $pmPip->update(['status' => 'ACKNOWLEDGED']);
        return redirect(env('FRONTEND_URL') . '/human-resources/pip-success-page');
    }
    public function index(Request $request)
    {
        try {
            $query = PmPip::query()->with(['account']);

            // Search functionality
            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('employee_id', 'like', "%{$search}%")
                        ->orWhere('employee_email', 'like', "%{$search}%");
                });
            }

            // Optional: Filter by status
            if ($request->has('status') && !empty($request->status)) {
                $query->where('status', $request->status);
            }

            // Optional: Filter by specific employee_id
            if ($request->has('employee_id') && !empty($request->employee_id)) {
                $query->where('employee_id', $request->employee_id);
            }

            // Order by newest first and paginate
            $pips = $query->latest()->paginate($request->input('per_page', 10));

            return response()->json([
                'success' => true,
                'data'    => $pips
            ], 200);
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
                'user_id'              => 'nullable|integer',
                'employee_id'          => 'required|string',
                'first_name'           => 'required|string',
                'last_name'            => 'nullable|string',
                'position'             => 'nullable|string',
                'account_id'             => 'nullable|string',
                
                'employee_email'       => 'nullable|email',

                'supervisor_id'        => 'nullable',
                'supervisor_user_id'   => 'nullable|integer',
                'supervisor_name'      => 'nullable|string',
                'supervisor_email'     => 'nullable|email',

                'manager_id'           => 'nullable',
                'manager_user_id'      => 'nullable|integer',
                'manager_name'         => 'nullable|string',
                'manager_email'        => 'nullable|email',

                'pip_start_date'       => 'required|date',
                'pip_end_date'         => 'required|date',
                'pip_cycle'            => 'required|string',

                'history_kpi'          => 'required|string',
                'history_target'       => 'required|string',
                'history_actual'       => 'required|string',

                'root_cause_analysis'  => 'required|string',

                'action_kpi_goal'      => 'required|string',
                'action_target_action' => 'required|string',
                'action_date'          => 'required|date',
            ]);

            // Assign the currently authenticated user as the creator
            $validatedData['created_by'] = Auth::id();

            // Set default status
            $validatedData['status'] = 'Pending';

            $pip = PmPip::create($validatedData);

            // if (!empty($pip->employee_email)) {
            //     Mail::to($pip->employee_email)->send(new PipEnrollmentMail($pip, false));
            // }

            // // Optional: Send CC to Supervisor
            // if (!empty($pip->supervisor_email)) {
            //     Mail::to($pip->supervisor_email)->send(new PipEnrollmentMail($pip, true));
            // }

            if (!empty($pip->supervisor_email)) {
                $ccRecipients = array_values(array_filter([
                    // $pip->employee_email,
                    // $pip->supervisor_email,
                    // 'anthony@empireonegroup.com',
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
    public function show(PMPip $pMPip)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PMPip $pMPip)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PMPip $pMPip)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PMPip $pMPip)
    {
        //
    }
}
