<?php

namespace App\Http\Controllers\API\Account;

use App\Http\Controllers\Controller;

use App\Models\Account\AccountEmployee;
use App\Models\Account\AccountPersonalInformation;
use App\Models\ER\ERAcknowledgement;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AccountEmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
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

        // 2. Fetch all master acknowledgements with items and employee sign-off records
        $allAcknowledgements = ERAcknowledgement::with([
            'employee',          // Parent-level sign-offs
            'items.employee'     // Item-level sign-offs
        ])->get();

        // 3. Query employees with search & role filters
        $employees = AccountEmployee::with([
            'user',
            'personal_information',
            'department',
            'account',
            'site',
            'reporting_to'
        ])
            ->whereNull('employment_status')
            ->whereNotNull('employee_id')
            // Filter by Role
            ->whereHas('user', function ($query) {
                $query->whereIn('role', [1, 2]);
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
            ->orderBy('id', 'asc')
            ->paginate(12);

        // 4. Transform the paginated items safely without losing pagination metadata
        $employees->getCollection()->transform(function ($employee) use ($allAcknowledgements) {

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
