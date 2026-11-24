<?php

namespace App\Models\AssetInventory;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class AssetSystemUnit extends Model
{
    use SoftDeletes;

    public const TYPES = ['Desktop', 'Workstation', 'Server'];

    public const STATUSES = ['Available', 'Assigned', 'Maintenance', 'Retired'];

    private const TAG_PREFIX = 'SU-';

    protected $table = 'asset_system_units';

    protected $fillable = [
        'asset_tag', 'serial_number', 'name', 'system_type', 'cpu', 'ram', 'storage', 'os', 'status',
        'condition', 'nature', 'purchase_date', 'account', 'location', 'station', 'imported_at',
    ];

    protected $casts = [
        'purchase_date' => 'date',
        'imported_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (AssetSystemUnit $model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
            if (empty($model->asset_tag)) {
                $model->asset_tag = static::nextAssetTag();
            }
        });
    }

    // Format: SU-0001. Deleted units keep their tag, so numbers are never reused.
    private static function nextAssetTag(): string
    {
        $latest = static::withTrashed()
            ->whereLike('asset_tag', self::TAG_PREFIX.'%')
            ->orderByRaw('LENGTH(asset_tag) DESC')
            ->orderByDesc('asset_tag')
            ->value('asset_tag');
        $number = $latest === null ? 1 : (int) substr($latest, strlen(self::TAG_PREFIX)) + 1;

        // Imported tags can also start with the prefix without following the number format.
        while (static::withTrashed()->where('asset_tag', sprintf('%s%04d', self::TAG_PREFIX, $number))->exists()) {
            $number++;
        }

        return sprintf('%s%04d', self::TAG_PREFIX, $number);
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }
}
