<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AIService
{
    /**
     * Generates 5 technical questions using GPT-4o.
     */
    public function generateQuestions($jobTitle)
    {
        try {
            $response = Http::withToken(env('OPENAI_API_KEY'))
                ->post('https://api.openai.com/v1/chat/completions', [
                    'model' => 'gpt-4o',
                    'response_format' => ['type' => 'json_object'],
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => 'You are a technical interviewer. Generate exactly 5 short questions. Return ONLY a JSON object: {"questions": ["q1", "q2", "q3", "q4", "q5"]}'
                        ],
                        ['role' => 'user', 'content' => "Questions for: $jobTitle"]
                    ]
                ]);

            $data = $response->json();
            $content = json_decode($data['choices'][0]['message']['content'], true);
            return $content['questions'] ?? [];
        } catch (\Exception $e) {
            Log::error("Question Generation Error: " . $e->getMessage());
            return ["Could you tell me about your technical background?"];
        }
    }

    /**
     * Transcribes audio using Whisper.
     */
    public function transcribeAudio($audioFile)
    {
        $response = Http::withToken(env('OPENAI_API_KEY'))
            ->attach('file', file_get_contents($audioFile->getRealPath()), 'audio.webm')
            ->post('https://api.openai.com/v1/audio/transcriptions', [
                'model' => 'whisper-1',
            ]);

        return $response->successful() ? $response->json('text') : 'Transcription failed.';
    }

    /**
     * Generates MP3 speech and basic lip-sync data.
     */
    public function generateSpeechData($text)
    {
        $response = Http::withToken(env('OPENAI_API_KEY'))
            ->post('https://api.openai.com/v1/audio/speech', [
                'model' => 'tts-1',
                'input' => $text,
                'voice' => 'alloy',
            ]);

        if ($response->successful()) {
            $audioContent = $response->body();
            $base64Audio = 'data:audio/mpeg;base64,' . base64_encode($audioContent);

            $visemes = [];
            $words = explode(' ', $text);
            foreach ($words as $index => $word) {
                $visemes[] = [
                    'timeMs' => $index * 320,
                    'value' => ['viseme_O', 'viseme_aa', 'viseme_E', 'viseme_I'][rand(0, 3)]
                ];
            }

            // 3. Return the Base64 string in place of the S3 URL
            return ['audio_url' => $base64Audio, 'visemes' => $visemes];
        }

        return null;
    }
}
