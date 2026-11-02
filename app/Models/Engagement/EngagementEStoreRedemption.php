<?php

namespace App\Models\Engagement;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class EngagementEStoreRedemption extends Model
{
    protected $table = 'engagement_e_store_redemptions';

    public const STATUS_PENDING = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_PROCESSING = 'processing';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_CANCELLED = 'cancelled';

    public const STATUSES = [
        self::STATUS_PENDING,
        self::STATUS_APPROVED,
        self::STATUS_PROCESSING,
        self::STATUS_COMPLETED,
        self::STATUS_REJECTED,
        self::STATUS_CANCELLED,
    ];

    public const ALLOWED_TRANSITIONS = [
        self::STATUS_PENDING => [self::STATUS_APPROVED, self::STATUS_REJECTED, self::STATUS_CANCELLED],
        self::STATUS_APPROVED => [self::STATUS_PROCESSING, self::STATUS_CANCELLED],
        self::STATUS_PROCESSING => [self::STATUS_COMPLETED],
        self::STATUS_COMPLETED => [],
        self::STATUS_REJECTED => [],
        self::STATUS_CANCELLED => [],
    ];

    protected $fillable = [
        'reference',
        'user_id',
        'engagement_e_store_id',
        'quantity',
        'unit_point_cost',
        'total_point_cost',
        'status',
        'idempotency_key',
        'approved_by',
        'approved_at',
        'processed_by',
        'processed_at',
        'fulfilled_by',
        'fulfilled_at',
        'rejected_by',
        'rejected_at',
        'cancelled_by',
        'cancelled_at',
        'rejection_reason',
        'cancellation_reason',
        'admin_notes',
        'fulfillment_notes',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'unit_point_cost' => 'integer',
            'total_point_cost' => 'integer',
            'approved_at' => 'datetime',
            'processed_at' => 'datetime',
            'fulfilled_at' => 'datetime',
            'rejected_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'reference';
    }

    public function canTransitionTo(string $status): bool
    {
        return in_array($status, self::ALLOWED_TRANSITIONS[$this->status] ?? [], true);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeWithStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(EngagementEStore::class, 'engagement_e_store_id');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function processor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    public function fulfiller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'fulfilled_by');
    }

    public function rejecter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'rejected_by');
    }

    public function canceller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cancelled_by');
    }

    public function histories(): HasMany
    {
        return $this->hasMany(EngagementEStoreRedemptionHistory::class, 'redemption_id');
    }

    public function pointTransactions(): HasMany
    {
        return $this->hasMany(EngagementEStorePointTransaction::class, 'redemption_id');
    }

    public function deduction(): HasOne
    {
        return $this->hasOne(EngagementEStorePointTransaction::class, 'redemption_id')
            ->where('type', EngagementEStorePointTransaction::TYPE_DEDUCTION);
    }

    public function refund(): HasOne
    {
        return $this->hasOne(EngagementEStorePointTransaction::class, 'redemption_id')
            ->where('type', EngagementEStorePointTransaction::TYPE_REFUND);
    }
}
