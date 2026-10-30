<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CocdDetectorService
{
    protected array $catalog;

    public function __construct()
    {
        $path = storage_path('app/pdf/cocd_catalog.json');
        $this->catalog = file_exists($path) ? json_decode(file_get_contents($path), true) : [];
    }

    public function detectSections(string $description): array
    {
        $options = array_map(function ($item) {
            return [
                'section_number' => $item['section_number'],
                'group'          => $item['group'],
                'title'          => $item['title'],
            ];
        }, $this->catalog);

        $prompt = <<<PROMPT
You are an HR auditor. An incident report may describe one or MORE policy infractions. 
Review the incident description carefully and identify ALL relevant violated sections from the official list below.

INCIDENT:
"{$description}"

OFFICIAL SECTIONS LIST:
PROMPT;

        $prompt .= json_encode($options);

        $prompt .= <<<PROMPT

Respond ONLY in valid JSON matching this schema:
{
  "violations": [
    {
      "section_number": "e.g., 1.18",
      "explanation": "Why this specific rule applies to this part of the incident"
    }
  ]
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
                $detectedViolations = $result['violations'] ?? [];

                $catalogKeyed = collect($this->catalog)->keyBy('section_number');
                $matchedOffenses = [];

                foreach ($detectedViolations as $violation) {
                    $sec = $violation['section_number'] ?? null;
                    if ($sec && isset($catalogKeyed[$sec])) {
                        $matchedOffenses[] = [
                            'section_number'                 => $catalogKeyed[$sec]['section_number'],
                            'code_of_discipline_section'     => $catalogKeyed[$sec]['title'],
                            'classification_group'           => $catalogKeyed[$sec]['group'],
                            'specific_violation_explanation' => $violation['explanation'] ?? '',
                            'sanctions_ladder'               => $catalogKeyed[$sec]['ladder'],
                            'recommended_penalty'            => $catalogKeyed[$sec]['ladder']['1st'] ?? 'Written Warning',
                            'clearing_period'                => $catalogKeyed[$sec]['clearing_period'],
                        ];
                    }
                }

                if (!empty($matchedOffenses)) {
                    return [
                        'total_offenses_detected' => count($matchedOffenses),
                        'offenses'                => $matchedOffenses,
                        'highest_penalty_rule'    => 'When a single act or incident constitutes two or more infractions, the highest applicable penalty shall be imposed.',
                        'due_process_protocol'    => 'The employee shall be given five (5) days from receipt of the notice of charge to submit a written explanation.',
                        'confidence_score'        => 1.0,
                    ];
                }
            }
        } catch (\Throwable $e) {
            Log::error('COCD Multi-Match Error: ' . $e->getMessage());
        }

        return [
            'total_offenses_detected' => 0,
            'offenses'                => [],
            'highest_penalty_rule'    => 'Manual HR Review required.',
            'due_process_protocol'    => 'Issue a formal Notice to Explain giving 5 days to respond.',
            'confidence_score'        => 0.0,
        ];
    }
}
