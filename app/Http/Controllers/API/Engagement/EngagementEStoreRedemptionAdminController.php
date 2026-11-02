<?php

namespace App\Http\Controllers\API\Engagement;

use App\Http\Controllers\Controller;
use App\Http\Requests\Engagement\CancelEStoreRedemptionRequest;
use App\Http\Requests\Engagement\RejectEStoreRedemptionRequest;
use App\Http\Requests\Engagement\TransitionEStoreRedemptionRequest;
use App\Http\Resources\Engagement\EngagementEStoreRedemptionResource;
use App\Models\Engagement\EngagementEStorePointTransaction;
use App\Models\Engagement\EngagementEStoreRedemption;
use App\Services\EStoreRedemptionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class EngagementEStoreRedemptionAdminController extends Controller
{
    public function __construct(
        private EStoreRedemptionService $redemptionService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAnyAdmin', EngagementEStoreRedemption::class);

        $validated = $request->validate([
            'status' => ['nullable', 'string', 'in:'.implode(',', EngagementEStoreRedemption::STATUSES)],
            'search' => ['nullable', 'string', 'max:255'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $search = trim((string) ($validated['search'] ?? ''));

        $redemptions = EngagementEStoreRedemption::query()
            ->with(['item', 'employee.account_employee.department', 'histories.actor', 'refund', 'approver', 'processor', 'fulfiller', 'rejecter', 'canceller'])
            ->when($validated['status'] ?? null, fn ($query, $status) => $query->withStatus($status))
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($searchQuery) use ($search) {
                    $searchQuery->where('reference', 'like', "%{$search}%")
                        ->orWhereHas('employee', fn ($employee) => $employee->where('name', 'like', "%{$search}%"))
                        ->orWhereHas('item', fn ($item) => $item->where('product_name', 'like', "%{$search}%"));
                });
            })
            ->latest()
            ->paginate($validated['per_page'] ?? 15);

        return response()->json([
            'status' => 'success',
            ...EngagementEStoreRedemptionResource::collection($redemptions)->response()->getData(true),
        ]);
    }

    public function stats(): JsonResponse
    {
        Gate::authorize('viewAnyAdmin', EngagementEStoreRedemption::class);

        $counts = EngagementEStoreRedemption::query()
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $pointsRedeemed = (int) EngagementEStorePointTransaction::query()
            ->where('type', EngagementEStorePointTransaction::TYPE_DEDUCTION)
            ->sum('points');

        $pointsRefunded = (int) EngagementEStorePointTransaction::query()
            ->where('type', EngagementEStorePointTransaction::TYPE_REFUND)
            ->sum('points');

        return response()->json([
            'status' => 'success',
            'data' => [
                'counts' => collect(EngagementEStoreRedemption::STATUSES)
                    ->mapWithKeys(fn ($status) => [$status => (int) ($counts[$status] ?? 0)]),
                'total_redemptions' => (int) $counts->sum(),
                'points_redeemed' => $pointsRedeemed,
                'points_refunded' => $pointsRefunded,
            ],
        ]);
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

    public function approve(TransitionEStoreRedemptionRequest $request, EngagementEStoreRedemption $redemption): JsonResponse
    {
        Gate::authorize('approve', EngagementEStoreRedemption::class);

        $redemption = $this->redemptionService->approve($redemption, $request->user(), $request->validated()['notes'] ?? null);

        return $this->transitionResponse($request, $redemption, 'Redemption approved.');
    }

    public function process(TransitionEStoreRedemptionRequest $request, EngagementEStoreRedemption $redemption): JsonResponse
    {
        Gate::authorize('process', EngagementEStoreRedemption::class);

        $redemption = $this->redemptionService->process($redemption, $request->user(), $request->validated()['notes'] ?? null);

        return $this->transitionResponse($request, $redemption, 'Redemption marked as processing.');
    }

    public function complete(TransitionEStoreRedemptionRequest $request, EngagementEStoreRedemption $redemption): JsonResponse
    {
        Gate::authorize('complete', EngagementEStoreRedemption::class);

        $redemption = $this->redemptionService->complete($redemption, $request->user(), $request->validated()['notes'] ?? null);

        return $this->transitionResponse($request, $redemption, 'Redemption completed.');
    }

    public function reject(RejectEStoreRedemptionRequest $request, EngagementEStoreRedemption $redemption): JsonResponse
    {
        Gate::authorize('reject', EngagementEStoreRedemption::class);

        $redemption = $this->redemptionService->reject($redemption, $request->user(), $request->validated()['rejection_reason']);

        return $this->transitionResponse($request, $redemption, 'Redemption rejected and points refunded.');
    }

    public function cancel(CancelEStoreRedemptionRequest $request, EngagementEStoreRedemption $redemption): JsonResponse
    {
        Gate::authorize('adminCancel', EngagementEStoreRedemption::class);

        $redemption = $this->redemptionService->cancel($redemption, $request->user(), $request->validated()['reason'] ?? null);

        return $this->transitionResponse($request, $redemption, 'Redemption cancelled and points refunded.');
    }

    private function transitionResponse(Request $request, EngagementEStoreRedemption $redemption, string $message): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'message' => $message,
            'data' => (new EngagementEStoreRedemptionResource($redemption))->resolve($request),
        ]);
    }
}
