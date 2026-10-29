<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CocdDetectorService
{
    public function __construct(
        protected CocdPolicyReader $policyReader
    ) {}

    public function detectSection(string $description): array
    {
        $pdfText = $this->policyReader->getPolicyContent();

        $systemPrompt = <<<SYS
You are an HR compliance auditor who maps employee incident reports strictly against the provided Code of Discipline document.

INSTRUCTIONS:
1. Identify the specific rule that governs the reported conduct.
   - Match by the underlying violation (e.g., "smoking on the production floor" falls under rules covering smoking in unauthorized/non-designated areas, premises safety, fire regulations, or unauthorized items on the work floor).
2. The section title and section number MUST be drawn directly from the Reference Document.
3. If multiple sections apply, select the most specific one.
4. If the action is genuinely not addressed in any form anywhere in the text, only then return "Unclassified".
5. Extract the exact penalties from the sanctions ladder table for that specific rule (1st, 2nd, 3rd, 4th offenses).

Respond ONLY with a valid JSON object matching this schema:
{
  "section_number": "Section number from the document (e.g., 5.11 or IV.B)",
  "code_of_discipline_section": "Official title or full text of the matched section",
  "classification_group": "Group or category header (e.g., Office Decorum, Safety & Security)",
  "specific_violation_explanation": "Explain clearly how the incident fits this specific section",
  "sanctions_ladder": {
    "1st": "1st offense sanction",
    "2nd": "2nd offense sanction or N/A",
    "3rd": "3rd offense sanction or N/A",
    "4th": "4th offense sanction or N/A"
  },
  "recommended_penalty": "Immediate penalty applicable for a 1st occurrence",
  "clearing_period": "Clearing period according to the document",
  "due_process_protocol": "Due process procedure according to the document",
  "confidence_score": 0.85
}
SYS;

        $fullPrompt = "INCIDENT REPORT:\n\"{$description}\"\n\nREFERENCE DOCUMENT:\n" . $pdfText;

        try {
            $apiKey = config('services.openai.api_key', env('OPENAI_API_KEY'));

            $response = Http::withToken($apiKey)->post('https://api.openai.com/v1/chat/completions', [
                'model'           => 'gpt-4o-mini',
                'response_format' => ['type' => 'json_object'],
                'messages'        => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $fullPrompt],
                ],
                'temperature'     => 0.0,
                'max_tokens'      => 1200,
            ]);

            if ($response->successful()) {
                $rawOutput = trim($response->json('choices.0.message.content') ?? '');
                $data = json_decode($rawOutput, true);

                if (is_array($data) && !empty($data['section_number'])) {
                    return $data;
                }
            } else {
                Log::error('OpenAI Error: ' . $response->body());
            }
        } catch (\Throwable $e) {
            Log::error('CocdDetectorService Exception: ' . $e->getMessage());
        }

        return [
            'section_number'                 => 'Pending Review',
            'code_of_discipline_section'     => 'Unclassified Infraction - Pending HR Evaluation',
            'classification_group'           => 'Manual HR Review',
            'specific_violation_explanation' => "The report ('{$description}') could not be automatically mapped from the document. Please consult HR directly.",
            'sanctions_ladder'               => [],
            'recommended_penalty'            => 'Subject to Investigation',
            'clearing_period'                => 'N/A',
            'due_process_protocol'           => 'Issue a formal Notice to Explain giving 5 days to respond.',
            'confidence_score'               => 0.0,
        ];
    }
}
