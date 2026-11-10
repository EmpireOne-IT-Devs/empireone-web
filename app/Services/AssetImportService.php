<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

/**
 * Generic import service — duplicate-skip + insert for any asset module.
 */
class AssetImportService
{
    /**
     * @param  class-string  $modelClass  Eloquent model with asset_tag / serial_number.
     * @param  array<int, array<string, mixed>>  $rows  Normalized payloads.
     * @return array{imported: int, skipped: array<int, array{row: int, asset_tag: string, reason: string}>}
     */
    public function import(string $modelClass, array $rows): array
    {
        $assetTags = collect($rows)->pluck('asset_tag')->filter()->unique()->values();
        $serials = collect($rows)->pluck('serial_number')->filter()->unique()->values();

        $existingTags = $modelClass::withTrashed()
            ->whereIn('asset_tag', $assetTags)
            ->pluck('asset_tag')
            ->flip();

        $existingSerials = $serials->isEmpty()
            ? collect()
            : $modelClass::withTrashed()
                ->whereIn('serial_number', $serials)
                ->pluck('serial_number')
                ->flip();

        $now = now();
        $skipped = [];
        $seenTags = [];
        $seenSerials = [];
        $toInsert = [];

        foreach ($rows as $index => $row) {
            $tag = trim((string) ($row['asset_tag'] ?? ''));
            $serial = isset($row['serial_number']) ? trim((string) $row['serial_number']) : null;
            $serial = $serial === '' ? null : $serial;

            if ($tag !== '' && (isset($existingTags[$tag]) || isset($seenTags[$tag]))) {
                $skipped[] = ['row' => $index + 1, 'asset_tag' => $tag, 'reason' => 'Duplicate asset tag'];
                continue;
            }

            if ($serial !== null && (isset($existingSerials[$serial]) || isset($seenSerials[$serial]))) {
                $skipped[] = ['row' => $index + 1, 'asset_tag' => $tag, 'reason' => 'Duplicate serial number'];
                continue;
            }

            if ($tag !== '') {
                $seenTags[$tag] = true;
            }
            if ($serial !== null) {
                $seenSerials[$serial] = true;
            }

            $row['serial_number'] = $serial;
            $row['imported_at'] = $now;
            $toInsert[] = $row;
        }

        DB::transaction(function () use ($modelClass, $toInsert) {
            foreach ($toInsert as $attributes) {
                $modelClass::create($attributes);
            }
        });

        return ['imported' => count($toInsert), 'skipped' => $skipped];
    }
}
