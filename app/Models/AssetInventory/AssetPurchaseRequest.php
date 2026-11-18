<?php

namespace App\Models\AssetInventory;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AssetPurchaseRequest extends Model
{
    public const PENDING = 'Pending Approval';
    public const IN_PROGRESS = 'In Progress';
    public const APPROVED = 'Approved';
    public const REJECTED = 'Rejected';

    protected $fillable = [
        'uuid', 'requester_id', 'requester_name', 'requester_email', 'item_name',
        'department', 'department_code', 'category', 'priority', 'quantity',
        'unit_price', 'supplier', 'purchase_date', 'status', 'quotation_path', 'quotation_name',
    ];

    protected $casts = ['unit_price' => 'decimal:2', 'purchase_date' => 'date', 'quantity' => 'integer'];

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public function steps(): HasMany
    {
        return $this->hasMany(AssetPurchaseRequestStep::class, 'purchase_request_id')->orderBy('position');
    }

    public function isPending(): bool
    {
        return in_array($this->status, [self::PENDING, self::IN_PROGRESS], true);
    }
}
