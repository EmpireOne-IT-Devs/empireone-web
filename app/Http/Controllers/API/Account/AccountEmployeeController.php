<?php

namespace App\Http\Controllers\API\Account;

use App\Http\Controllers\Controller;

use App\Models\Account\AccountEmployee;
use Illuminate\Http\Request;

class AccountEmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
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
        // 1. Capture the search term
        $search = $request->input('search');

        $employees = AccountEmployee::with(['user', 'personal_information', 'department', 'account', 'site'])
            ->whereNotNull('employee_id')
            // 2. Filter by Role (as you had before)
            ->whereHas('user', function ($query) {
                $query->whereIn('role', [1, 2]);
            })
            // 3. Add Search Logic
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
            ->orderBy('id', 'desc')
            ->paginate(15)
            // 4. Append search query to pagination links
            ->withQueryString();

        return response()->json([
            'status' => 'success',
            'data'   => $employees,
        ], 200);
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
