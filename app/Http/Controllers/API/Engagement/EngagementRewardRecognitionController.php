<?php

namespace App\Http\Controllers\API\Engagement;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\Department;
use App\Models\Engagement\EngagementRewardRecognition;
use App\Models\User;
use Illuminate\Http\Request;

class EngagementRewardRecognitionController extends Controller
{
    /**
     * Display all recognitions.
     */
    public function index()
    {
        $recognitions = EngagementRewardRecognition::latest()->get()->map(function ($recognition) {
            $userPayload = $this->formatUserPayload($recognition->user_id);
            $employeePayload = $this->formatEmployeePayload(
                $recognition->employee_id,
                $recognition->department_id,
                $recognition->account_id,
            );

            return array_merge($recognition->toArray(), [
                'user' => $userPayload,
                'employee' => $employeePayload,
            ]);
        });

        return response()->json($recognitions);
    }

    /**
     * Search employees for the autocomplete.
     */
    public function searchEmployees(Request $request)
    {
        $search = $request->search;

        $employees = User::select(
            'id',
            'avatar'
        )
            ->with([
                'personal_information:id,user_id,first_name,last_name,department_id',
                'personal_information.department:id,name',
                'account_employee.account:id,name',
                'account_employee.department:id,name',
            ])
            ->when($search, function ($query) use ($search) {
                $query->whereHas('personal_information', function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%");
                });
            })
            ->where('id', '!=', auth()->id()) // Prevent self-recognition
            ->limit(10)
            ->get()
            ->map(function ($user) {
                $info = $user->personal_information;
                $account = $user->account_employee?->account;
                $accountDepartment = $user->account_employee?->department;
                $department = $info?->department ? [
                    'id' => $info->department->id,
                    'name' => $info->department->name,
                ] : ($accountDepartment ? [
                    'id' => $accountDepartment->id,
                    'name' => $accountDepartment->name,
                ] : ($account ? [
                    'id' => $account->id,
                    'name' => $account->name,
                ] : null));
                return [
                    'id' => $user->id,
                    'first_name' => $info->first_name ?? '',
                    'last_name' => $info->last_name ?? '',
                    'profile_image' => $user->avatar,
                    'department' => $department,
                    'account' => $account ? [
                        'id' => $account->id,
                        'name' => $account->name,
                    ] : null,
                ];
            });

        return response()->json($employees);
    }

    /**
     * Store a newly created recognition.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => ['required', 'exists:users,id'],
            'award_category' => ['nullable', 'string'],
            'company_value' => ['nullable', 'string'],
            'award_point' => ['nullable', 'integer', 'min:0'],
            'message' => ['required', 'string', 'max:1000'],
        ]);

        $employee = User::with(['personal_information.department:id,name', 'account_employee.account:id,name'])
            ->find($validated['employee_id']);

        $departmentId = $employee?->personal_information?->department?->id;
        $accountId = $employee?->account_employee?->account?->id;

        $recognition = EngagementRewardRecognition::create([
            'user_id' => auth()->id(),
            'employee_id' => $validated['employee_id'],
            'department_id' => $departmentId,
            'account_id' => $accountId,
            'award_category' => $validated['award_category'],
            'company_value' => $validated['company_value'],
            'award_point' => $validated['award_point'] ?? null,
            'message' => $validated['message'],
            'status' => 'published',
            'published_at' => now(),
        ]);

        return response()->json([
            'message' => 'Recognition sent successfully.',
            'data' => array_merge($recognition->toArray(), [
                'user' => $this->formatUserPayload($recognition->user_id),
                'employee' => $this->formatEmployeePayload(
                    $recognition->employee_id,
                    $recognition->department_id,
                    $recognition->account_id,
                ),
            ]),
        ], 201);
    }

    /**
     * Display a single recognition.
     */
    public function show(EngagementRewardRecognition $engagementRewardRecognition)
    {
        return response()->json(array_merge($engagementRewardRecognition->toArray(), [
            'user' => $this->formatUserPayload($engagementRewardRecognition->user_id),
            'employee' => $this->formatEmployeePayload(
                $engagementRewardRecognition->employee_id,
                $engagementRewardRecognition->department_id,
                $engagementRewardRecognition->account_id,
            ),
        ]));
    }

    /**
     * Update a recognition.
     */
    public function update(Request $request, EngagementRewardRecognition $engagementRewardRecognition)
    {
        $validated = $request->validate([
            'award_category' => ['nullable', 'string'],
            'company_value' => ['nullable', 'string'],
            'award_point' => ['nullable', 'integer', 'min:0'],
            'message' => ['required', 'string', 'max:1000'],
        ]);

        $engagementRewardRecognition->update($validated);

        return response()->json([
            'message' => 'Recognition updated successfully.',
            'data' => $engagementRewardRecognition,
        ]);
    }

    /**
     * Delete a recognition.
     */
    public function destroy(EngagementRewardRecognition $engagementRewardRecognition)
    {
        $engagementRewardRecognition->delete();

        return response()->json([
            'message' => 'Recognition deleted successfully.',
        ]);
    }

    private function formatUserPayload($userId)
    {
        $user = User::with(['personal_information.department:id,name', 'account_employee.account:id,name', 'account_employee.department:id,name'])->find($userId);
        if (! $user) {
            return null;
        }

        $info = $user->personal_information;
        $account = $user->account_employee?->account;
        $accountDepartment = $user->account_employee?->department;
        $department = $info && $info->department ? [
            'id' => $info->department->id,
            'name' => $info->department->name,
        ] : ($accountDepartment ? [
            'id' => $accountDepartment->id,
            'name' => $accountDepartment->name,
        ] : ($account ? [
            'id' => $account->id,
            'name' => $account->name,
        ] : null));

        return [
            'id' => $user->id,
            'first_name' => $info->first_name ?? null,
            'last_name' => $info->last_name ?? null,
            'profile_image' => $user->avatar,
            'department' => $department,
            'account' => $account ? [
                'id' => $account->id,
                'name' => $account->name,
            ] : null,
        ];
    }

    private function formatEmployeePayload($employeeId, $fallbackDepartmentId = null, $fallbackAccountId = null)
    {
        $employee = User::with(['personal_information.department:id,name', 'account_employee.account:id,name', 'account_employee.department:id,name'])->find($employeeId);
        if (! $employee) {
            return null;
        }

        $info = $employee->personal_information;
        $account = $employee->account_employee?->account;
        $accountDepartment = $employee->account_employee?->department;
        $department = $info && $info->department ? [
            'id' => $info->department->id,
            'name' => $info->department->name,
        ] : ($accountDepartment ? [
            'id' => $accountDepartment->id,
            'name' => $accountDepartment->name,
        ] : null);

        if (! $department && $fallbackDepartmentId) {
            $fallbackDept = Department::find($fallbackDepartmentId);
            if ($fallbackDept) {
                $department = [
                    'id' => $fallbackDept->id,
                    'name' => $fallbackDept->name,
                ];
            }
        }

        if (! $department && $fallbackAccountId) {
            $fallbackAcct = Account::find($fallbackAccountId);
            if ($fallbackAcct) {
                $department = [
                    'id' => $fallbackAcct->id,
                    'name' => $fallbackAcct->name,
                ];
            }
        }

        return [
            'id' => $employee->id,
            'first_name' => $info->first_name ?? null,
            'last_name' => $info->last_name ?? null,
            'profile_image' => $employee->avatar,
            'department' => $department,
            'account' => $account ? [
                'id' => $account->id,
                'name' => $account->name,
            ] : null,
        ];
    }
}
