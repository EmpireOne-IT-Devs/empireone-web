<?php

namespace App\Http\Controllers;

use App\Mail\CorrectiveActionNotificationApprovalMail;
use App\Models\PM\PMCorrectiveAction;
use App\Services\CocdDetectorService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class PMCorrectiveActionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    public function sign_corrective_action(Request $request)
    {
        $request->validate([
            'id'   => 'required|integer|exists:p_m_corrective_actions,id',
            'role' => 'required|string',
        ]);

        $correctiveAction = PMCorrectiveAction::findOrFail($request->id);

        switch ($request->role) {
            case 'hr':
            case 'hr_action':
                $correctiveAction->is_hr_acknowledge = 1;
                break;
            case 'supervisor':
            case 'supervisor_action':
                $correctiveAction->is_supervisor_acknowledge = 1;
                break;
            case 'manager':
            case 'manager_action':

                $correctiveAction->is_manager_acknowledge = 1;
                break;
            case 'employee_nte':
                $correctiveAction->is_employee_acknowledge = 1;
                $correctiveAction->nte_received_at = now()->toDateString();
                break;

            case 'employee_explanation':
                $correctiveAction->employee_explanation = $request->employee_explanation;
                $correctiveAction->employee_explanation_at = now()->toDateString();
                $correctiveAction->status = 'PENDING FINAL SANCTION';

                $ccRecipients = array_values(array_filter([
                    $correctiveAction->supervisor_email,
                    $correctiveAction->manager_email,
                    'anthony@empireonegroup.com'
                ], fn($email) => filter_var($email, FILTER_VALIDATE_EMAIL)));

                // Target recipient
                $mail = Mail::to('webdev@empireonegroup.com');
                // Attach CC if available
                if (!empty($ccRecipients)) {
                    $mail->cc($ccRecipients);
                }
                // Send synchronously
                $mail->send(new CorrectiveActionNotificationApprovalMail($correctiveAction));
                break;
            case 'save_sanction':
                $correctiveAction->final_sanction = $request->final_sanction;
                $correctiveAction->status = 'PENDING EMPLOYEE COMMITMENT';
                break;
            case 'employee_final_commitment':
                $correctiveAction->employee_commitment = $request->employee_commitment;
                $correctiveAction->status = 'COMPLETED';
                break;
            case 'is_supervisor_sanction_acknowledge' || 'is_supervisor_sanction_acknowledge' || 'is_hr_sanction_acknowledge':
                $correctiveAction[$request->role] = 1;
                break;
            default:
                return response()->json(['message' => 'Invalid signing role.'], 422);
        }
        if (
            $correctiveAction->is_hr_acknowledge &&
            $correctiveAction->is_supervisor_acknowledge &&
            $correctiveAction->is_manager_acknowledge &&
            !$correctiveAction->is_employee_acknowledge
        ) {
            $correctiveAction->status = 'PENDING EMPLOYEE EXPLANATION';

            if (!empty($correctiveAction->eogs_email)) {
                $mail = Mail::to($correctiveAction->eogs_email);
                $mail->send(new CorrectiveActionNotificationApprovalMail($correctiveAction));
            }
        }
        $correctiveAction->save();
        $correctiveAction->load(['employee', 'hr', 'supervisor', 'manager']);
        if (
            $correctiveAction->is_hr_sanction_acknowledge &&
            $correctiveAction->is_supervisor_sanction_acknowledge &&
            $correctiveAction->is_manager_sanction_acknowledge &&
            !$correctiveAction->employee_commitment
        ) {
            if (!empty($correctiveAction->eogs_email)) {
                $mail = Mail::to($correctiveAction->eogs_email);
                $mail->send(new CorrectiveActionNotificationApprovalMail($correctiveAction));
            }
        }
        return response()->json([
            'success' => true,
            'message' => 'Corrective action signed successfully.',
            'data'    => $correctiveAction,
        ], 200);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, CocdDetectorService $cocdDetector)
    {
        $validated = $request->validate([
            'employee_id'                 => ['required', 'string', 'max:100'],
            'first_name'                  => ['nullable', 'string', 'max:255'],
            'last_name'                   => ['nullable', 'string', 'max:255'],
            'eogs_email'                  => ['nullable', 'email', 'max:255'],
            'department_id'               => ['nullable', 'integer'],
            'supervisor_id'               => ['nullable', 'string'],
            'user_id'                     => ['nullable'],
            'supervisor_user_id'          => ['nullable'],
            'manager_user_id'             => ['nullable'],
            'supervisor_first_name'       => ['nullable', 'string', 'max:255'],
            'supervisor_last_name'        => ['nullable', 'string', 'max:255'],
            'supervisor_email'            => ['nullable', 'email', 'max:255'],
            'manager_id'                  => ['nullable', 'string'],
            'manager_first_name'          => ['nullable', 'string', 'max:255'],
            'manager_last_name'           => ['nullable', 'string', 'max:255'],
            'manager_email'               => ['nullable', 'email', 'max:255'],
            'category'                    => ['required', 'string'],
            'date_of_occurrence'          => ['required', 'date'],
            'description_of_infraction'   => ['required', 'string'],
            'evidence_drive_url'          => ['nullable', 'url', 'max:2048'],
            // Optional override: if the user manually passes one, prioritize it
            'code_of_discipline_section'  => ['nullable', 'string', 'max:255'],
        ]);
        // 1. Detect COCD Section if not explicitly provided
        $cocdAnalysis = [];
        if (empty($validated['code_of_discipline_section'])) {
            $cocdAnalysis = $cocdDetector->detectSection(
                $validated['description_of_infraction'],
            );

            $validated['code_of_discipline_section'] = $cocdAnalysis ?? '';
        }

        // 2. Persist Corrective Action
        $correctiveAction = PMCorrectiveAction::create([
            ...$validated,
            'ai_analysis_meta' => !empty($cocdAnalysis) ? json_encode($cocdAnalysis) : null,
            'hr_user_id'       => 58,
            'hr_id'            => '26011207',
            'hr_first_name'    => 'Anthony',
            'hr_last_name'     => 'Aragon',
            'hr_email'         => 'anthony@empireonegroup.com',
        ]);

        // 3. Dispatch Emails
        if (!empty($correctiveAction->eogs_email)) {
            $ccRecipients = array_values(array_filter([
                $correctiveAction->supervisor_email,
                $correctiveAction->manager_email,
                'anthony@empireonegroup.com',
            ], fn($email) => filter_var($email, FILTER_VALIDATE_EMAIL)));

            $mail = Mail::to('webdev@empireonegroup.com');
            if (!empty($ccRecipients)) {
                $mail->cc($ccRecipients);
            }
            $mail->send(new CorrectiveActionNotificationApprovalMail($correctiveAction));
        }

        return response()->json([
            'success' => true,
            'message' => 'Corrective action created and email queued successfully.',
            'data'    => $correctiveAction,
            'cocd_detection' => $cocdAnalysis,
        ], 200);
    }
    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $correctiveAction = PMCorrectiveAction::where('id', $id)->with(['employee', 'supervisor', 'manager', 'hr'])->first();
        return response()->json($correctiveAction, 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PMCorrectiveAction $pMCorrectiveAction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PMCorrectiveAction $pMCorrectiveAction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PMCorrectiveAction $pMCorrectiveAction)
    {
        //
    }
}
