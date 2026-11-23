<?php

namespace App\Services;

use App\Models\AssetInventory\AssetDevice;
use App\Models\AssetInventory\AssetMonitor;
use App\Models\AssetInventory\AssetOtherAsset;
use App\Models\AssetInventory\AssetPart;
use App\Models\AssetInventory\AssetPeripheral;
use Illuminate\Pagination\LengthAwarePaginator;

class AssetInventorySearch
{
    public const SOURCES = [
        AssetDevice::class => ['devices', 'device_type', ['brand', 'model', 'availability', 'issued_to', 'received_by']],
        AssetMonitor::class => ['monitors', 'monitor_type', ['brand', 'model', 'availability', 'issued_to', 'received_by']],
        AssetPeripheral::class => ['peripherals', 'peripheral_type', ['brand', 'model', 'quantity', 'description']],
        AssetPart::class => ['parts', 'part_type', ['name', 'brand', 'quantity']],
        AssetOtherAsset::class => ['other_assets', 'category', ['name', 'assigned_to']],
    ];

    public function paginate(array $filters): LengthAwarePaginator
    {
        $category = $filters['category'] ?? null;
        $search = trim($filters['search'] ?? '');
        $pattern = '%'.strtr($search, ['!' => '!!', '%' => '!%', '_' => '!_']).'%';
        $union = null;

        foreach (self::SOURCES as $model => [$key, $type, $columns]) {
            if ($category !== null && $category !== $key) {
                continue;
            }

            $query = $model::query()->select([
                'uuid', 'asset_tag', 'serial_number', 'status', 'condition', 'price', 'purchase_date', 'created_at',
                $type.' as asset_type',
            ])->selectRaw('? as inventory_category', [$key]);

            foreach (['name', 'brand', 'model', 'availability', 'issued_to', 'received_by', 'quantity'] as $field) {
                if (in_array($field, $columns, true)) {
                    $query->addSelect($field);
                } elseif ($field === 'issued_to' && in_array('assigned_to', $columns, true)) {
                    $query->addSelect('assigned_to as issued_to');
                } else {
                    $query->selectRaw("NULL as {$field}");
                }
            }

            if ($search !== '') {
                $searchColumns = array_merge(['asset_tag', 'serial_number', $type],
                    array_intersect(['name', 'brand', 'model', 'description', 'issued_to', 'assigned_to'], $columns));
                $query->where(function ($query) use ($pattern, $searchColumns) {
                    $grammar = $query->getQuery()->getGrammar();
                    foreach ($searchColumns as $field) {
                        $query->orWhereRaw($grammar->wrap($field)." LIKE ? ESCAPE '!'", [$pattern]);
                    }
                });
            }

            if (isset($filters['status'])) {
                $query->where('status', $filters['status']);
            }
            if (isset($filters['availability'])) {
                in_array('availability', $columns, true)
                    ? $query->where('availability', $filters['availability'])
                    : $query->whereRaw('1 = 0');
            }
            if (isset($filters['device_type'])) {
                $key === 'devices'
                    ? $query->where('device_type', $filters['device_type'])
                    : $query->whereRaw('1 = 0');
            }

            $branch = $query->toBase();
            $union = $union === null ? $branch : $union->unionAll($branch);
        }

        return $union->getConnection()->query()->fromSub($union, 'inventory')
            ->orderByDesc('created_at')->orderBy('inventory_category')->orderBy('uuid')
            ->paginate($filters['per_page'] ?? 10, ['*'], 'page', $filters['page'] ?? 1)
            ->appends($filters);
    }
}
