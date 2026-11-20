<?php

namespace App\Models\AssetInventory;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class AssetItemRequest extends Model
{
    public const PENDING = 'Pending Approval';

    public const IN_PROGRESS = 'In Progress';

    public const APPROVED = 'Approved';

    public const REJECTED = 'Rejected';

    public const ISSUED = 'Issued';

    public const CANCELLED = 'Cancelled';

    public const STATUSES = [self::PENDING, self::IN_PROGRESS, self::APPROVED, self::REJECTED, self::ISSUED, self::CANCELLED];

    public const ASSETS = [
        'devices' => AssetDevice::class,
        'monitors' => AssetMonitor::class,
        'peripherals' => AssetPeripheral::class,
        'parts' => AssetPart::class,
        'other_assets' => AssetOtherAsset::class,
    ];

    protected $fillable = [
        'uuid', 'item_request_id', 'requester_id', 'assignee_id', 'requester_name',
        'requester_email', 'assignee_name', 'assignee_email', 'employee_number',
        'department', 'asset_type', 'asset_id', 'asset_tag', 'asset_name', 'request_type',
        'priority', 'from_date', 'until_date', 'justification', 'purpose', 'status', 'reservation_active',
    ];

    protected $casts = ['from_date' => 'date', 'until_date' => 'date', 'reservation_active' => 'boolean'];

    public static function availableAssets(string $type): Builder
    {
        $query = self::ASSETS[$type]::query();

        return match ($type) {
            'devices', 'monitors' => $query->where('availability', 'Available'),
            'other_assets' => $query->where(fn (Builder $asset) => $asset->whereNull('assigned_to')->orWhere('assigned_to', '')),
            'parts', 'peripherals' => $query->where('quantity', '>=', 1),
        };
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public function steps(): HasMany
    {
        return $this->hasMany(AssetItemRequestStep::class, 'item_request_id')->orderBy('position');
    }

    public function liabilityForm(): HasOne
    {
        return $this->hasOne(AssetLiabilityForm::class, 'item_request_id');
    }

    public function isPending(): bool
    {
        return in_array($this->status, [self::PENDING, self::IN_PROGRESS], true);
    }
}
