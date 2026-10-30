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

    public function get_corrective_actions_specific_leader(Request $request)
    {
        // Initialize the query builder using ::query() instead of ::get()
        $query = PMCorrectiveAction::query();
        $query->with(['employee', 'manager', 'supervisor']);

        // If 'all' is not true, filter by the logged-in user
        if (!$request->boolean('all')) {
            $query->where('created_by', Auth::id());
        }

        // Filter by search term across first_name and last_name
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%");
            });
        }

        // Eager load relationships before running paginate()
        $reaches = $query->orderBy('id', 'desc')->paginate($request->input('per_page', 10));

        return response()->json($reaches, 200);
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
                $mail->send(new CorrectiveActionNotificationApprovalMail($correctiveAction, 'Pending Final Sanction Approval'));
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
                $mail->send(new CorrectiveActionNotificationApprovalMail($correctiveAction, 'You Have A Pending Explanation', true));
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
                $mail->send(new CorrectiveActionNotificationApprovalMail($correctiveAction, 'You Have A Pending Commitment', true));
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

    public function get_ai_cocd(Request $request, CocdDetectorService $cocdDetector)
    {
        $validated = $request->validate([
            'description_of_infraction' => ['required', 'string', 'min:5'],
        ]);

        // Use detectSections (plural) or the alias method
        $cocdAnalysis = $cocdDetector->detectSections(
            $validated['description_of_infraction']
        );

        // dd($cocdAnalysis); // Uncomment if inspecting locally

        return response()->json($cocdAnalysis, 200);
    }
    public function store(Request $request)
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
            'code_of_discipline_section'  => ['nullable'],
        ]);


        // 2. Persist Corrective Action
        $correctiveAction = PMCorrectiveAction::create([
            ...$validated,
            'hr_user_id'       => 58,
            'created_by' => Auth::id(),
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
            $mail->send(new CorrectiveActionNotificationApprovalMail($correctiveAction, 'Corrective Action Approval'));
        }

        return response()->json([
            'success' => true,
            'message' => 'Corrective action created and email queued successfully.',
            'data'    => $correctiveAction,
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
