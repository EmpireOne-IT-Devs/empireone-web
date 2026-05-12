<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JobInterview;
use App\Models\JobInterviewQnas;
use App\Services\AIService;
use Illuminate\Support\Facades\Storage;

class InterviewController extends Controller
{
    public function index()
    {
        $data = JobInterview::with(['applicant', 'answers'])->paginate();
        return response()->json($data);
    }
    public function get_job_interview_by_id($id)
    {
        $data = JobInterview::where('id', $id)->first();
        return response()->json($data);
    }
    public function start(Request $request, AIService $ai)
    {
        $request->validate(['job_title' => 'required|string']);

        $questions = $ai->generateQuestions($request->job_title);
        $payload = [];

        $ji = JobInterview::where('id', $request->job_interview_id)->first();
        if ($ji) {
            $ji->update(['status' => 'in_progress']);
        }

        foreach ($questions as $qText) {
            $qna = JobInterviewQnas::create([
                'interview_id' => $request->job_interview_id,
                'question' => $qText
            ]);

            $speech = $ai->generateSpeechData($qText);

            $payload[] = [
                'id' => $qna->id,
                'question' => $qText,
                'audio_url' => $speech['audio_url'] ?? null,
                'visemes' => $speech['visemes'] ?? []
            ];
        }

        return response()->json(['interview_id' => $request->job_interview_id, 'questions' => $payload]);
    }

    public function submitAnswer(Request $request, $id, AIService $ai)
    {
        $interview = JobInterview::findOrFail($id);
        $answers = $request->input('answers');
        $results = [];

        foreach ($answers as $index => $data) {
            $qna = JobInterviewQnas::where('interview_id', $id)->find($data['qna_id']);
            if (!$qna) continue;

            $audioFile = $request->file("answers.{$index}.audio");
            $transcription = 'No audio recorded.';
            $audioUrl = null;

            if ($audioFile) {
                $path = "candidate_answers/int_{$id}_qna_{$qna->id}.webm";
                Storage::disk('s3')->put($path, file_get_contents($audioFile->getRealPath()), 'public');
                $audioUrl = Storage::disk('s3')->url($path);
                $transcription = $ai->transcribeAudio($audioFile);
            }

            // THE ANSWER IS RECORDED HERE TO THE SAME RECORD
            $qna->update([
                'user_answer' => $transcription,
                'answer_audio_url' => $audioUrl
            ]);

            $results[] = ['question' => $qna->question, 'answer' => $transcription];
        }

        $interview->update(['status' => 'completed']);
        return response()->json(['status' => 'success', 'results' => $results]);
    }
}
