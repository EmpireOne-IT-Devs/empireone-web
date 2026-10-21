<?php

namespace App\Policies;

use App\Models\User;
use App\Services\TeamRequestService;
use Illuminate\Database\Eloquent\Model;

// Registered for OvertimeRequest, AttendanceCorrection and LeaveRequest.
class TeamRequestPolicy
{
    public function __construct(private TeamRequestService $service)
    {
    }

    public function viewAny(User $user): bool
    {
        return $this->service->isLeader($user);
    }

    public function review(User $user, Model $request): bool
    {
        return $this->service->isSubordinateOf($user, (int) $request->user_id);
    }
}
