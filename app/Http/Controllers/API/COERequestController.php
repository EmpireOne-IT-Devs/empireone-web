<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCOERequestRequest;
use App\Http\Resources\COERequestResource;
use App\Http\Resources\COERequestStatusResource;
use App\Models\COERequest;
use App\Services\COERequestService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class COERequestController extends Controller
{
    public function __construct(private COERequestService $service) {}

    public function index(Request $request)
    {
        Gate::authorize('viewAny', COERequest::class);

        $perPage = min((int) $request->query('per_page', 10), 100);

        $requests = COERequest::query()
            ->with('user.personal_information')
            ->latest('requested_at')
            ->paginate($perPage)
            ->appends($request->query());

        return COERequestResource::collection($requests);
    }

    public function status(Request $request)
    {
        Gate::authorize('create', COERequest::class);

        return new COERequestStatusResource($this->statusPayload($request));
    }

    public function store(StoreCOERequestRequest $request)
    {
        $record = $this->service->create($request->user(), $request->validated('purpose'));

        if (! $record) {
            return response()->json([
                'message' => 'You can only generate a COE once every 24 hours.',
                'next_available_at' => $this->service->nextAvailableAt($request->user())?->toIso8601String(),
            ], 429);
        }

        return (new COERequestResource($record->load('user.personal_information')))
            ->response()
            ->setStatusCode(201);
    }

    private function statusPayload(Request $request): array
    {
        return [
            'last_requested_at' => $this->service->lastRequestedAt($request->user()),
            'next_available_at' => $this->service->nextAvailableAt($request->user()),
        ];
    }
}
