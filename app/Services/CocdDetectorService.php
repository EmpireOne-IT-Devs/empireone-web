<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class CocdDetectorService
{
    public function __construct(
        protected CocdPolicyReader $policyReader
    ) {}

    public function detectSection(string $description): array
    {
        $pdfText = $this->policyReader->getPolicyContent();

        $systemPrompt = <<<SYS
You are an HR compliance auditor who maps incident reports strictly against the provided Code of Discipline document.
Respond ONLY with a valid JSON object matching this schema:
{
  "section_number": "e.g., 4.82",
  "code_of_discipline_section": "e.g., Section 4.82: Engaging in scandalous or indecent acts within or outside Company premises while on duty",
  "classification_group": "e.g., Group IV: Provisions on Conduct, Integrity and Office Decorum",
  "specific_violation_explanation": "Detailed explanation of what the rule prohibits and why the described act breaches it",
  "sanctions_ladder": {
    "1st": "Penalty for 1st offense (e.g., T, WW, VW)",
    "2nd": "Penalty for 2nd offense or N/A",
    "3rd": "Penalty for 3rd offense or N/A",
    "4th": "Penalty for 4th offense or N/A"
  },
  "recommended_penalty": "Immediate penalty applicable for a 1st occurrence (e.g., Termination (T) or Written Warning (WW))",
  "clearing_period": "Clearing period according to the document",
  "due_process_protocol": "Procedural due process requirements according to the document",
  "confidence_score": 0.00
}
SYS;

        // Combines prompt + reference document exactly like your reference method
        $fullPrompt = $description . "\n\nReference Document:\n" . $pdfText;

        $response = Http::withToken(env('OPENAI_API_KEY'))->post('https://api.openai.com/v1/chat/completions', [
            'model' => 'gpt-4o-mini',
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user', 'content' => $fullPrompt],
            ],
            'temperature' => 0,
            'max_tokens'  => 1024,
        ]);

        if ($response->successful()) {
            $rawOutput = trim($response['choices'][0]['message']['content'] ?? '');
            $data = json_decode($rawOutput, true);

            if (is_array($data) && !empty($data['section_number'])) {
                return $data;
            }
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
