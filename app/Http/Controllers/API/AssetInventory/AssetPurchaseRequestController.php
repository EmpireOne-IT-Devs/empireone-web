<?php

namespace App\Http\Controllers\API\AssetInventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\AssetInventory\DecideAssetPurchaseRequest;
use App\Http\Requests\AssetInventory\StoreAssetPurchaseRequest;
use App\Http\Resources\AssetInventory\AssetPurchaseQuotationResource;
use App\Http\Resources\AssetInventory\AssetPurchaseRequestResource;
use App\Models\AssetInventory\AssetPurchaseRequest;
use App\Services\AssetPurchaseRequestService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class AssetPurchaseRequestController extends Controller
{
    public function __construct(private AssetPurchaseRequestService $service) {}

    public function index(Request $request)
    {
        Gate::authorize('viewAny', AssetPurchaseRequest::class);
        $filters = $request->validate([
            'page' => ['nullable', 'integer', 'min:1', 'max:1000000'],
            'search' => ['nullable', 'string', 'max:150'],
            'status' => ['nullable', Rule::in([
                AssetPurchaseRequest::PENDING, AssetPurchaseRequest::IN_PROGRESS,
                AssetPurchaseRequest::APPROVED, AssetPurchaseRequest::REJECTED, 'Ordered',
            ])],
            'priority' => ['nullable', Rule::in(config('purchase_request.priorities'))],
            'category' => ['nullable', Rule::in(config('purchase_request.categories'))],
        ]);
        $query = AssetPurchaseRequest::query()->latest('id');
        if (Gate::denies('reviewAny', AssetPurchaseRequest::class)) {
            $query->where('requester_id', $request->user()->getKey());
        }

        foreach (['status', 'priority', 'category'] as $filter) {
            if (isset($filters[$filter])) {
                $query->where($filter, $filters[$filter]);
            }
        }
        $term = trim($filters['search'] ?? '');
        if ($term !== '') {
            $query->where(function ($search) use ($term) {
                $search->whereLike('item_name', "%{$term}%")
                    ->orWhereLike('department', "%{$term}%")
                    ->orWhereLike('requester_name', "%{$term}%")
                    ->orWhereLike('supplier', "%{$term}%")
                    ->orWhereLike('purchase_request_id', "%{$term}%");
                if (preg_match('/^PR-([0-9]{1,18})$/i', $term, $matches)) {
                    $search->orWhere(function ($legacy) use ($matches) {
                        $legacy->whereNull('purchase_request_id')->where('id', (int) $matches[1]);
                    });
                }
            });
        }

        return AssetPurchaseRequestResource::collection($query->paginate(10)->appends($filters));
    }

    public function approvers(Request $request)
    {
        Gate::authorize('create', AssetPurchaseRequest::class);
        $values = $request->validate(['search' => ['nullable', 'string', 'max:150']]);

        return response()->json(['data' => $this->service->approvers(trim($values['search'] ?? ''))]);
    }

    public function store(StoreAssetPurchaseRequest $request)
    {
        $saved = $this->service->create($request->user(), $request->validated(), $request->file('supplierQuotation'));

        return (new AssetPurchaseRequestResource($saved))->response()->setStatusCode(201);
    }

    public function show(AssetPurchaseRequest $purchaseRequest)
    {
        Gate::authorize('view', $purchaseRequest);

        return new AssetPurchaseRequestResource($purchaseRequest->load('steps'));
    }

    public function approve(DecideAssetPurchaseRequest $request, AssetPurchaseRequest $purchaseRequest)
    {
        return $this->decide($request, $purchaseRequest, true);
    }

    public function reject(DecideAssetPurchaseRequest $request, AssetPurchaseRequest $purchaseRequest)
    {
        return $this->decide($request, $purchaseRequest, false);
    }

    public function quotation(AssetPurchaseRequest $purchaseRequest)
    {
        Gate::authorize('view', $purchaseRequest);

        return (new AssetPurchaseQuotationResource($this->service->quotationUrl($purchaseRequest)))
            ->response()->header('Cache-Control', 'private, no-store');
    }

    private function decide(DecideAssetPurchaseRequest $request, AssetPurchaseRequest $purchaseRequest, bool $approve)
    {
        $values = $request->validated();

        return new AssetPurchaseRequestResource($this->service->decide(
            $purchaseRequest, $request->user(), $values['step'], $values['remarks'] ?? null, $approve,
        ));
    }
}
