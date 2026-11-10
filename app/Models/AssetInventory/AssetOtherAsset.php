<?php

namespace App\Models\AssetInventory;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class AssetOtherAsset extends Model
{
    use SoftDeletes;

    protected $table = 'asset_other_assets';

    protected $fillable = [
        'uuid', 'asset_tag', 'serial_number', 'name', 'category', 'details',
        'status', 'condition', 'nature', 'price', 'purchase_date', 'account',
        'assigned_to', 'location', 'site', 'notes', 'imported_at',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'purchase_date' => 'date',
        'imported_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (AssetOtherAsset $model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }
}
