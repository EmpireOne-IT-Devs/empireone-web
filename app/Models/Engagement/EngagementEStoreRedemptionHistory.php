<?php

namespace App\Models\Engagement;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EngagementEStoreRedemptionHistory extends Model
{
    protected $table = 'engagement_e_store_redemption_histories';

    protected $fillable = [
        'redemption_id',
        'from_status',
        'to_status',
        'actor_id',
        'notes',
    ];

    public function redemption(): BelongsTo
    {
        return $this->belongsTo(EngagementEStoreRedemption::class, 'redemption_id');
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }
}
