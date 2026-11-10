<?php

namespace App\Services;

use App\Models\Account\AccountEmployee;
use App\Models\Account\AccountPersonalInformation;
use App\Models\Department;
use App\Models\ER\ERLeader;
use App\Models\ER\ERSubordinate;
use App\Models\Timekeeping\AttendanceCorrection;
use App\Models\Timekeeping\LeaveRequest;
use App\Models\Timekeeping\OvertimeRequest;
use App\Models\User;
use App\Services\Timekeeping\AttendanceCorrectionService;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\AbstractPaginator;

class TeamRequestService
{
    public const TYPES = [
        'overtime' => OvertimeRequest::class,
        'schedule' => AttendanceCorrection::class,
        'leave' => LeaveRequest::class,
    ];

    // Filter group -> raw statuses per type; "approved" means the leader has approved.
    private const STATUS_GROUPS = [
        'pending' => ['pending'],
        'approved' => ['endorsed', 'approved', 'granted'],
        'declined' => ['declined'],
    ];

    public const FINAL_APPROVER_DEPARTMENT_IDS = [2, 3]; // Human Resources, Accounting & Finance

    // Final-approval filter group -> raw statuses; "pending" means awaiting HR/Accounting.
    private const FINAL_STATUS_GROUPS = [
        'pending' => ['endorsed'],
        'approved' => ['approved', 'granted'],
        'declined' => ['declined'],
    ];

    public function modelClass(string $type): string
    {
        return self::TYPES[$type] ?? abort(404);
    }

    public function find(string $type, int $id): Model
    {
        return $this->modelClass($type)::findOrFail($id);
    }

    public function subordinateIds(User $leader): array
    {
        $leaderIds = ERLeader::where('user_id', $leader->id)->pluck('id');

        if ($leaderIds->isEmpty()) {
            return [];
        }

        return ERSubordinate::whereIn('er_leader_id', $leaderIds)
            ->pluck('subordinate_id')
            ->unique()
            ->values()
            ->all();
    }

    public function subordinateOptions(User $leader): array
    {
        $ids = $this->subordinateIds($leader);

        $names = AccountPersonalInformation::whereIn('user_id', $ids)
            ->get(['user_id', 'first_name', 'last_name'])
            ->keyBy('user_id');
        $employeeIds = AccountEmployee::whereIn('user_id', $ids)
            ->pluck('employee_id', 'user_id');

        return collect($ids)
            ->map(fn ($id) => [
                'user_id' => $id,
                'name' => ($info = $names->get($id)) ? trim("{$info->first_name} {$info->last_name}") : null,
                'employee_id' => $employeeIds->get($id),
            ])
            ->filter(fn ($row) => $row['name'])
            ->sortBy('name', SORT_NATURAL | SORT_FLAG_CASE)
            ->values()
            ->all();
    }

    public function isLeader(User $leader): bool
    {
        return ERLeader::where('user_id', $leader->id)->exists();
    }

    public function isSubordinateOf(User $leader, int $userId): bool
    {
        return in_array($userId, $this->subordinateIds($leader), true);
    }

    // Only HR and Accounting & Finance give the final approval; the admin role alone does not.
    public function isFinalApprover(User $user): bool
    {
        return AccountEmployee::where('user_id', $user->id)
            ->whereIn('department_id', self::FINAL_APPROVER_DEPARTMENT_IDS)
            ->exists();
    }

    /**
     * Leader-endorsed requests from every employee, for the final approver.
     */
    public function paginateForFinalApproval(string $type, array $filters): LengthAwarePaginator
    {
        $query = $this->modelClass($type)::query()->whereNotNull('endorsed_by');

        $status = $filters['status'] ?? 'pending';
        $query->whereIn('status', self::FINAL_STATUS_GROUPS[$status] ?? self::FINAL_STATUS_GROUPS['pending']);

        if (! empty($filters['search'])) {
            $term = '%' . $filters['search'] . '%';
            $matches = AccountPersonalInformation::where(function ($q) use ($term) {
                $q->where('first_name', 'like', $term)->orWhere('last_name', 'like', $term);
            })->pluck('user_id');

            $query->whereIn('user_id', $matches);
        }

        if (! empty($filters['date_from'])) {
            $query->whereDate('date', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->whereDate('date', '<=', $filters['date_to']);
        }

        $paginator = $query
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->paginate($filters['per_page'] ?? 15);

        $this->attachEmployeeInfo($paginator, $type);

        return $paginator;
    }

    public function finalApprove(string $type, Model $request, User $approver): Model
    {
        $this->ensureEndorsed($request, 'approved');

        if ($type === 'leave') {
            $this->ensureLeaveCredits($request);
        }

        $now = Carbon::now();

        if ($type === 'schedule') {
            $request->update(['status' => 'granted', 'granted_by' => $approver->id, 'granted_at' => $now]);
            app(AttendanceCorrectionService::class)->applyToAttendance($request);
        } else {
            $request->update(['status' => 'approved', 'approved_by' => $approver->id, 'approved_at' => $now]);
        }

        return $request;
    }

    public function finalDecline(Model $request, User $approver, string $note): Model
    {
        $this->ensureEndorsed($request, 'declined');

        $request->update([
            'status' => 'declined',
            'declined_by' => $approver->id,
            'declined_at' => Carbon::now(),
            'accounting_note' => $note,
        ]);

        return $request;
    }

    public function paginate(User $leader, string $type, array $filters): LengthAwarePaginator
    {
        $subordinateIds = $this->subordinateIds($leader);
        $query = $this->modelClass($type)::query()->whereIn('user_id', $subordinateIds);

        if (! empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (! empty($filters['search'])) {
            $term = '%' . $filters['search'] . '%';

            $nameMatches = AccountPersonalInformation::whereIn('user_id', $subordinateIds)
                ->where(function ($q) use ($term) {
                    $q->where('first_name', 'like', $term)
                        ->orWhere('last_name', 'like', $term)
                        ->orWhereRaw("CONCAT(first_name, ' ', last_name) like ?", [$term]);
                })
                ->pluck('user_id');

            $idMatches = AccountEmployee::whereIn('user_id', $subordinateIds)
                ->where('employee_id', 'like', $term)
                ->pluck('user_id');

            $query->whereIn('user_id', $nameMatches->merge($idMatches)->unique()->values());
        }

        if (! empty($filters['status']) && isset(self::STATUS_GROUPS[$filters['status']])) {
            $query->whereIn('status', self::STATUS_GROUPS[$filters['status']]);
        }

        if (! empty($filters['date_from'])) {
            $query->whereDate('date', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->whereDate('date', '<=', $filters['date_to']);
        }

        $paginator = $query
            ->orderByRaw("status = 'pending' desc")
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->paginate($filters['per_page'] ?? 15);

        $this->attachEmployeeInfo($paginator, $type);

        return $paginator;
    }

    public function approve(string $type, Model $request, User $leader): Model
    {
        $this->ensurePending($request, 'approved');

        $now = Carbon::now();

        $request->update(['status' => 'endorsed', 'endorsed_by' => $leader->id, 'endorsed_at' => $now]);

        return $request;
    }

    public function decline(Model $request, User $leader, string $note): Model
    {
        $this->ensurePending($request, 'declined');

        $request->update([
            'status' => 'declined',
            'declined_by' => $leader->id,
            'declined_at' => Carbon::now(),
            'supervisor_note' => $note,
        ]);

        return $request;
    }

    public function attachEmployeeInfo(iterable $requests, string $type): void
    {
        // collect() on a paginator yields its page metadata, not the items.
        if ($requests instanceof AbstractPaginator) {
            $requests = $requests->items();
        }

        $userIds = collect($requests)->pluck('user_id')->unique()->all();

        $names = AccountPersonalInformation::whereIn('user_id', $userIds)
            ->get(['user_id', 'first_name', 'last_name'])
            ->keyBy('user_id');
        $employees = AccountEmployee::whereIn('user_id', $userIds)
            ->get(['user_id', 'employee_id', 'department_id'])
            ->keyBy('user_id');
        $departments = Department::whereIn('id', $employees->pluck('department_id')->filter())
            ->pluck('name', 'id');

        foreach ($requests as $request) {
            $info = $names->get($request->user_id);
            $employee = $employees->get($request->user_id);

            $request->setAttribute('request_type', $type);
            $request->setAttribute('employee_info', [
                'user_id' => $request->user_id,
                'name' => $info ? trim("{$info->first_name} {$info->last_name}") : null,
                'employee_id' => $employee?->employee_id,
                'department' => $employee ? $departments->get($employee->department_id) : null,
            ]);
        }
    }

    private function ensurePending(Model $request, string $action): void
    {
        if ($request->status !== 'pending') {
            abort(422, "Only pending requests can be {$action}.");
        }
    }

    private function ensureEndorsed(Model $request, string $action): void
    {
        if ($request->status !== 'endorsed') {
            abort(422, "Only leader-approved requests can be {$action}.");
        }
    }

    // Credits are deducted on final approval, so guard against overdrawing the balance.
    private function ensureLeaveCredits(Model $request): void
    {
        $credits = app(LeaveCreditService::class);

        if (! $credits->isDeductible($request->leave_type)) {
            return;
        }

        $summary = $credits->summary((int) $request->user_id);

        if (! $summary['is_regular'] || $summary['balance'] < 1) {
            abort(422, 'Insufficient leave credits.');
        }
    }
}
