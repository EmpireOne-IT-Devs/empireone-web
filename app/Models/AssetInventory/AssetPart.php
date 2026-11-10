<?php

namespace App\Models\AssetInventory;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class AssetPart extends Model
{
    use SoftDeletes;

    protected $table = 'asset_parts';

    protected $fillable = [
        'uuid', 'asset_tag', 'serial_number', 'name', 'brand', 'part_type',
        'quantity', 'low_stock_threshold', 'status', 'condition', 'nature',
        'price', 'purchase_date', 'account', 'location', 'site', 'notes',
        'imported_at',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'purchase_date' => 'date',
        'imported_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (AssetPart $model) {
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
