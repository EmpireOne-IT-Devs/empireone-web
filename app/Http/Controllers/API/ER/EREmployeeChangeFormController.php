<?php

namespace App\Http\Controllers\API\ER;

use App\Http\Controllers\Controller;
use App\Mail\ChangeFormEmail;
use App\Models\Account\AccountEmployee;
use App\Models\ER\EREmployeeChangeForm;
use App\Models\ER\ERLeader;
use App\Models\ER\ERSubordinate;
use App\Models\Jobs\JobPosting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\HttpFoundation\StreamedResponse;

class EREmployeeChangeFormController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function export_change_form(Request $request)
    {
        $status    = $request->input('status');
        $startDate = $request->input('start_date');
        $endDate   = $request->input('end_date');

        // 1. Base query
        $query = EREmployeeChangeForm::with([
            'employee.personal_information',
            'department_to',
            'account_to',
            'prepaired_by.personal_information',
        ]);

        // 2. Filter by status (handles case-insensitivity: 'Pending', 'Accepted', 'accepted')
        if (!empty($status)) {
            $query->whereRaw('LOWER(status) = ?', [strtolower(trim($status))]);
        }

        // 3. Filter by date range
        if (!empty($startDate) && !empty($endDate)) {
            $query->whereBetween('created_at', [
                $startDate . ' 00:00:00',
                $endDate . ' 23:59:59'
            ]);
        } elseif (!empty($startDate)) {
            $query->where('created_at', '>=', $startDate . ' 00:00:00');
        } elseif (!empty($endDate)) {
            $query->where('created_at', '<=', $endDate . ' 23:59:59');
        }

        $records = $query->orderBy('id', 'desc')->get();

        // 4. File download headers
        $filename = 'ecf_report_' . now()->format('Y_m_d_His') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        // 5. Stream output
        return new StreamedResponse(function () use ($records) {
            $file = fopen('php://output', 'w');
            fputs($file, "\xEF\xBB\xBF"); // UTF-8 BOM

            fputcsv($file, [
                'ECF ID',
                'Employee ID',
                'Employee Name',
                'Hire Date',
                'Effective Date',
                'Status',
                'Department (From)',
                'Account (From)',
                'Position (From)',
                'Reports To (From)',
                'Basic Pay (From)',
                'Allowances (From)',
                'Department (To)',
                'Account (To)',
                'Position (To)',
                'Reports To (To)',
                'Basic Pay (To)',
                'Allowances (To)',
                'Reason for Change',
                'Prepared By',
                'Created At'
            ]);

            foreach ($records as $item) {
                $empFirstName = $item->employee->personal_information->first_name ?? '';
                $empLastName  = $item->employee->personal_information->last_name ?? '';
                $employeeFullName = trim("{$empFirstName} {$empLastName}");

                $prepFirstName = $item->prepaired_by->personal_information->first_name ?? '';
                $prepLastName  = $item->prepaired_by->personal_information->last_name ?? '';
                $preparedByFullName = trim("{$prepFirstName} {$prepLastName}");

                $posFrom = trim(($item->info_position_from ?? '') . ($item->info_position_level_from ? " ({$item->info_position_level_from})" : ''));
                $posTo   = trim(($item->info_position_to ?? '') . ($item->info_position_level_to ? " ({$item->info_position_level_to})" : ''));

                $allowancesToText = '-';
                if (!empty($item->allowances) && is_array($item->allowances)) {
                    $formatted = array_map(function ($allowance) {
                        $type = $allowance['allowance_type'] ?? $allowance['name'] ?? 'Allowance';
                        $amount = isset($allowance['allowance']) ? '₱' . number_format($allowance['allowance'], 2) : ($allowance['amount'] ?? '');
                        return "{$type} - {$amount}";
                    }, $item->allowances);
                    $allowancesToText = implode(', ', $formatted);
                } elseif (!empty($item->info_allowances_to)) {
                    $allowancesToText = $item->info_allowances_to;
                }

                fputcsv($file, [
                    $item->id,
                    $item->employee_id ?? 'N/A',
                    $employeeFullName ?: 'N/A',
                    $item->hire_date ?? 'N/A',
                    $item->effective_date ?? 'N/A',
                    $item->status ?? 'N/A',
                    $item->info_department_from ?? 'N/A',
                    $item->info_account_from ?? 'N/A',
                    $posFrom ?: 'N/A',
                    $item->info_reporting_from ?? 'N/A',
                    $item->info_basic_pay_from ? '₱' . number_format((float)$item->info_basic_pay_from, 2) : '₱0.00',
                    $item->info_allowances_from ?? '-',
                    $item->department_to->name ?? $item->department ?? 'N/A',
                    $item->account_to->name ?? $item->account ?? 'N/A',
                    $posTo ?: 'N/A',
                    $item->info_reporting_to ?? $item->reporting_to ?? 'N/A',
                    $item->info_basic_pay_to ? '₱' . number_format((float)$item->info_basic_pay_to, 2) : '₱0.00',
                    $allowancesToText,
                    $item->reason_for_change ?? '-',
                    $preparedByFullName ?: 'N/A',
                    $item->created_at ? $item->created_at->format('Y-m-d H:i:s') : 'N/A',
                ]);
            }

            fclose($file);
        }, 200, $headers);
    }
    public function index(Request $request)
    {
        $locationId = $request->query('location_id');

        // 1. Initialize query with relationships
        $query = EREmployeeChangeForm::with(['employee', 'account_to', 'department_to']);

        // 2. Filter by location_id through the employee relationship if provided
        if ($locationId) {
            $query->whereHas('employee', function ($q) use ($locationId) {
                $q->where('location_id', $locationId);
            });
        }

        // 3. Paginate filtered or unfiltered results
        $ecfs = $query->orderBy('id', 'desc')->paginate(10);

        return response()->json($ecfs);
    }
    public function accept_employee_change_form(Request $request)
    {
        // 1. Fetch single model instance
        $ecf = EREmployeeChangeForm::findOrFail($request->employee_change_form_id);

        // 2. Calculate dynamic allowances total from incoming request (or $ecf->allowances)
        $allowancesList = $request->input('allowances', $ecf->allowances ?? []);
        $totalAllowancesTo = collect($allowancesList)->sum(function ($item) {
            return (float) ($item['amount_to'] ?? 0);
        });

        // 3. Prepare array to collect all target updates
        $updateData = [];

        if ($request->info_position_level_to && $request->info_position_level_to != $ecf->info_position_level_from) {
            $updateData['position_level'] = $request->info_position_level_to;
        }

        if ($request->info_department_id_to && $request->info_department_id_to != $ecf->info_department_id_from) {
            $updateData['department_id'] = $request->info_department_id_to;
        }

        if ($request->info_account_id_to && $request->info_account_id_to != $ecf->info_account_id_from) {
            $updateData['account_id'] = $request->info_account_id_to;
        }

        if ($request->info_status_to && $request->info_status_to != $ecf->info_status_from) {
            $updateData['status'] = $request->info_status_to;
        }

        if ($request->info_position_to && $request->info_position_to != $ecf->info_position_from) {
            $updateData['position'] = $request->info_position_to;
        }

        if ($request->info_reporting_id_to && $request->info_reporting_id_to != $ecf->info_reporting_id_from) {
            $leader = ERLeader::where('user_id', $request->info_reporting_id_to)->first();
            if ($leader) {
                $updateData['e_r_leader_id'] = $leader->id;
                ERSubordinate::updateOrCreate(
                    ['subordinate_id' => $request->employee['user_id']],
                    ['er_leader_id'   => $leader->id]
                );
            }
        }

        if ($request->info_basic_pay_to != $ecf->info_basic_pay_from) {
            $updateData['basic_pay'] = $request->info_basic_pay_to;
        }

        // Compare calculated total allowances against previous baseline
        if ($totalAllowancesTo != $ecf->info_allowances_from) {
            $updateData['allowance'] = $totalAllowancesTo;
        }

        // 4. Update the employee record if changes were detected
        if (!empty($updateData)) {
            AccountEmployee::where('user_id', $request->employee['user_id'])->update($updateData);
        }

        // 5. Mark the form status as Accepted
        $ecf->update([
            'status' => 'Accepted'
        ]);

        // 6. Return response
        return response()->json([
            'status'  => 'success',
            'message' => 'Employee change form accepted and profile updated.',
        ], 200);
    }
    public function store(Request $request)
    {
        $ecf = EREmployeeChangeForm::create([
            ...$request->all(),
            'prepaired_by_id' => Auth::id()
        ]);
        $user = User::where('id', $request->user_id)->with(['account_employee'])->first();
        $url = url("/accounts/my_documents/" . $ecf->id . "/employee_change_form");
        Mail::to($user->account_employee['eogs_email'] ?? $user->email)->send(new ChangeFormEmail($user, $url));
        return response()->json([
            'status' => 'success',
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $ecf = EREmployeeChangeForm::where('id', $id)->with(['employee', 'account_to', 'department_to', 'prepaired_by'])->first();
        return response()->json([
            'data' => $ecf,
            'status' => 'success',
        ], 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, EREmployeeChangeForm $eREmployeeChangeForm)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EREmployeeChangeForm $eREmployeeChangeForm)
    {
        //
    }
}
