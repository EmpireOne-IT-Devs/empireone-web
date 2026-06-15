<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $departments = Department::get();


        return response()->json($departments);
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
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $department = Department::create($validatedData);

        return response()->json([
            'message' => 'Department created successfully!',
            'department' => $department
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Department $department)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Department $department)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Department $department)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Department $department)
    {
        //
    }

    /**
     * Get users for a specific department
     */
    public function getDepartmentUsers($departmentId)
    {
        try {
            $users = User::where('department_id', $departmentId)
                ->select('id', 'first_name', 'middle_name', 'last_name', 'suffix', 'email', 'department_id', 'role', 'site')
                ->orderBy('id', 'desc')
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'fullName' => trim($user->first_name . ' ' . $user->middle_name . ' ' . $user->last_name . ' ' . $user->suffix),
                        'email' => $user->email,
                        'jobPosition' => $this->getJobPositionByRole($user->role),
                        'site' => $user->site,
                        'role' => $this->getRoleName($user->role),
                        'roleType' => $this->getRoleType($user->role),
                    ];
                });

            return response()->json($users);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch users for department',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Helper method to get job position based on role
     */
    private function getJobPositionByRole($role)
    {
        return match ($role) {
            1 => 'Administrator',
            2 => 'Employee',
            3 => 'HR Lead',
            4 => 'Manager',
            default => 'Employee'
        };
    }

    /**
     * Helper method to get role name based on role
     */
    private function getRoleName($role)
    {
        return match ($role) {
            1 => 'Administrator',
            2 => 'Developer',
            3 => 'HR Lead',
            4 => 'Manager',
            default => 'Developer'
        };
    }

    /**
     * Helper method to get role type based on role
     */
    private function getRoleType($role)
    {
        return match ($role) {
            1 => 'Administrator',
            2 => 'Employee',
            3 => 'Lead',
            4 => 'Manager',
            default => 'Employee'
        };
    }
}
