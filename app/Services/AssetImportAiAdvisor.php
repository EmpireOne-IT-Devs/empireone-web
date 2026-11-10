<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * AI advisor for asset imports. Sends sheet headers + sample rows to OpenAI
 * and returns per-row module suggestions + warnings for rows the deterministic
 * classifier could not route. Falls back silently when no API key is set.
 */
class AssetImportAiAdvisor
{
    const MODULES = 'devices, monitors, parts, other_assets, peripherals';

    public function enabled(): bool
    {
        return !empty(config('services.ai.api_key'));
    }

    /**
     * @param  array<int, array<string, mixed>>  $unknownRows  Rows the rules couldn't route.
     * @return array<int, array{module: string|null, warning: string|null}>
     */
    public function advise(array $unknownRows): array
    {
        if (!$this->enabled() || empty($unknownRows)) {
            return [];
        }

        $sample = array_slice($unknownRows, 0, 50, true);

        $prompt = "You are classifying IT asset inventory rows into modules: " . self::MODULES . ".\n" .
            "Rules: PC/Desktop→devices, Monitor→monitors, UPS→other_assets, Cellphone/Laptop→parts, Mouse/Keyboard/Headset→peripherals.\n" .
            "For each row, return the best module and a short warning if the row has a data problem (missing asset tag, unknown brand, ambiguous unit, etc.).\n" .
            "Respond with ONLY a JSON object keyed by row index: {\"0\":{\"module\":\"devices\",\"warning\":null}, ...}.\n\n" .
            "Rows:\n" . json_encode($sample);

        try {
            $response = Http::withToken(config('services.ai.api_key'))
                ->timeout(60)
                ->post(config('services.ai.base_url') . '/chat/completions', [
                    'model' => config('services.ai.model', 'gpt-4o-mini'),
                    'messages' => [
                        ['role' => 'system', 'content' => 'You are a precise asset classification assistant. Return only valid JSON.'],
                        ['role' => 'user', 'content' => $prompt],
                    ],
                    'temperature' => 0,
                ]);

            $content = $response->json('choices.0.message.content');
            if (!$content) {
                return [];
            }

            $decoded = json_decode(trim($content), true);
            return is_array($decoded) ? $decoded : [];
        } catch (\Throwable $e) {
            Log::warning('AssetImportAiAdvisor failed: ' . $e->getMessage());
            return [];
        }
    }
}
