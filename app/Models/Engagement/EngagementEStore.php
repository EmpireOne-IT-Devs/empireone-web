<?php

namespace App\Models\Engagement;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class EngagementEStore extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'product_image',
        'product_name',
        'customer_description',
        'reward_type',
        'point_cost',
        'quantity',
        'is_active',
        'is_unlimited_stock',
        'created_by',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'point_cost' => 'integer',
            'quantity' => 'integer',
            'is_active' => 'boolean',
            'is_unlimited_stock' => 'boolean',
        ];
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function isUnlimited(): bool
    {
        return (bool) $this->is_unlimited_stock;
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'updated_by');
    }

    public function files(): HasMany
    {
        return $this->hasMany(EngagementPostEventFile::class, 'engagement_e_store_id');
    }

    public function redemptions(): HasMany
    {
        return $this->hasMany(EngagementEStoreRedemption::class, 'engagement_e_store_id');
    }
}
