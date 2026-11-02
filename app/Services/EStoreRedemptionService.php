<?php

namespace App\Services;

use App\Models\Engagement\EngagementEStore;
use App\Models\Engagement\EngagementEStorePointTransaction;
use App\Models\Engagement\EngagementEStoreRedemption;
use App\Models\Engagement\EngagementEStoreRedemptionHistory;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;

/**
 * Coordinates the E-Store redemption lifecycle.
 *
 * Every state-changing operation runs inside a database transaction with
 * row-level locking. Lock order is always: redemption/user row first, then
 * the engagement_e_stores item row, to keep deadlock risk minimal.
 */
class EStoreRedemptionService
{
    public function __construct(
        private EmployeePointsService $pointsService,
    ) {}

    public function redeem(User $user, array $data): EngagementEStoreRedemption
    {
        $idempotencyKey = $data['idempotency_key'];

        $existing = $this->findByIdempotencyKey($user->id, $idempotencyKey);
        if ($existing) {
            return $existing;
        }

        $attempts = 0;
        while (true) {
            $attempts++;
            try {
                return DB::transaction(function () use ($user, $data, $idempotencyKey) {
                    // Consistent lock order: user row, then item row.
                    User::query()->whereKey($user->id)->lockForUpdate()->first();

                    $item = EngagementEStore::query()
                        ->whereKey($data['engagement_e_store_id'])
                        ->lockForUpdate()
                        ->first();

                    abort_unless($item, 404, 'This reward item no longer exists.');
                    abort_unless($item->is_active, 422, 'This reward item is not available for redemption.');

                    $quantity = (int) $data['quantity'];
                    abort_unless($quantity >= 1, 422, 'Quantity must be at least 1.');

                    $stock = null;
                    if (! $item->isUnlimited()) {
                        $stock = (int) ($item->quantity ?? 0);
                        abort_unless($stock >= $quantity, 422, 'Insufficient stock for this reward item.');
                    }

                    $unitCost = (int) $item->point_cost;
                    $totalCost = $unitCost * $quantity;
                    abort_unless($totalCost >= 0 && $totalCost <= PHP_INT_MAX, 422, 'Invalid redemption cost.');

                    $spendable = $this->pointsService->spendablePoints($user->id);
                    abort_unless($spendable >= $totalCost, 422, 'You do not have enough points to redeem this reward.');

                    $redemption = EngagementEStoreRedemption::create([
                        'reference' => $this->generateReference(),
                        'user_id' => $user->id,
                        'engagement_e_store_id' => $item->id,
                        'quantity' => $quantity,
                        'unit_point_cost' => $unitCost,
                        'total_point_cost' => $totalCost,
                        'status' => EngagementEStoreRedemption::STATUS_PENDING,
                        'idempotency_key' => $idempotencyKey,
                    ]);

                    EngagementEStorePointTransaction::create([
                        'user_id' => $user->id,
                        'redemption_id' => $redemption->id,
                        'type' => EngagementEStorePointTransaction::TYPE_DEDUCTION,
                        'points' => $totalCost,
                        'created_by' => $user->id,
                    ]);

                    if ($stock !== null) {
                        $item->quantity = $stock - $quantity;
                        $item->save();
                    }

                    $this->recordHistory($redemption, null, EngagementEStoreRedemption::STATUS_PENDING, $user->id, 'Redemption request submitted.');

                    return $redemption->load(['item', 'histories.actor']);
                }, 3);
            } catch (QueryException $e) {
                if ($this->isIdempotencyViolation($e)) {
                    $existing = $this->findByIdempotencyKey($user->id, $idempotencyKey);
                    if ($existing) {
                        return $existing;
                    }
                }

                // Two concurrent requests generated the same daily reference; retry with a fresh count.
                if ($this->isReferenceViolation($e) && $attempts < 3) {
                    continue;
                }

                throw $e;
            }
        }
    }

    public function approve(EngagementEStoreRedemption $redemption, User $admin, ?string $notes = null): EngagementEStoreRedemption
    {
        return $this->transitionLocked($redemption, EngagementEStoreRedemption::STATUS_APPROVED, $admin, $notes, function ($locked) use ($admin, $notes) {
            $locked->approved_by = $admin->id;
            $locked->approved_at = now();
            if ($notes !== null && $notes !== '') {
                $locked->admin_notes = $notes;
            }
        });
    }

    public function process(EngagementEStoreRedemption $redemption, User $admin, ?string $notes = null): EngagementEStoreRedemption
    {
        return $this->transitionLocked($redemption, EngagementEStoreRedemption::STATUS_PROCESSING, $admin, $notes, function ($locked) use ($admin) {
            $locked->processed_by = $admin->id;
            $locked->processed_at = now();
        });
    }

    public function complete(EngagementEStoreRedemption $redemption, User $admin, ?string $notes = null): EngagementEStoreRedemption
    {
        return $this->transitionLocked($redemption, EngagementEStoreRedemption::STATUS_COMPLETED, $admin, $notes, function ($locked) use ($admin, $notes) {
            $locked->fulfilled_by = $admin->id;
            $locked->fulfilled_at = now();
            if ($notes !== null && $notes !== '') {
                $locked->fulfillment_notes = $notes;
            }
        });
    }

    public function reject(EngagementEStoreRedemption $redemption, User $admin, string $reason): EngagementEStoreRedemption
    {
        return $this->transitionLocked($redemption, EngagementEStoreRedemption::STATUS_REJECTED, $admin, $reason, function ($locked) use ($admin, $reason) {
            $locked->rejected_by = $admin->id;
            $locked->rejected_at = now();
            $locked->rejection_reason = $reason;
            $this->refundLocked($locked, $admin->id);
            $this->restoreStockLocked($locked);
        });
    }

    public function cancel(EngagementEStoreRedemption $redemption, User $actor, ?string $reason = null): EngagementEStoreRedemption
    {
        return $this->transitionLocked($redemption, EngagementEStoreRedemption::STATUS_CANCELLED, $actor, $reason, function ($locked) use ($actor, $reason) {
            $locked->cancelled_by = $actor->id;
            $locked->cancelled_at = now();
            if ($reason !== null && $reason !== '') {
                $locked->cancellation_reason = $reason;
            }
            $this->refundLocked($locked, $actor->id);
            $this->restoreStockLocked($locked);
        });
    }

    private function transitionLocked(EngagementEStoreRedemption $redemption, string $to, User $actor, ?string $notes, callable $mutate): EngagementEStoreRedemption
    {
        return DB::transaction(function () use ($redemption, $to, $actor, $notes, $mutate) {
            $locked = EngagementEStoreRedemption::query()
                ->whereKey($redemption->id)
                ->lockForUpdate()
                ->firstOrFail();

            abort_unless(
                $locked->canTransitionTo($to),
                422,
                "Cannot change a redemption from '{$locked->status}' to '{$to}'."
            );

            $from = $locked->status;
            $locked->status = $to;
            $mutate($locked);
            $locked->save();

            $this->recordHistory($locked, $from, $to, $actor->id, $notes);

            return $locked->fresh(['item', 'employee.account_employee', 'histories.actor']);
        }, 3);
    }

    private function refundLocked(EngagementEStoreRedemption $redemption, int $actorId): void
    {
        if ($redemption->refund()->exists()) {
            return;
        }

        try {
            EngagementEStorePointTransaction::create([
                'user_id' => $redemption->user_id,
                'redemption_id' => $redemption->id,
                'type' => EngagementEStorePointTransaction::TYPE_REFUND,
                'points' => $redemption->total_point_cost,
                'created_by' => $actorId,
            ]);
        } catch (QueryException $e) {
            // UNIQUE(redemption_id, type) makes a second refund impossible; treat as already refunded.
            if (! str_contains($e->getMessage(), 'redemption_id')) {
                throw $e;
            }
        }
    }

    private function restoreStockLocked(EngagementEStoreRedemption $redemption): void
    {
        $item = EngagementEStore::query()
            ->whereKey($redemption->engagement_e_store_id)
            ->lockForUpdate()
            ->first();

        if (! $item || $item->isUnlimited()) {
            return;
        }

        $item->quantity = (int) $item->quantity + (int) $redemption->quantity;
        $item->save();
    }

    private function recordHistory(EngagementEStoreRedemption $redemption, ?string $from, string $to, ?int $actorId, ?string $notes = null): void
    {
        EngagementEStoreRedemptionHistory::create([
            'redemption_id' => $redemption->id,
            'from_status' => $from,
            'to_status' => $to,
            'actor_id' => $actorId,
            'notes' => $notes,
        ]);
    }

    private function generateReference(): string
    {
        $date = now()->format('Ymd');
        $count = EngagementEStoreRedemption::query()
            ->whereDate('created_at', now()->toDateString())
            ->count();

        return sprintf('ES-%s-%04d', $date, $count + 1);
    }

    private function findByIdempotencyKey(int $userId, string $key): ?EngagementEStoreRedemption
    {
        return EngagementEStoreRedemption::query()
            ->where('user_id', $userId)
            ->where('idempotency_key', $key)
            ->first()
            ?->load(['item', 'histories.actor']);
    }

    private function isIdempotencyViolation(QueryException $e): bool
    {
        return $this->isUniqueViolation($e) && str_contains($e->getMessage(), 'idempotency_key');
    }

    private function isReferenceViolation(QueryException $e): bool
    {
        return $this->isUniqueViolation($e) && str_contains($e->getMessage(), 'reference');
    }

    private function isUniqueViolation(QueryException $e): bool
    {
        return $e->getCode() === '23000' || str_contains($e->getMessage(), 'Duplicate entry');
    }
}
