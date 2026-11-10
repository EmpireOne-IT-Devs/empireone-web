<?php

namespace App\Http\Controllers\API\AssetInventory;

use App\Http\Controllers\Controller;
use App\Models\AssetInventory\AssetDevice;
use App\Models\AssetInventory\AssetMonitor;
use App\Models\AssetInventory\AssetOtherAsset;
use App\Models\AssetInventory\AssetPart;
use App\Models\AssetInventory\AssetPeripheral;
use App\Services\AssetImportAiAdvisor;
use App\Services\AssetImportClassifier;
use App\Services\AssetImportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AssetImportController extends Controller
{
    const MODULE_MODELS = [
        'devices' => AssetDevice::class,
        'monitors' => AssetMonitor::class,
        'parts' => AssetPart::class,
        'other_assets' => AssetOtherAsset::class,
        'peripherals' => AssetPeripheral::class,
    ];

    /**
     * Route + validate + warn. No DB write.
     */
    public function analyze(Request $request, AssetImportClassifier $classifier, AssetImportAiAdvisor $ai)
    {
        Gate::authorize('import', AssetDevice::class);

        $request->validate([
            'rows' => ['required', 'array', 'min:1', 'max:500'],
        ]);

        $rows = $request->input('rows');
        $results = [];
        $unknown = [];

        foreach ($rows as $index => $row) {
            $module = $classifier->route($row);

            if ($module === null) {
                $unknown[$index] = $row;
                $results[$index] = [
                    'module' => null,
                    'status' => 'unknown',
                    'warnings' => ['Unrecognized unit — needs review'],
                    'payload' => null,
                ];
                continue;
            }

            [$payload, $errors] = $classifier->normalize($module, $row);

            $results[$index] = [
                'module' => $module,
                'status' => empty($errors) ? 'ready' : 'invalid',
                'warnings' => $errors,
                'payload' => $payload,
            ];
        }

        // AI fallback for rows the rules couldn't route.
        if (!empty($unknown)) {
            $advice = $ai->advise($unknown);
            foreach ($unknown as $index => $row) {
                $suggestion = $advice[$index] ?? null;
                $module = $suggestion['module'] ?? null;
                $warning = $suggestion['warning'] ?? null;

                if ($module && isset(self::MODULE_MODELS[$module])) {
                    [$payload, $errors] = $classifier->normalize($module, $row);
                    $warnings = array_merge($errors, $warning ? [$warning] : []);
                    $results[$index] = [
                        'module' => $module,
                        'status' => empty($errors) ? 'ready' : 'invalid',
                        'warnings' => $warnings,
                        'payload' => $payload,
                        'ai' => true,
                    ];
                } else {
                    $results[$index]['warnings'][] = $warning ?? 'AI could not classify this row';
                }
            }
        }

        // Group counts per module.
        $grouped = [];
        foreach ($results as $r) {
            $key = $r['module'] ?? 'unknown';
            $grouped[$key] = ($grouped[$key] ?? 0) + 1;
        }

        return response()->json([
            'rows' => array_values($results),
            'grouped' => $grouped,
            'ai_used' => !empty($unknown) && $ai->enabled(),
        ]);
    }

    /**
     * Write routed rows to all module tables.
     */
    public function commit(Request $request, AssetImportService $service)
    {
        Gate::authorize('import', AssetDevice::class);

        $request->validate([
            'modules' => ['required', 'array'],
            'modules.*.rows' => ['required', 'array', 'min:1', 'max:500'],
        ]);

        $summary = [];

        foreach ($request->input('modules') as $module => $payload) {
            if (!isset(self::MODULE_MODELS[$module])) {
                continue;
            }
            $modelClass = self::MODULE_MODELS[$module];
            $result = $service->import($modelClass, $payload['rows']);
            $summary[$module] = $result;
        }

        return response()->json(['modules' => $summary]);
    }
}
