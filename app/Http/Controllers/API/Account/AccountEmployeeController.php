<?php

namespace App\Http\Controllers\API\Account;

use App\Http\Controllers\Controller;
use App\Http\Resources\Account\AccountPendingResource;
use App\Models\Account\AccountPending;
use App\Models\Account\AccountDocument;
use App\Models\Account\AccountEmployee;
use App\Models\Account\AccountPersonalInformation;
use App\Models\ER\ERAcknowledgement;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AccountEmployeeController extends Controller
{
    public function export_employee(Request $request)
    {
        $locationId = $request->input('location_id') ?? $request->query('location_id');

        $query = AccountEmployee::with([
            'user',
            'personal_information',
            'department',
            'account',
            'site',
            'location',
            'reporting_to.leader.user.personal_information',
            'department_manager.personal_information',
        ]);

        $query->when($locationId, function ($q, $locationId) {
            $q->where('location_id', $locationId);
        });

        $records = $query->orderBy('id', 'desc')->get();

        $filename = 'employees_' . ($locationId ? "loc_{$locationId}_" : '') . now()->format('Y_m_d_His') . '.xls';
        $headers = [
            'Content-Type' => 'application/vnd.ms-excel; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $escapeXml = function ($value) {
            if (is_null($value) || $value === '') return 'N/A';
            if (is_bool($value)) return $value ? 'Yes' : 'No';
            if (is_array($value) || is_object($value)) {
                $value = json_encode($value, JSON_UNESCAPED_UNICODE);
            }
            return htmlspecialchars((string) $value, ENT_XML1, 'UTF-8');
        };

        return response()->stream(function () use ($records, $escapeXml) {
            $file = fopen('php://output', 'w');

            // Excel XML Header with Styles
            fwrite($file, "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n");
            fwrite($file, "<?mso-application progid=\"Excel.Sheet\"?>\r\n");
            fwrite($file, "<Workbook xmlns=\"urn:schemas-microsoft-com:office:spreadsheet\"\r\n");
            fwrite($file, " xmlns:ss=\"urn:schemas-microsoft-com:office:spreadsheet\">\r\n");

            // Styles: Bold header style
            fwrite($file, "<Styles>\r\n");
            fwrite($file, "  <Style ss:ID=\"HeaderStyle\">\r\n");
            fwrite($file, "    <Font ss:Bold=\"1\" ss:Color=\"#000000\"/>\r\n");
            fwrite($file, "    <Interior ss:Color=\"#F1F5F9\" ss:Pattern=\"Solid\"/>\r\n");
            fwrite($file, "  </Style>\r\n");
            fwrite($file, "</Styles>\r\n");

            fwrite($file, "<Worksheet ss:Name=\"Employees\">\r\n");
            fwrite($file, "<Table>\r\n");

            // Explicit wide column widths so columns don't compress
            $colWidths = [
                110, // A: Employee ID
                190, // B: Full Name
                190, // C: EOGS Email
                220, // D: Position
                110, // E: Position Level
                90,  // F: Work Type
                130, // G: Employment Status
                90,  // H: Status
                190, // I: Department
                130, // J: Account
                100, // K: Site
                120, // L: Location
                170, // M: Immediate Supervisor
                170, // N: Department Manager
                110, // O: Started At
                100, // P: Basic Pay
                100, // Q: Allowance
                80,  // R: With BPO
                80,  // S: Gender
                100, // Date of Birth
                130, // Birth Place
                100, // Nationality
                100, // Marital Status
                110, // Contact
                150, // Street
                120, // Barangay
                120, // City
                120, // Province
                120, // Region
                80,  // Zip Code
                100, // Village
                100, // SSS
                100, // TIN
                100, // PhilHealth
                100, // Pag-IBIG
                120, // Government ID Type
                120, // ID Number
                170, // Highest Level of Education
                140, // Degree
                160, // Course
                190, // School Name
                100, // Year Graduated
                120, // Awards
                150, // Contact Name
                130, // Contact Relationship
                110, // Contact Number
                190, // Contact Address
                120  // Created At
            ];

            foreach ($colWidths as $width) {
                fwrite($file, "  <Column ss:AutoFitWidth=\"1\" ss:Width=\"{$width}\"/>\r\n");
            }

            // Header Labels
            $headers = [
                'Employee ID',
                'Full Name',
                'EOGS Email',
                'Position',
                'Position Level',
                'Work Type',
                'Employment Status',
                'Status',
                'Department',
                'Account',
                'Site',
                'Location',
                'Immediate Supervisor',
                'Department Manager',
                'Started At',
                'Basic Pay',
                'Allowance',
                'With BPO',
                'Gender',
                'Date of Birth',
                'Birth Place',
                'Nationality',
                'Marital Status',
                'Contact',
                'Street',
                'Barangay',
                'City',
                'Province',
                'Region',
                'Zip Code',
                'Village',
                'SSS',
                'TIN',
                'PhilHealth',
                'Pag-IBIG',
                'Government ID Type',
                'ID Number',
                'Highest Level of Education',
                'Degree',
                'Course',
                'School Name',
                'Year Graduated',
                'Awards',
                'Contact Name',
                'Contact Relationship',
                'Contact Number',
                'Contact Address',
                'Created At'
            ];

            // Write Header Row
            fwrite($file, "  <Row ss:StyleID=\"HeaderStyle\">\r\n");
            foreach ($headers as $header) {
                $val = $escapeXml($header);
                fwrite($file, "    <Cell><Data ss:Type=\"String\">{$val}</Data></Cell>\r\n");
            }
            fwrite($file, "  </Row>\r\n");

            // Write Data Rows
            foreach ($records as $item) {
                $pi = $item->personal_information;

                $firstName  = $pi->first_name ?? '';
                $middleName = $pi->middle_name ?? '';
                $lastName   = $pi->last_name ?? '';
                $suffix     = $pi->suffix ?? '';
                $fullName   = trim(preg_replace('/\s+/', ' ', "{$firstName} {$middleName} {$lastName} {$suffix}"));

                $supervisorInfo = $item->reporting_to->leader->user->personal_information ?? null;
                $supervisorName = $supervisorInfo
                    ? trim("{$supervisorInfo->first_name} {$supervisorInfo->last_name}")
                    : 'N/A';

                $managerInfo = $item->department_manager->personal_information ?? null;
                $managerName = $managerInfo
                    ? trim("{$managerInfo->first_name} {$managerInfo->last_name}")
                    : 'N/A';

                $startedAt = $item->started_at ? date('Y-m-d', strtotime($item->started_at)) : 'N/A';

                $rowCells = [
                    $item->employee_id,
                    $fullName ?: 'N/A',
                    $item->eogs_email,
                    $item->position,
                    $item->position_level,
                    $item->work_type,
                    $item->employment_status,
                    $item->status,
                    $item->department->name ?? $item->department ?? 'N/A',
                    $item->account->name ?? $item->account ?? 'N/A',
                    $item->site->name ?? 'N/A',
                    $item->location->name ?? 'N/A',
                    $supervisorName,
                    $managerName,
                    $startedAt,
                    $item->basic_pay ? '₱' . number_format((float)$item->basic_pay, 2) : '₱0.00',
                    $item->allowance ? '₱' . number_format((float)$item->allowance, 2) : '₱0.00',
                    $item->with_bpo ? 'Yes' : 'No',
                    $pi->gender ?? null,
                    $pi->date_of_birth ?? null,
                    $pi->birth_place ?? null,
                    $pi->nationality ?? null,
                    $pi->marital_status ?? null,
                    $pi->contact ?? null,
                    $pi->street ?? null,
                    $pi->barangay ?? null,
                    $pi->city ?? null,
                    $pi->province ?? null,
                    $pi->region ?? null,
                    $pi->zip_code ?? null,
                    $pi->village ?? null,
                    $pi->sss ?? null,
                    $pi->tin ?? null,
                    $pi->philhealth ?? null,
                    $pi->pagibig ?? null,
                    $pi->government_type ?? null,
                    $pi->id_number ?? null,
                    $pi->highest_level_of_education ?? null,
                    $pi->degree ?? null,
                    $pi->course ?? null,
                    $pi->school_name ?? null,
                    $pi->year_graduated ?? null,
                    $pi->awards ?? null,
                    $pi->contact_name ?? null,
                    $pi->contact_relationship ?? null,
                    $pi->contact_number ?? null,
                    $pi->contact_address ?? null,
                    $item->created_at ? $item->created_at->format('Y-m-d') : 'N/A',
                ];

                fwrite($file, "  <Row>\r\n");
                foreach ($rowCells as $val) {
                    $cleaned = $escapeXml($val);
                    fwrite($file, "    <Cell><Data ss:Type=\"String\">{$cleaned}</Data></Cell>\r\n");
                }
                fwrite($file, "  </Row>\r\n");
            }

            fwrite($file, "</Table>\r\n");
            fwrite($file, "</Worksheet>\r\n");
            fwrite($file, "</Workbook>\r\n");

            fclose($file);
        }, 200, $headers);
    }
    public function get_inactive_employee()
    {
        $users = AccountEmployee::whereNull('e_r_leader_id')
            ->whereNull('department_manager_id')
            ->whereNotNull('employee_id')
            ->where('location_id', 1)
            ->with('personal_information')
            ->get();
        return response()->json(count($users), 200);
    }
    public function get_account_pendings(Request $request)
    {
        abort_unless($request->user()?->role === User::ROLE_ADMIN, 403);

        $pendingAccounts = AccountPending::query()
            ->where('status', 'pending')
            ->with('location')
            ->when($request->filled('location_id'), function ($query) use ($request) {
                $query->where('location_id', $request->input('location_id'));
            })
            ->orderByDesc('created_at')
            ->paginate(10);

        return AccountPendingResource::collection($pendingAccounts);
    }

    public function get_account_pending_history(Request $request)
    {
        abort_unless($request->user()?->role === User::ROLE_ADMIN, 403);

        $reviewedAccounts = AccountPending::query()
            ->whereIn('status', ['approved', 'declined'])
            ->with('location')
            ->when($request->filled('location_id'), function ($query) use ($request) {
                $query->where('location_id', $request->input('location_id'));
            })
            ->orderByRaw('COALESCE(approved_at, declined_at) DESC')
            ->orderByDesc('id')
            ->paginate(10);

        return AccountPendingResource::collection($reviewedAccounts);
    }

    /**
     * Display a listing of the resource.
     */
    public function get_201_files(Request $request)
    {
        $search = $request->filled('search') ? trim($request->search) : null;
        $location_id = $request->filled('location_id') ? $request->location_id : null;

        $users = AccountDocument::where('status', 'Pending')
            ->where('type', '201 File')
            ->when($location_id, function ($query) use ($location_id) {
                $query->whereHas('account', function ($q) use ($location_id) {
                    $q->where('location_id', $location_id);
                });
            })
            ->with(['account'])
            ->paginate();

        return response()->json($users, 200);
    }
    public function search_employee(Request $request)
    {
        $search = $request->search;

        $employees = AccountEmployee::with(['personal_information', 'department', 'er_leader', 'department_manager', 'account'])
            ->where('employee_id', 'LIKE', "%{$search}%")
            ->orWhereHas('personal_information', function ($query) use ($search) {
                // Searches "First Last" OR "Last First" to catch all typing variations
                $query->whereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("CONCAT(last_name, ' ', first_name) LIKE ?", ["%{$search}%"]);
            })
            ->limit(20) // Keep response fast
            ->get()
            ->map(function ($employee) {
                // Dynamically append 'name' so your frontend mapping works seamlessly
                if ($employee->personal_information) {
                    $employee->name = $employee->personal_information->first_name . ' ' . $employee->personal_information->last_name;
                } else {
                    $employee->name = $employee->employee_id; // Fallback if no personal info exists
                }
                return $employee;
            });

        return response()->json([
            'data' => $employees
        ], 200);
    }
    public function add_employee(Request $request)
    {
        // 1. Create or Update the base User
        $authUser = Auth::user();
        $user = User::updateOrCreate(
            ['email' => $request->email],
            [
                'name' => $request->first_name . ' ' . $request->last_name,
                'password' => Hash::make('Business12'),
                'role' => '2',
            ]
        );
        AccountEmployee::updateOrCreate(
            ['user_id' => $user->id],
            [
                'email' => $request->eogs_email,
                'employee_id'   => $request->employee_id,
                'account_id'    => $request->account_id,
                'department_id' => $request->department_id,
                'position'      => $request->position,
                'status'        => $request->status,
                'started_at'    => $request->started_at,
                'work_type'     => $request->work_type,
                'location_id'   => $authUser->account_employee?->location_id
            ]
        );

        AccountPersonalInformation::updateOrCreate(
            ['user_id' => $user->id],
            [
                'first_name'    => $request->first_name,
                'middle_name'   => $request->middle_name,
                'last_name'     => $request->last_name,
                'date_of_birth' => $request->date_of_birth,
                'contact'       => $request->contact,
                'sss'           => $request->sss,
                'pagibig'       => $request->pagibig,
                'tin'           => $request->tin,
                'philhealth'    => $request->philhealth,
            ]
        );

        return response()->json([
            'status'  => 'success',
            'message' => 'Employee successfully saved.'
        ], 200);
    }
    public function get_regular()
    {
        $employees = AccountEmployee::whereIn('status', ['Regular', 'Probationary'])->with(['leader', 'user', 'personal_information', 'department', 'account', 'site', 'account'])->get();
        return response()->json([
            'status' => 'success',
            'data'   => $employees,
        ], 200);
    }
    public function get_probationary()
    {
        $employees = AccountEmployee::where('status', 'Probationary')->with(['user', 'personal_information', 'department', 'account', 'site'])->get();
        return response()->json([
            'status' => 'success',
            'data'   => $employees,
        ], 200);
    }
    public function index(Request $request)
    {
        // 1. Capture search input
        $search = $request->input('search');
        $location_id = $request->input('location_id');
        $isAll = $request->boolean('all');
        $isLite = $isAll && $request->boolean('lite');

        // 2. Fetch all master acknowledgements with items and employee sign-off records.
        // Skip for the unpaginated "all" mode (dropdown selectors) since it doesn't
        // need acknowledgements and this is an O(employees x acknowledgements x items) operation.
        $allAcknowledgements = $isAll
            ? null
            : ERAcknowledgement::with([
                'employee',          // Parent-level sign-offs
                'items.employee'     // Item-level sign-offs
            ])->get();

        // 3. Query employees with search & role filters
        // Lite mode (dropdown selectors) skips heavy relations and nested eager loads.
        $relations = $isLite
            ? [
                'user',
                'personal_information',
                'department' => fn($q) => $q->without('manager'),
                'account' => fn($q) => $q->without('ecfs'),
            ]
            : [
                'user',
                'personal_information',
                'department_manager',
                'department',
                'account',
                'location',
                'site',
                'reporting_to',
                'files'
            ];

        $employees = AccountEmployee::with($relations)
            ->whereNotNull('employee_id')
            // Filter by Role
            ->whereHas('user', function ($query) {
                $query->whereIn('role', [1, 2]);
            })
            ->when($location_id, function ($q) use ($location_id) {
                $q->where('location_id', $location_id);
            })
            // Search Filter
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('employee_id', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($userQuery) use ($search) {
                            $userQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        })
                        ->orWhereHas('personal_information', function ($piQuery) use ($search) {
                            $piQuery->where('first_name', 'like', "%{$search}%")
                                ->orWhere('last_name', 'like', "%{$search}%");
                        });
                });
            })
            ->orderBy('id', 'desc');

        // Allow callers (e.g. dropdown selectors) to request the full list, unpaginated
        $employees = $isAll
            ? $employees->get()
            : $employees->paginate(8);

        // 4. Transform the paginated/collection items safely without losing pagination metadata
        $employeeCollection = $employees instanceof \Illuminate\Contracts\Pagination\LengthAwarePaginator
            ? $employees->getCollection()
            : $employees;

        if (!$isAll) {
            $employeeCollection->transform(function ($employee) use ($allAcknowledgements) {

                // Map all master acknowledgements to every single employee
                $employee->acknowledgements = $allAcknowledgements->map(function ($ack) use ($employee) {

                    // Clone instance to prevent mutating global records across the loop
                    $ackClone = clone $ack;

                    // --- A. VERIFY SUB-ITEM ACKNOWLEDGEMENTS ---
                    $verifiedItems = $ack->items->map(function ($item) use ($employee) {
                        $itemClone = clone $item;

                        // Match item_id in e_r_acknowledgement_employees table
                        $itemRecord = $item->employee->filter(function ($emp) use ($employee, $item) {
                            return $emp->user_id == $employee->user_id
                                && $emp->e_r_acknowledgement_item_id == $item->id;
                        })->values();

                        $itemClone->setRelation('employee', $itemRecord);
                        $itemClone->is_already_acknowledged = $itemRecord->isNotEmpty();

                        return $itemClone;
                    });

                    $ackClone->setRelation('items', $verifiedItems);

                    // --- B. VERIFY PARENT ACKNOWLEDGEMENT ---
                    // Matches records where e_r_acknowledgement_item_id is 0 or NULL
                    $parentRecord = $ack->employee->filter(function ($emp) use ($employee) {
                        return $emp->user_id == $employee->user_id
                            && ($emp->e_r_acknowledgement_item_id == 0 || is_null($emp->e_r_acknowledgement_item_id));
                    })->values();

                    $ackClone->setRelation('employee', $parentRecord);
                    $ackClone->is_already_acknowledged = $parentRecord->isNotEmpty();

                    return $ackClone;
                });

                return $employee;
            });
        }

        return response()->json($employees, 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(AccountEmployee $accountEmployee)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AccountEmployee $accountEmployee)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AccountEmployee $accountEmployee)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AccountEmployee $accountEmployee)
    {
        //
    }
}
