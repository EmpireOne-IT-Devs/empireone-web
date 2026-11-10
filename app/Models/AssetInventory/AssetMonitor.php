<?php

namespace App\Models\AssetInventory;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class AssetMonitor extends Model
{
    use SoftDeletes;

    protected $table = 'asset_monitors';

    protected $fillable = [
        'uuid', 'asset_tag', 'serial_number', 'brand', 'model', 'screen_size',
        'resolution', 'monitor_type', 'status', 'availability', 'condition',
        'nature', 'price', 'purchase_date', 'account', 'issued_to',
        'received_by', 'location', 'site', 'notes', 'imported_at',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'purchase_date' => 'date',
        'imported_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (AssetMonitor $model) {
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
