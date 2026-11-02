<?php

namespace App\Models\Engagement;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EngagementEStorePointTransaction extends Model
{
    protected $table = 'engagement_e_store_point_transactions';

    public const TYPE_DEDUCTION = 'deduction';
    public const TYPE_REFUND = 'refund';

    public const TYPES = [
        self::TYPE_DEDUCTION,
        self::TYPE_REFUND,
    ];

    protected $fillable = [
        'user_id',
        'redemption_id',
        'type',
        'points',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'points' => 'integer',
        ];
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function redemption(): BelongsTo
    {
        return $this->belongsTo(EngagementEStoreRedemption::class, 'redemption_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
