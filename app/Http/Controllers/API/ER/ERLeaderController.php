<?php

namespace App\Http\Controllers\API\ER;

use App\Models\ER\ERLeader;
use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\Account\AccountEmployee;
use App\Models\ER\ERSubordinate;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ERLeaderController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function get_my_team(Request $request)
    {
        $userId = Auth::id();
        $ids = ERLeader::where('user_id', $userId)->pluck('id')->toArray();

        if (!$ids) {
            return response()->json(['message' => 'Leader not found'], 404);
        }

        $month = $request->filled('month') ? (int) $request->input('month') : now()->month;
        $year  = $request->filled('year') ? (int) $request->input('year') : now()->year;

        AccountEmployee::$defaultMonth = $month;
        AccountEmployee::$defaultYear  = $year;

        $query = AccountEmployee::query();

        // 1. Account Filter
        if ($request->filled('account_id')) {
            $query->where('account_id', $request->input('account_id'));
        } else {
            $query->whereIn('e_r_leader_id', $ids);
            $query->orWhereIn('department_manager_id', $ids);
        }

        if ($request->status == '5th_review') {
            $query->whereBetween('started_at', [
                now()->subMonths(6)->startOfDay(),
                now()->subMonths(5)->endOfDay()
            ]);
        } else if ($request->status == '3rd_review') {
            $query->whereBetween('started_at', [
                now()->subMonths(4)->startOfDay(),
                now()->subMonths(3)->endOfDay()
            ]);
        } else {
            if ($request->status) {
                $query->where('status', $request->status);
            }
        }

        // 2. Search Filter
        if ($request->filled('search')) {
            $search = trim($request->input('search'));
            $query->where(function ($q) use ($search) {
                $q->where('employee_id', 'like', "%{$search}%")
                    ->orWhere('eogs_email', 'like', "%{$search}%")
                    ->orWhereHas('personal_information', function ($sub) use ($search) {
                        $sub->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%");
                    });
            });
        }

        $teams = $query->with([
            'personal_information',
            'account',
            'er_leader',
            'department_manager',
            'reaches' => function ($q) use ($month, $year) {
                $q->whereMonth('created_at', $month)
                    ->whereYear('created_at', $year);
            },
        ])->paginate(10);

        return response()->json($teams, 200);
    }
    public function index(Request $request)
    {
        // 1. Get location_id filter from query parameters (?location_id=1)
        $locationId = $request->query('location_id');

        // 2. Build base query for ERLeaders
        $leadersQuery = ERLeader::with(['user', 'employee'])
            ->withCount('subordinates');

        // 3. Build base query for Users
        $usersQuery = User::whereIn('role', [1, 2])
            ->with(['personal_information']);

        // 4. Apply location_id filtering if provided
        if ($locationId) {
            // Direct column check on e_r_leaders table
            $leadersQuery->where('location_id', $locationId);
        }

        // 5. Execute queries
        $leaders = $leadersQuery->orderBy('id', 'desc')->get();
        $users = $usersQuery->get();

        return response()->json([
            'data' => $leaders,
            'users' => $users,
            'status' => 'success',
        ], 200);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        ERLeader::updateOrCreate(
            // 1. Search criteria: Look for an existing record with this user_id
            [
                'user_id' => $request->user_id,
                'location_id' => $request->location_id,
            ],

            // 2. Values to update: Leave empty because there are no other fields to update
            []
        );
        $employee = AccountEmployee::where('user_id', $request->user_id)->first();
        $er_leader = ERLeader::where('user_id', $request->department_manager_id)->first();
        $e_r_leader = ERLeader::where('user_id', $request->e_r_leader_id)->first();
        if ($employee) {
            $employee->update([
                'department_manager_id' => $er_leader->id ?? null,
                'e_r_leader_id' => $e_r_leader->id ?? null
            ]);
        }
        $user = User::where('id', $request->user_id)->first();
        if ($user) {
            $user->update([
                'role' => 1
            ]);
        }
        return response()->json([
            'status' => 'success',
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $leader = ERLeader::where('id', $id)->with(['subordinates', 'user'])->first();

        $employees = User::whereIn('role', ['1', '2'])->with(['personal_information'])->get();
        // foreach ($leader['subordinates']  as $key => $value) {
        //     AccountEmployee::where('user_id', $value['subordinate_id'])->update([
        //         'account_id' => '5',
        //         'department_id' => '4',
        //     ]);
        // }
        return response()->json([
            'data' => $leader,
            'employees' => $employees,
            'status' => 'success',
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ERLeader $eRLeader)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $user_id)
    {
        $leader =  ERLeader::where('id', $request->e_r_leader_id)->with(['subordinates'])->first();


        $immediate_supervisor =  ERLeader::where('user_id', $request->immediate_supervisor)->first();

        if ($leader) {
            $leader->update([
                'user_id' => $request->user_id
            ]);
            $account = AccountEmployee::where('user_id', $leader->user_id)->first();
            if ($account) {
                $account->update([
                    'department_manager_id' => $request->department_manager_id,
                    'e_r_leader_id' => $immediate_supervisor->id ?? null
                ]);
            }
            foreach ($leader->subordinates as $key => $value) {
                $employee =  AccountEmployee::where('user_id', $value['employee']['id'])->first();
                // $sub =  ERSubordinate::where('subordinate_id', $value['employee']['id'])->first();
                // if ($sub) {
                //     $sub->update([
                //         'er_leader_id' => $request->er_leader_id
                //     ]);
                // }
                if ($employee) {
                    $employee->update([
                        'department_manager_id' => $request->department_manager_id
                    ]);
                }
            }
        }
        return response()->json([
            'data' => $leader,
            'status' => 'success',
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ERLeader $eRLeader)
    {
        //
    }
}
