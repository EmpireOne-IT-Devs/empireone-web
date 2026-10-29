<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class CocdDetectorService
{
    protected array $catalog;

    public function __construct()
    {
        // Load the clean catalog JSON
        $path = storage_path('app/pdf/cocd_catalog.json');
        $this->catalog = file_exists($path) ? json_decode(file_get_contents($path), true) : [];
    }

    public function detectSection(string $description): array
    {
        // Compact list of options for the AI to pick from
        $options = array_map(function ($item) {
            return [
                'section_number' => $item['section_number'],
                'group'          => $item['group'],
                'title'          => $item['title'],
            ];
        }, $this->catalog);

        $prompt = <<<PROMPT
You are an HR auditor. Given the employee incident below, select the SINGLE most accurate section from the provided list.

INCIDENT:
"{$description}"

OFFICIAL SECTIONS LIST:
JSON:
PROMPT;

        $prompt .= json_encode($options);

        $prompt .= <<<PROMPT


Respond ONLY in valid JSON with:
{
  "selected_section_number": "e.g., 1.20, 1.31, 5.11",
  "explanation": "Why this rule applies to the reported incident"
}
PROMPT;

        try {
            $apiKey = config('services.openai.api_key', env('OPENAI_API_KEY'));

            $response = Http::withToken($apiKey)->post('https://api.openai.com/v1/chat/completions', [
                'model'           => 'gpt-4o-mini',
                'response_format' => ['type' => 'json_object'],
                'messages'        => [
                    ['role' => 'user', 'content' => $prompt],
                ],
                'temperature'     => 0.0,
            ]);

            if ($response->successful()) {
                $result = json_decode($response->json('choices.0.message.content'), true);
                $selectedNumber = $result['selected_section_number'] ?? null;

                // Find the exact item in our catalog
                foreach ($this->catalog as $row) {
                    if ($row['section_number'] === $selectedNumber) {
                        return [
                            'section_number'                 => $row['section_number'],
                            'code_of_discipline_section'     => $row['title'],
                            'classification_group'           => $row['group'],
                            'specific_violation_explanation' => $result['explanation'] ?? '',
                            'sanctions_ladder'               => $row['ladder'],
                            'recommended_penalty'            => $row['ladder']['1st'] ?? 'Written Warning',
                            'clearing_period'                => $row['clearing_period'],
                            'due_process_protocol'           => 'The employee shall be given five (5) days from receipt of the notice of the charge to submit a written explanation to their immediate superior and/or HRD.',
                            'confidence_score'               => 1.0,
                        ];
                    }
                }
            }
        } catch (\Throwable $e) {
            Log::error('COCD Match Error: ' . $e->getMessage());
        }

        return [
            'section_number'                 => 'Pending Review',
            'code_of_discipline_section'     => 'Unclassified Infraction - Pending HR Evaluation',
            'classification_group'           => 'Manual HR Review',
            'specific_violation_explanation' => 'Could not map automatically. Please review manually.',
            'sanctions_ladder'               => [],
            'recommended_penalty'            => 'Subject to Investigation',
            'clearing_period'                => 'N/A',
            'due_process_protocol'           => 'Issue a formal Notice to Explain giving 5 days to respond.',
            'confidence_score'               => 0.0,
        ];
    }
}
