<?php

namespace App\Http\Controllers\API\AssetInventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\AssetInventory\DecideAssetItemRequest;
use App\Http\Requests\AssetInventory\StoreAssetItemRequest;
use App\Http\Resources\AssetInventory\AssetItemRequestLookupResource;
use App\Http\Resources\AssetInventory\AssetItemRequestResource;
use App\Models\AssetInventory\AssetItemRequest;
use App\Services\AssetItemRequestService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class AssetItemRequestController extends Controller
{
    public function __construct(private AssetItemRequestService $service) {}

    public function index(Request $request)
    {
        Gate::authorize('viewAny', AssetItemRequest::class);
        $filters = $request->validate([
            'page' => ['nullable', 'integer', 'min:1', 'max:1000000'],
            'search' => ['nullable', 'string', 'max:150'],
            'status' => ['nullable', Rule::in(AssetItemRequest::STATUSES)],
            'priority' => ['nullable', Rule::in(config('item_request.priorities'))],
            'type' => ['nullable', Rule::in(config('item_request.types'))],
        ]);
        $query = AssetItemRequest::query()->latest('id');
        foreach (['status' => 'status', 'priority' => 'priority', 'type' => 'request_type'] as $filter => $column) {
            if (isset($filters[$filter])) {
                $query->where($column, $filters[$filter]);
            }
        }
        if (($term = trim($filters['search'] ?? '')) !== '') {
            $query->where(fn ($search) => $search->whereLike('asset_name', "%{$term}%")
                ->orWhereLike('asset_tag', "%{$term}%")->orWhereLike('item_request_id', "%{$term}%")
                ->orWhereLike('assignee_name', "%{$term}%")->orWhereLike('employee_number', "%{$term}%")
                ->orWhereLike('department', "%{$term}%"));
        }

        return AssetItemRequestResource::collection($query->paginate(10)->appends($filters));
    }

    public function lookups(Request $request)
    {
        Gate::authorize('create', AssetItemRequest::class);
        $values = $request->validate([
            'assetSearch' => ['nullable', 'string', 'max:150'],
            'employeeSearch' => ['nullable', 'string', 'max:150'],
        ]);

        return new AssetItemRequestLookupResource($this->service->lookups(
            trim($values['assetSearch'] ?? ''), trim($values['employeeSearch'] ?? ''),
        ));
    }

    public function store(StoreAssetItemRequest $request)
    {
        $saved = $this->service->create($request->user(), $request->validated());

        return (new AssetItemRequestResource($saved))->response()->setStatusCode(201);
    }

    public function show(AssetItemRequest $itemRequest)
    {
        Gate::authorize('view', $itemRequest);

        return new AssetItemRequestResource($itemRequest->load('steps'));
    }

    public function approve(DecideAssetItemRequest $request, AssetItemRequest $itemRequest)
    {
        return $this->decide($request, $itemRequest, true);
    }

    public function reject(DecideAssetItemRequest $request, AssetItemRequest $itemRequest)
    {
        return $this->decide($request, $itemRequest, false);
    }

    private function decide(DecideAssetItemRequest $request, AssetItemRequest $itemRequest, bool $approve)
    {
        $values = $request->validated();

        return new AssetItemRequestResource($this->service->decide(
            $itemRequest, $request->user(), $values['step'], $values['remarks'] ?? null, $approve,
        ));
    }
}
