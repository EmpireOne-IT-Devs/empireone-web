<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\Account\AccountEmployee;
use App\Models\ER\ERLeader;
use App\Models\PM\PMReach;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Exception;

class ImportController extends Controller
{
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
                            'account_id'              => $sup?->account_id??0,
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
