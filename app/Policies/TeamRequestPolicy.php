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

    public function delete(User $user, Model $request): bool
    {
        return $user->id === (int) $request->user_id;
    }

    public function viewFinalApprovals(User $user): bool
    {
        return $this->service->isFinalApprover($user);
    }

    // Final approvers cannot approve or decline their own filings.
    public function finalApprove(User $user, Model $request): bool
    {
        return $this->service->isFinalApprover($user) && $user->id !== (int) $request->user_id;
    }
}
