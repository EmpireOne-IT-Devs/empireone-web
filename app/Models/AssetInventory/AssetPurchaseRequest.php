<?php

namespace App\Models\AssetInventory;

use Brick\Math\BigDecimal;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AssetPurchaseRequest extends Model
{
    public const PENDING = 'Pending Approval';
    public const IN_PROGRESS = 'In Progress';
    public const APPROVED = 'Approved';
    public const REJECTED = 'Rejected';

    protected $fillable = [
        'uuid', 'purchase_request_id', 'requester_id', 'requester_name', 'requester_email', 'item_name',
        'items', 'justification', 'department', 'department_code', 'category', 'priority', 'quantity',
        'unit_price', 'supplier', 'purchase_date', 'status', 'quotation_path', 'quotation_name',
    ];

    protected $casts = ['unit_price' => 'decimal:2', 'purchase_date' => 'date', 'quantity' => 'integer', 'items' => 'array'];

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public function reference(): string
    {
        return $this->purchase_request_id ?? sprintf('PR-%03d', $this->getKey());
    }

    public function steps(): HasMany
    {
        return $this->hasMany(AssetPurchaseRequestStep::class, 'purchase_request_id')->orderBy('position');
    }

    public function itemLines(): array
    {
        return array_map(static fn (array $item) => [
            'description' => $item['description'],
            'quantity' => $item['quantity'],
            'unitCost' => $item['unit_cost'],
            'lineTotal' => (string) BigDecimal::of($item['unit_cost'])->multipliedBy($item['quantity']),
        ], $this->items ?? []);
    }

    public function grandTotal(): string
    {
        $total = BigDecimal::of('0.00');
        foreach ($this->itemLines() as $item) {
            $total = $total->plus($item['lineTotal']);
        }

        return (string) $total;
    }

    public function isPending(): bool
    {
        return in_array($this->status, [self::PENDING, self::IN_PROGRESS], true);
    }
}
