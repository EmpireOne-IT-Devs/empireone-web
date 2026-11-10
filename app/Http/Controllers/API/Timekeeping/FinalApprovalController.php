<?php

namespace App\Http\Controllers\API\Timekeeping;

use App\Http\Controllers\Controller;
use App\Http\Requests\Timekeeping\FinalApprovalDeclineRequest;
use App\Http\Requests\Timekeeping\FinalApprovalIndexRequest;
use App\Http\Resources\Timekeeping\TeamRequestResource;
use App\Services\TeamRequestService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class FinalApprovalController extends Controller
{
    public function __construct(private TeamRequestService $service)
    {
    }

    /**
     * List leader-approved overtime or schedule-correction requests awaiting HR/Accounting.
     */
    public function index(FinalApprovalIndexRequest $request)
    {
        $filters = $request->validated();

        Gate::authorize('viewFinalApprovals', $this->service->modelClass($filters['type']));

        return TeamRequestResource::collection(
            $this->service->paginateForFinalApproval($filters['type'], $filters)
        );
    }

    public function approve(string $type, int $id)
    {
        $finalRequest = $this->service->find($type, $id);
        Gate::authorize('finalApprove', $finalRequest);

        DB::transaction(fn () => $this->service->finalApprove($type, $finalRequest, request()->user()));
        $this->service->attachEmployeeInfo([$finalRequest], $type);

        return new TeamRequestResource($finalRequest);
    }

    public function decline(FinalApprovalDeclineRequest $request, string $type, int $id)
    {
        $finalRequest = $this->service->find($type, $id);
        Gate::authorize('finalApprove', $finalRequest);

        $this->service->finalDecline($finalRequest, $request->user(), $request->validated('note'));
        $this->service->attachEmployeeInfo([$finalRequest], $type);

        return new TeamRequestResource($finalRequest);
    }
}
