<?php

namespace App\Services;

use Illuminate\Support\Carbon;

/**
 * Deterministic routing + normalization for asset inventory imports.
 * Maps a raw Excel row to a target module and a normalized payload.
 */
class AssetImportClassifier
{
    // Unit value → module key.
    const UNIT_ROUTES = [
        'pc' => 'system_units',
        'desktop' => 'system_units',
        'monitor' => 'monitors',
        'ups' => 'other_assets',
        'cellphone' => 'parts',
        'laptop' => 'parts',
        'mouse' => 'peripherals',
        'keyboard' => 'peripherals',
        'headset' => 'peripherals',
    ];

    const STATUS_MAP = [
        'good' => 'Working',
        'working' => 'Working',
        'new' => 'New',
        'damage' => 'Defective',
        'damaged' => 'Defective',
        'defective' => 'Defective',
        'for repair' => 'For Repair',
        'repair' => 'For Repair',
    ];

    const CONDITION_MAP = [
        'brandnew' => 'Brandnew',
        'brand new' => 'Brandnew',
        'second hand' => 'Second Hand',
        'secondhand' => 'Second Hand',
    ];

    const NATURE_MAP = [
        'dedicated' => 'Dedicated',
        'shared' => 'Shared',
    ];

    /**
     * Route a row to a module. Returns module key or null when unknown.
     */
    public function route(array $row): ?string
    {
        $unit = strtolower(trim((string) ($row['unit'] ?? $row['device_type'] ?? '')));
        return self::UNIT_ROUTES[$unit] ?? null;
    }

    public function status(?string $value): string
    {
        $key = strtolower(trim((string) $value));
        return self::STATUS_MAP[$key] ?? 'Working';
    }

    public function condition(?string $value): ?string
    {
        $key = strtolower(trim((string) $value));
        return self::CONDITION_MAP[$key] ?? null;
    }

    public function nature(?string $value): ?string
    {
        $key = strtolower(trim((string) $value));
        return self::NATURE_MAP[$key] ?? null;
    }

    public function isStock(?string $account): bool
    {
        return strtolower(trim((string) $account)) === 'stock';
    }

    /**
     * Sheets write "None" or "N/A" where a value is missing; treat both as empty.
     */
    public function text($value): string
    {
        $text = trim((string) $value);

        return in_array(strtolower($text), ['none', 'n/a'], true) ? '' : $text;
    }

    /**
     * Converts a sheet date (Excel serial number or date text) to Y-m-d.
     * Returns null for empty or non-date values such as "Undetermined".
     */
    public function date($value): ?string
    {
        $text = $this->text($value);
        if ($text === '' || ! preg_match('/\d/', $text)) {
            return null;
        }
        if (is_numeric($text)) {
            // Excel counts days from 1899-12-30.
            $days = (int) $text;

            return $days > 20000 && $days < 80000
                ? Carbon::create(1899, 12, 30)->addDays($days)->toDateString()
                : null;
        }
        try {
            return Carbon::parse($text)->toDateString();
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * Build the normalized payload for a module from a raw row.
     * Returns [payload, errors[]].
     */
    public function normalize(string $module, array $row): array
    {
        $assetTag = $this->text($row['asset_tag'] ?? '');
        $serial = $this->text($row['serial_number'] ?? $row['sn'] ?? '');
        $serial = $serial === '' ? null : $serial;
        $brand = trim((string) ($row['brand'] ?? $row['model'] ?? ''));
        $status = $this->status($row['status'] ?? null);
        $condition = $this->condition($row['condition'] ?? null);
        $nature = $this->nature($row['nature'] ?? null);
        $account = trim((string) ($row['account'] ?? $row['remarks'] ?? '')) ?: null;
        $purchaseDate = $this->date($row['purchase_date'] ?? $row['date_purchased'] ?? null);
        $isStock = $this->isStock($account);

        $errors = [];
        // System units without a tag get one generated when they are saved.
        if ($assetTag === '' && $module !== 'system_units') {
            $errors[] = 'Asset tag is required';
        }

        $base = [
            'asset_tag' => $assetTag,
            'serial_number' => $serial,
            'status' => $status,
            'condition' => $condition,
            'price' => null,
            'purchase_date' => $purchaseDate,
            'account' => $account,
            'location' => null,
            'site' => null,
            'notes' => null,
        ];

        switch ($module) {
            case 'system_units':
                $name = $this->text($brand);

                return [[
                    'asset_tag' => $assetTag,
                    'serial_number' => $serial,
                    'name' => $name !== '' ? $name : 'PC',
                    'system_type' => 'Desktop',
                    'status' => $status !== 'Working' && $status !== 'New'
                        ? 'Maintenance'
                        : ($isStock ? 'Available' : 'Assigned'),
                    'condition' => $condition,
                    'nature' => $nature,
                    'purchase_date' => $purchaseDate,
                    'account' => $account,
                ], $errors];

            case 'devices':
                if ($brand === '' || strtoupper($brand) === 'N/A') {
                    $errors[] = 'Brand is required';
                }
                return [[
                    'asset_tag' => $assetTag,
                    'serial_number' => $serial,
                    'device_type' => 'Desktop',
                    'brand' => $brand,
                    'model' => null,
                    'status' => $status,
                    'availability' => $isStock ? 'Available' : 'Assigned',
                    'condition' => $condition,
                    'nature' => $nature,
                    'price' => null,
                    'purchase_date' => $purchaseDate,
                    'account' => $account,
                    'issued_to' => $isStock ? null : $account,
                    'received_by' => null,
                    'location' => null,
                    'site' => null,
                    'notes' => null,
                ], $errors];

            case 'monitors':
                if ($brand === '' || strtoupper($brand) === 'N/A') {
                    $errors[] = 'Brand is required';
                }
                return [array_merge($base, [
                    'brand' => $brand,
                    'model' => null,
                    'screen_size' => null,
                    'resolution' => null,
                    'monitor_type' => null,
                    'availability' => $isStock ? 'Available' : 'Assigned',
                    'nature' => $nature,
                    'issued_to' => $isStock ? null : $account,
                    'received_by' => null,
                ]), $errors];

            case 'parts':
                $unit = strtolower(trim((string) ($row['unit'] ?? '')));
                $partType = $unit === 'laptop' ? 'Laptop' : 'Cellphone';
                return [array_merge($base, [
                    'name' => $brand !== '' ? $brand : $partType,
                    'brand' => $brand !== '' ? $brand : null,
                    'part_type' => $partType,
                    'quantity' => 1,
                    'low_stock_threshold' => 0,
                    'nature' => $nature,
                ]), $errors];

            case 'other_assets':
                return [array_merge($base, [
                    'name' => $brand !== '' ? $brand . ' UPS' : 'UPS',
                    'category' => 'Appliance',
                    'details' => 'UPS (Uninterruptible Power Supply)',
                    'nature' => $nature,
                    'assigned_to' => $isStock ? null : $account,
                ]), $errors];

            case 'peripherals':
                $unit = strtolower(trim((string) ($row['unit'] ?? '')));
                $type = ucfirst($unit);
                return [array_merge($base, [
                    'peripheral_type' => $type,
                    'brand' => $brand !== '' ? $brand : null,
                    'model' => null,
                    'description' => null,
                    'quantity' => 1,
                    'low_stock_threshold' => 0,
                ]), $errors];

            default:
                return [[], ['Unknown module']];
        }
    }
}
