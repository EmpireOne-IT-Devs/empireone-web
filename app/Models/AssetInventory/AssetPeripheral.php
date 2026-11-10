<?php

namespace App\Models\AssetInventory;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class AssetPeripheral extends Model
{
    use SoftDeletes;

    protected $table = 'asset_peripherals';

    protected $fillable = [
        'uuid', 'asset_tag', 'serial_number', 'peripheral_type', 'brand',
        'model', 'description', 'quantity', 'low_stock_threshold', 'status',
        'condition', 'price', 'purchase_date', 'account', 'location', 'site',
        'notes', 'imported_at',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'purchase_date' => 'date',
        'imported_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (AssetPeripheral $model) {
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
