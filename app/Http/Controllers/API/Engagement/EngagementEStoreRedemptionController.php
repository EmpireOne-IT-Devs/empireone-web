<?php

namespace App\Http\Controllers\API\Engagement;

use App\Http\Controllers\Controller;
use App\Http\Requests\Engagement\CancelEStoreRedemptionRequest;
use App\Http\Requests\Engagement\StoreEStoreRedemptionRequest;
use App\Http\Resources\Engagement\EngagementEStoreRedemptionResource;
use App\Models\Engagement\EngagementEStoreRedemption;
use App\Services\EStoreRedemptionService;
use App\Services\EmployeePointsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class EngagementEStoreRedemptionController extends Controller
{
    public function __construct(
        private EStoreRedemptionService $redemptionService,
        private EmployeePointsService $pointsService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', EngagementEStoreRedemption::class);

        $validated = $request->validate([
            'status' => ['nullable', 'string', 'in:'.implode(',', EngagementEStoreRedemption::STATUSES)],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $redemptions = EngagementEStoreRedemption::query()
            ->with(['item', 'histories.actor', 'refund', 'approver', 'processor', 'fulfiller', 'rejecter', 'canceller'])
            ->forUser($request->user()->id)
            ->when($validated['status'] ?? null, fn ($query, $status) => $query->withStatus($status))
            ->latest()
            ->paginate($validated['per_page'] ?? 15);

        return response()->json([
            'status' => 'success',
            ...EngagementEStoreRedemptionResource::collection($redemptions)->response()->getData(true),
        ]);
    }

    public function balance(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', EngagementEStoreRedemption::class);

        $userId = $request->user()->id;

        return response()->json([
            'status' => 'success',
            'data' => [
                'earned_points' => $this->pointsService->earnedPoints($userId),
                'redeemed_points' => $this->pointsService->redeemedPoints($userId),
                'refunded_points' => $this->pointsService->refundedPoints($userId),
                'available_points' => $this->pointsService->spendablePoints($userId),
            ],
        ]);
    }

    public function store(StoreEStoreRedemptionRequest $request): JsonResponse
    {
        Gate::authorize('create', EngagementEStoreRedemption::class);

        $redemption = $this->redemptionService->redeem($request->user(), $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Redemption request submitted successfully.',
            'data' => (new EngagementEStoreRedemptionResource($redemption))->resolve($request),
        ], 201);
    }

    public function show(Request $request, EngagementEStoreRedemption $redemption): JsonResponse
    {
        Gate::authorize('view', $redemption);

        $redemption->loadMissing(['item', 'employee.account_employee.department', 'histories.actor', 'refund', 'approver', 'processor', 'fulfiller', 'rejecter', 'canceller']);

        return response()->json([
            'status' => 'success',
            'data' => (new EngagementEStoreRedemptionResource($redemption))->resolve($request),
        ]);
    }

    public function cancel(CancelEStoreRedemptionRequest $request, EngagementEStoreRedemption $redemption): JsonResponse
    {
        Gate::authorize('cancel', $redemption);

        $redemption = $this->redemptionService->cancel($redemption, $request->user(), $request->validated()['reason'] ?? null);

        return response()->json([
            'status' => 'success',
            'message' => 'Redemption request cancelled.',
            'data' => (new EngagementEStoreRedemptionResource($redemption))->resolve($request),
        ]);
    }
}
