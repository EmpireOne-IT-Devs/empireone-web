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
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;

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

    public function isLeader(User $leader): bool
    {
        return ERLeader::where('user_id', $leader->id)->exists();
    }

    public function isSubordinateOf(User $leader, int $userId): bool
    {
        return in_array($userId, $this->subordinateIds($leader), true);
    }

    public function paginate(User $leader, string $type, array $filters): LengthAwarePaginator
    {
        $subordinateIds = $this->subordinateIds($leader);
        $query = $this->modelClass($type)::query()->whereIn('user_id', $subordinateIds);

        if (! empty($filters['search'])) {
            $matches = AccountPersonalInformation::whereIn('user_id', $subordinateIds)
                ->where(function ($q) use ($filters) {
                    $term = '%' . $filters['search'] . '%';
                    $q->where('first_name', 'like', $term)
                        ->orWhere('last_name', 'like', $term);
                })
                ->pluck('user_id');

            $query->whereIn('user_id', $matches);
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

        $request->update($type === 'leave'
            ? ['status' => 'approved', 'approved_by' => $leader->id, 'approved_at' => $now]
            : ['status' => 'endorsed', 'endorsed_by' => $leader->id, 'endorsed_at' => $now]);

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
}
