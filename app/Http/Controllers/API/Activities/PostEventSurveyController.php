<?php

namespace App\Http\Controllers\API\Activities;

use App\Http\Controllers\Controller;
use App\Models\Activities\PostEventSurvey;
use App\Models\Activities\PostEventSurveyQuestion;
use App\Models\Activities\PostEventSurveyQuestionOption;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PostEventSurveyController extends Controller
{
    public function index(): JsonResponse
    {
        $surveys = PostEventSurvey::with([
                'activityPost:id,headline,category,published_at',
                'questions.options',
            ])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($s) => $this->formatSurvey($s));

        return response()->json([
            'data' => $surveys,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'activity_post_id'               => 'required|exists:activity_posts,id',
            'title'                          => 'required|string|max:255',
            'description'                    => 'nullable|string',
            'questions'                      => 'required|array|min:1',
            'questions.*.question_text'      => 'required|string',
            'questions.*.question_type'      => 'required|in:short_answer,paragraph,multiple_choice,checkboxes,dropdown,rating',
            'questions.*.is_required'        => 'boolean',
            'questions.*.options'            => 'nullable|array',
            'questions.*.options.*'          => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated, $request) {
            $survey = PostEventSurvey::create([
                'activity_post_id' => $validated['activity_post_id'],
                'user_id'          => Auth::id(),
                'title'            => $validated['title'],
                'description'      => $validated['description'] ?? null,
                'status'           => 'published',
                'published_at'     => now(),
            ]);

            foreach ($validated['questions'] as $index => $q) {
                $question = PostEventSurveyQuestion::create([
                    'post_event_survey_id' => $survey->id,
                    'question_text'        => $q['question_text'],
                    'question_type'        => $q['question_type'],
                    'is_required'          => $q['is_required'] ?? false,
                    'sort_order'           => $index,
                ]);

                $hasOptions = in_array($q['question_type'], ['multiple_choice', 'checkboxes', 'dropdown']);
                if ($hasOptions && !empty($q['options'])) {
                    foreach ($q['options'] as $optIndex => $optText) {
                        if (!empty($optText)) {
                            PostEventSurveyQuestionOption::create([
                                'post_event_survey_question_id' => $question->id,
                                'option_text'                   => $optText,
                                'sort_order'                    => $optIndex,
                            ]);
                        }
                    }
                }
            }

            $this->survey = $survey->load('activityPost:id,headline,category,published_at', 'questions.options');
        });

        return response()->json([
            'message' => 'Survey published successfully.',
            'data'    => $this->formatSurvey($this->survey),
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $survey = PostEventSurvey::with([
                'activityPost:id,headline,category,published_at',
                'questions.options',
            ])
            ->findOrFail($id);

        return response()->json([
            'data' => $this->formatSurvey($survey),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $survey = PostEventSurvey::findOrFail($id);
        $survey->delete();

        return response()->json(['message' => 'Survey deleted successfully.']);
    }

    private function formatSurvey(PostEventSurvey $survey): array
    {
        return [
            'id'               => $survey->id,
            'activity_post_id' => $survey->activity_post_id,
            'title'            => $survey->title,
            'description'      => $survey->description,
            'status'           => $survey->status,
            'published_at'     => $survey->published_at?->toDateString(),
            'event' => $survey->activityPost ? [
                'id'       => $survey->activityPost->id,
                'headline' => $survey->activityPost->headline,
                'category' => $survey->activityPost->category,
            ] : null,
            'questions' => $survey->questions->map(fn($q) => [
                'id'            => $q->id,
                'question_text' => $q->question_text,
                'question_type' => $q->question_type,
                'is_required'   => $q->is_required,
                'sort_order'    => $q->sort_order,
                'options'       => $q->options->map(fn($o) => [
                    'id'         => $o->id,
                    'option_text'=> $o->option_text,
                    'sort_order' => $o->sort_order,
                ])->values(),
            ])->values(),
        ];
    }
}
