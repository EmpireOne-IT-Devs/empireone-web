<?php

namespace App\Models\AssetInventory;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class AssetDevice extends Model
{
    use SoftDeletes;

    protected $table = 'asset_devices';

    protected $fillable = [
        'uuid',
        'asset_tag',
        'serial_number',
        'device_type',
        'brand',
        'model',
        'status',
        'availability',
        'condition',
        'nature',
        'price',
        'purchase_date',
        'account',
        'issued_to',
        'received_by',
        'location',
        'site',
        'notes',
        'imported_at',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'purchase_date' => 'date',
        'imported_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (AssetDevice $device) {
            if (empty($device->uuid)) {
                $device->uuid = (string) Str::uuid();
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }
}
