<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\Account\AccountEmployee;
use App\Models\ER\ERLeader;
use App\Models\PM\PMCorrectiveAction;
use App\Models\PM\PMReach;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Exception;

class ImportController extends Controller
{
    public function import_corrective_action_data(Request $request)
    {
        // Increase memory limit and execution time to prevent timeouts on large files
        agent_ini_set_memory: // (Keep your existing ini settings)
        ini_set('memory_limit', '512M');
        set_time_limit(300); // 5 minutes max

        $filename = public_path("csv/Corrective Action 2.0 - Corrective Action Logs.csv");
        $responses = [];

        if (!file_exists($filename)) {
            return response()->json([
                'status' => 'error',
                'message' => 'The target CSV file does not exist in public/csv/.'
            ], 404);
        }

        if (($handle = fopen($filename, "r")) !== FALSE) {
            $raw_headers = fgetcsv($handle, 0, ",");

            if (!$raw_headers) {
                fclose($handle);
                return response()->json([
                    'status' => 'error',
                    'message' => 'The CSV file is empty or formatted incorrectly.'
                ], 400);
            }

            // Clean headers: handle encoding, BOM, spaces, slashes, and convert to snake_case keys
            $clean_headers = array_map(function ($header, $index) {
                $header = mb_convert_encoding(trim($header), 'UTF-8', 'ISO-8859-1');
                if ($index === 0) {
                    $header = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $header);
                }
                return strtolower(str_replace([' ', '/', '-'], '_', $header));
            }, $raw_headers, array_keys($raw_headers));

            $header_count = count($clean_headers);

            // Read rows line by line into objects
            while (($data = fgetcsv($handle, 0, ",")) !== FALSE) {
                if (count($data) === $header_count) {
                    $utf8_data = array_map(function ($value) {
                        return mb_convert_encoding($value, 'UTF-8', 'ISO-8859-1');
                    }, $data);

                    $row = array_combine($clean_headers, $utf8_data);
                    $responses[] = (object) $row;
                }
            }
            fclose($handle);
        }

        // Helper function to split full names into [first_name, last_name]
        $splitName = function (?string $fullName): array {
            $fullName = trim($fullName ?? '');
            if (empty($fullName)) {
                return [null, null];
            }
            $parts = explode(' ', $fullName);
            $lastName = count($parts) > 1 ? array_pop($parts) : '';
            $firstName = implode(' ', $parts);
            return [$firstName ?: $lastName, $lastName];
        };

        $accountEmployeesByEmail = AccountEmployee::all()->keyBy('eogs_email');
        $accountEmployeesById = AccountEmployee::all()->keyBy('employee_id');
        $leaders = ERLeader::all()->keyBy('id');
        $usersByEmpId = AccountEmployee::all()->keyBy('employee_id');

        $imported_count = 0;
        $skipped_count = 0;

        DB::beginTransaction();

        try {
            foreach ($responses as $value) {
                if (!empty($value->employee_id)) {
                    $sup = !empty($value->supervisoremail)
                        ? $accountEmployeesByEmail->get($value->supervisoremail)
                        : null;

                    $employee = $accountEmployeesById->get($value->employee_id);
                    $employeeUser = $usersByEmpId->get($value->employee_id);
                    $supervisorUser = !empty($value->supervisor_id) ? $usersByEmpId->get($value->supervisor_id) : null;
                    $managerUser = !empty($value->manager_id) ? $usersByEmpId->get($value->manager_id) : null;
                    $creatorUser = !empty($value->submitted_by) ? $usersByEmpId->get($value->submitted_by) : null;

                    $leader = ($sup && !empty($sup->department_manager_id))
                        ? $leaders->get($sup->department_manager_id)
                        : null;

                    // Split Names
                    [$empFirst, $empLast] = $splitName($value->employee_name ?? '');
                    [$supFirst, $supLast] = $splitName($value->supervisor_name ?? '');
                    [$mgrFirst, $mgrLast] = $splitName($value->manager_name ?? '');
                    [$hrFirst, $hrLast]   = $splitName($value->hr_signature ?? '');

                    // Parse Dates safely
                    $dateIssued = !empty($value->timestamp)
                        ? Carbon::createFromFormat('n/j/Y G:i:s', $value->timestamp)
                        : null;

                    $dateOfOccurrence = !empty($value->incident_date)
                        ? Carbon::parse($value->incident_date)->format('Y-m-d')
                        : null;

                    $nteReceivedAt = !empty($value->date_nte_received)
                        ? Carbon::parse($value->date_nte_received)
                        : null;

                    $empExplanationAt = !empty($value->emp_sign_date)
                        ? Carbon::parse($value->emp_sign_date)
                        : null;

                    //   $empExplanationAt = !empty($value->emp_final_sign_date)
                    // ? Carbon::parse($value->emp_final_sign_date)
                    // : null;

                    // Unique lookup keys to prevent duplicate inserts on re-imports
                    $attributes = [
                        'employee_id'                => $value->employee_id,
                        'date_of_occurrence'         => $dateOfOccurrence,
                    ];
                    $incomingStatus = strtoupper(trim($value->status ?? 'Pending'));
                    $mappedStatus = match ($incomingStatus) {
                        'PENDING APPROVAL'       => 'PENDING',
                        'PENDING FINAL APPROVAL' => 'PENDING FINAL SANCTION',
                        default                  => $incomingStatus,
                    };
                    // Data values to update or create
                    $values = [
                        'user_id'                   => $employeeUser?->user_id,
                        'created_by'                => $creatorUser?->user_id ?? ($value->submitted_by ?? null),
                        'is_employee_acknowledge'   => !empty($nteReceivedAt) ? 1 : 0,
                        'nte_received_at'           => $nteReceivedAt,
                        'first_name'                => $empFirst,
                        'last_name'                 => $empLast,
                        'eogs_email'                => $value->email ?? null,
                        'department_id'             => $employee?->department_id ?? null,
                        'code_of_discipline_section' => $value->policy_section ?? null,
                        'account_id' => $supervisorUser?->account_id,

                        // HR
                        'is_hr_acknowledge'         => !empty($value->hr_signature),
                        'hr_user_id' => 58,
                        'hr_id'            => '26011207',
                        'hr_first_name'    => 'Anthony',
                        'hr_last_name'     => 'Aragon',
                        'hr_email'         => 'anthony@empireonegroup.com',

                        // Supervisor
                        'supervisor_user_id'        => $supervisorUser?->user_id,
                        'supervisor_id'             => $supervisorUser?->employee_id ?? null,
                        'supervisor_first_name'     => $supFirst,
                        'supervisor_last_name'      => $supLast,
                        'supervisor_email'          => $value->supervisor_email ?? null,
                        'is_supervisor_acknowledge' => !empty($value->sup_signature),

                        // Manager

                        'manager_user_id'                => $managerUser->user_id ?? null,
                        'manager_id'                => $managerUser->employee_id ?? null,
                        'manager_first_name'        => $mgrFirst,
                        'manager_last_name'         => $mgrLast,
                        'manager_email'             => $value->manager_email ?? null,
                        'is_manager_acknowledge'    => !empty($value->mgr_signature),

                        // Infraction details
                        'category'                  => $value->category ?? null,
                        'description_of_infraction' => $value->description ?? null,
                        'evidence_drive_url'        => $value->evidence_link ?? null,
                        'status'                    => $mappedStatus,
                        'date_issued'               => $dateIssued,
                        'employee_explanation'      => $value->employee_explanation ?: null,
                        'employee_explanation_at'   => $empExplanationAt,
                        'final_sanction' => match ($value->corrective_action) {
                            'Termination'           => $value->corrective_action . ' (T)',
                            'Final Written Warning' => $value->corrective_action . ' (FWW)',
                            'Written Warning'       => $value->corrective_action . ' (WW)',
                            'Verbal Warning'        => $value->corrective_action . ' (VW)',
                            default                 => $value->corrective_action ?: null,
                        },
                        'employee_commitment'       => $value->employee_commitment ?: null,
                        'is_supervisor_sanction_acknowledge' => $value->sup_final_signature ? 1 : 0,
                        'is_manager_sanction_acknowledge' => $value->mgr_final_signature ? 1 : 0,
                        'is_hr_sanction_acknowledge' => $value->hr_final_signature ? 1 : 0,
                    ];

                    PMCorrectiveAction::updateOrCreate($attributes, $values);

                    $imported_count++;
                } else {
                    $skipped_count++;
                }
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Processing complete',
                'total_rows' => count($responses),
                'imported_count' => $imported_count,
                'skipped_count' => $skipped_count,
                'data' => $responses
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('REACH Data Import Failed: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred during import: ' . $e->getMessage()
            ], 500);
        }
    }
    public function import_reach_data(Request $request)
    {
        // Increase memory limit and execution time to prevent timeouts on large files
        ini_set('memory_limit', '512M');
        set_time_limit(300); // 5 minutes max

        $filename = public_path("csv/REACH Portal - Responses - Sorted.csv");
        $responses = [];

        if (!file_exists($filename)) {
            return response()->json([
                'status' => 'error',
                'message' => 'The target CSV file does not exist in public/csv/.'
            ], 404);
        }

        if (($handle = fopen($filename, "r")) !== FALSE) {
            $raw_headers = fgetcsv($handle, 0, ",");

            if (!$raw_headers) {
                fclose($handle);
                return response()->json([
                    'status' => 'error',
                    'message' => 'The CSV file is empty or formatted incorrectly.'
                ], 400);
            }

            // Clean headers: handle encoding, BOM, spaces, slashes, and convert to snake_case keys
            $clean_headers = array_map(function ($header, $index) {
                $header = mb_convert_encoding(trim($header), 'UTF-8', 'ISO-8859-1');
                if ($index === 0) {
                    $header = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $header);
                }
                return strtolower(str_replace([' ', '/', '-'], '_', $header));
            }, $raw_headers, array_keys($raw_headers));

            $header_count = count($clean_headers);

            // Read rows line by line into objects
            while (($data = fgetcsv($handle, 0, ",")) !== FALSE) {
                if (count($data) === $header_count) {
                    $utf8_data = array_map(function ($value) {
                        return mb_convert_encoding($value, 'UTF-8', 'ISO-8859-1');
                    }, $data);

                    $row = array_combine($clean_headers, $utf8_data);
                    $responses[] = (object) $row;
                }
            }
            fclose($handle);
        }


        $accountEmployeesByEmail = AccountEmployee::all()->keyBy('eogs_email');
        $accountEmployeesById = AccountEmployee::all()->keyBy('employee_id');
        $leaders = ERLeader::all()->keyBy('id');

        $imported_count = 0;
        $skipped_count = 0;

        DB::beginTransaction();

        try {
            foreach ($responses as $value) {
                if (!empty($value->employeeid)) {
                    $sup = !empty($value->supervisoremail)
                        ? $accountEmployeesByEmail->get($value->supervisoremail)
                        : null;

                    $employee = $accountEmployeesById->get($value->employeeid);

                    $leader = ($sup && !empty($sup->department_manager_id))
                        ? $leaders->get($sup->department_manager_id)
                        : null;

                    PMReach::updateOrCreate(
                        [
                            'user_id'         => $employee?->user_id,
                            'date_of_session' => !empty($value->session_date) ? Carbon::parse($value->session_date)->format('Y-m-d') : null,
                        ],
                        [
                            'created_by'              => $sup?->user_id ?? null,
                            'manager_user_id'         => $leader?->user_id ?? null,
                            'supervisor_user_id'      => $sup?->user_id ?? null,
                            'employee_id'             => $value->employeeid ?? null,
                            'first_name'              => $value->firstname ? explode(' ', trim($value->firstname))[0] : null,
                            'last_name'               => $value->lastname ? trim(Str::after($value->lastname, ' ')) : null,
                            'employee_email'          => $value->email ?? null,
                            'supervisor_id'           => $sup?->employee_id ?? null,
                            'supervisor_first_name'   => $value->supervisor ?? null,
                            'supervisor_email'        => $value->supervisoremail ?? null,
                            'account_id'              => $sup?->account_id ?? 0,
                            'recognition_statement_1' => $value->recognition1 ?? null,
                            'recognition_statement_2' => $value->recognition2 ?? null,
                            'recognition_statement_3' => $value->recognition3 ?? null,
                            'area_of_opportunity'     => $value->areaofopportunity ?? null,
                            'kpi'                     => $value->kpi ?? null,
                            'actual_metric'           => $value->actual ?? null,
                            'goal_target'             => $value->goal ?? null,
                            'biggest_rock'            => $value->biggestrock ?? null,
                            'behavioral_root_cause'   => $value->rootcause ?? null,
                            'smart_goal'              => $value->smartgoal ?? null,
                            'task_name'               => $value->taskname ?? null,
                            'task_description'        => $value->taskdesc ?? null,
                            'due_date'                => $value->duedate,
                            'frequency'               => $value->frequency ?? null,
                            'employee_commitment'     => $value->employeecommitment ?? null,
                            'leader_commitment'       => $value->leadercommitment ?? null,
                            'next_follow_up_date'     => $value->followupdate,
                            'follow_up_notes'         => $value->followupplan ?? null,
                            'status'                  => ($value->acknowledged ?? 'No') == 'Yes' ? 'ACKNOWLEDGED' : 'PENDING',
                            'created_at'              => Carbon::createFromFormat('m/d/Y H:i:s', trim($value->timestamp)),
                        ]
                    );

                    $imported_count++;
                } else {
                    $skipped_count++;
                }
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Processing complete',
                'total_rows' => count($responses),
                'imported_count' => $imported_count,
                'skipped_count' => $skipped_count,
                'data' => $responses
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('REACH Data Import Failed: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred during import: ' . $e->getMessage()
            ], 500);
        }
    }
}
