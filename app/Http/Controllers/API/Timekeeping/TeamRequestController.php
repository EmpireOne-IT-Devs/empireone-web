<?php

namespace App\Http\Controllers\API\Timekeeping;

use App\Http\Controllers\Controller;
use App\Http\Requests\Timekeeping\TeamRequestDeclineRequest;
use App\Http\Requests\Timekeeping\TeamRequestIndexRequest;
use App\Http\Resources\Timekeeping\TeamRequestResource;
use App\Services\TeamRequestService;
use Illuminate\Support\Facades\Gate;

class TeamRequestController extends Controller
{
    public function __construct(private TeamRequestService $service)
    {
    }

    /**
     * List overtime, schedule-correction or leave requests filed by the leader's subordinates.
     */
    public function index(TeamRequestIndexRequest $request)
    {
        $filters = $request->validated();

        Gate::authorize('viewAny', $this->service->modelClass($filters['type']));

        return TeamRequestResource::collection(
            $this->service->paginate($request->user(), $filters['type'], $filters)
        );
    }

    public function approve(string $type, int $id)
    {
        $teamRequest = $this->service->find($type, $id);
        Gate::authorize('review', $teamRequest);

        $this->service->approve($type, $teamRequest, request()->user());
        $this->service->attachEmployeeInfo([$teamRequest], $type);

        return new TeamRequestResource($teamRequest);
    }

    public function decline(TeamRequestDeclineRequest $request, string $type, int $id)
    {
        $teamRequest = $this->service->find($type, $id);
        Gate::authorize('review', $teamRequest);

        $this->service->decline($teamRequest, $request->user(), $request->validated('note'));
        $this->service->attachEmployeeInfo([$teamRequest], $type);

        return new TeamRequestResource($teamRequest);
    }
}
