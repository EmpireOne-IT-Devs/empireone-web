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
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'point_cost' => 'integer',
            'quantity' => 'integer',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by');
    }

    public function files(): HasMany
    {
        return $this->hasMany(EngagementPostEventFile::class, 'engagement_e_store_id');
    }
}
