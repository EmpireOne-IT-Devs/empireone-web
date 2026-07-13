<?php

namespace App\Http\Controllers\API\Engagement;

use App\Http\Controllers\Controller;
use App\Models\Engagement\EngagementPostEventAnswer;
use App\Models\Engagement\EngagementPostEventQuestion;
use App\Models\Engagement\EngagementPostEventQuestionOption;
use App\Models\Engagement\EngagementPostEventSurvey;
use App\Models\Engagement\EngagementPostEventSurveyResponse;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class EngagementPostEventSurveyController extends Controller
{
    // ── Admin: list all surveys ──────────────────────────────────────────────
    public function index(): JsonResponse
    {
        $surveys = EngagementPostEventSurvey::with([
                'post:id,title,headline,category,published_at',
                'questions.options',
            ])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($s) => $this->formatSurvey($s));

        return response()->json([
            'data' => $surveys,
        ]);
    }

    // ── Admin: create survey ─────────────────────────────────────────────────
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'engagement_post_event_id'  => 'required|exists:engagement_post_events,id',
            'title'                     => 'required|string|max:255',
            'description'               => 'nullable|string',
            'questions'                 => 'required|array|min:1',
            'questions.*.question_text' => 'required|string',
            'questions.*.question_type' => 'required|in:short_answer,paragraph,multiple_choice,checkboxes,dropdown,rating',
            'questions.*.is_required'   => 'boolean',
            'questions.*.options'       => 'nullable|array',
            'questions.*.options.*'     => 'nullable|string',
        ]);

        $survey = DB::transaction(function () use ($validated) {
            $survey = EngagementPostEventSurvey::create([
                'engagement_post_event_id' => $validated['engagement_post_event_id'],
                'user_id'                  => Auth::id(),
                'title'                    => $validated['title'],
                'description'              => $validated['description'] ?? null,
                'status'                   => 'published',
                'published_at'             => now(),
            ]);

            foreach ($validated['questions'] as $index => $q) {
                $question = EngagementPostEventQuestion::create([
                    'engagement_post_event_id'        => $validated['engagement_post_event_id'],
                    'engagement_post_event_survey_id' => $survey->id,
                    'user_id'                         => Auth::id(),
                    'question'                        => $q['question_text'],
                    'type'                            => $q['question_type'],
                    'is_required'                     => $q['is_required'] ?? false,
                    'sort_order'                      => $index,
                ]);

                $hasOptions = in_array($q['question_type'], ['multiple_choice', 'checkboxes', 'dropdown']);
                if ($hasOptions && !empty($q['options'])) {
                    foreach ($q['options'] as $optIndex => $optText) {
                        if (!empty($optText)) {
                            EngagementPostEventQuestionOption::create([
                                'engagement_post_event_question_id' => $question->id,
                                'option_text'                       => $optText,
                                'sort_order'                        => $optIndex,
                            ]);
                        }
                    }
                }
            }

            return $survey->load('post:id,title,headline,category,published_at', 'questions.options');
        });

        return response()->json([
            'message' => 'Survey published successfully.',
            'data'    => $this->formatSurvey($survey),
        ], 201);
    }

    // ── Shared: get single survey ────────────────────────────────────────────
    public function show(int $id): JsonResponse
    {
        $survey = EngagementPostEventSurvey::with([
                'post:id,title,headline,category,published_at',
                'questions.options',
            ])
            ->findOrFail($id);

        $userHasResponded = EngagementPostEventSurveyResponse::where('engagement_post_event_survey_id', $id)
            ->where('user_id', Auth::id())
            ->exists();

        $data                       = $this->formatSurvey($survey);
        $data['user_has_responded'] = $userHasResponded;

        return response()->json([
            'data' => $data,
        ]);
    }

    // ── Employee: submit survey response ─────────────────────────────────────
    public function submit(Request $request, int $id): JsonResponse
    {
        $survey = EngagementPostEventSurvey::with('questions')->findOrFail($id);

        if ($survey->status === 'closed') {
            return response()->json([
                'status'  => 'error',
                'message' => 'This survey is already closed.',
            ], 422);
        }

        $alreadySubmitted = EngagementPostEventSurveyResponse::where('engagement_post_event_survey_id', $id)
            ->where('user_id', Auth::id())
            ->exists();

        if ($alreadySubmitted) {
            return response()->json([
                'status'  => 'error',
                'message' => 'You have already submitted a response for this survey.',
            ], 422);
        }

        $rules = ['answers' => 'required|array'];
        foreach ($survey->questions as $question) {
            $rules["answers.{$question->id}"] = $question->is_required ? 'required' : 'nullable';
        }

        $validated = $request->validate($rules);

        DB::transaction(function () use ($validated, $id) {
            $response = EngagementPostEventSurveyResponse::create([
                'engagement_post_event_survey_id' => $id,
                'user_id'                         => Auth::id(),
                'submitted_at'                    => now(),
            ]);

            foreach ($validated['answers'] as $questionId => $answer) {
                if ($answer === null || $answer === '' || $answer === []) {
                    continue;
                }

                EngagementPostEventAnswer::create([
                    'engagement_post_event_survey_response_id' => $response->id,
                    'engagement_post_event_question_id'        => $questionId,
                    'user_id'                                  => Auth::id(),
                    'answer' => is_array($answer) ? json_encode($answer) : (string) $answer,
                ]);
            }
        });

        return response()->json([
            'status'  => 'success',
            'message' => 'Survey submitted successfully.',
        ]);
    }

    // ── Admin: response tracker ──────────────────────────────────────────────
    public function responses(int $id): JsonResponse
    {
        EngagementPostEventSurvey::findOrFail($id);

        $employees = User::where('role', User::ROLE_EMPLOYEE)
            ->select('id', 'name', 'email')
            ->get();

        $responseMap = EngagementPostEventSurveyResponse::where('engagement_post_event_survey_id', $id)
            ->get()
            ->keyBy('user_id');

        $tracker = $employees->map(function ($employee) use ($responseMap) {
            $response = $responseMap->get($employee->id);

            return [
                'user_id'       => $employee->id,
                'employee_name' => $employee->name,
                'email'         => $employee->email,
                'status'        => $response ? 'Completed' : 'Pending',
                'submitted_at'  => $response ? optional($response->submitted_at)->toDateTimeString() : null,
            ];
        });

        $totalEmployees = $employees->count();
        $totalResponses = $responseMap->count();

        return response()->json([
            'data' => [
                'total_employees'    => $totalEmployees,
                'total_responses'    => $totalResponses,
                'participation_rate' => $totalEmployees > 0 ? round(($totalResponses / $totalEmployees) * 100, 2) : 0,
                'response_tracker'   => $tracker,
            ],
            'status' => 'success',
        ]);
    }

    // ── Admin: per-question analytics ────────────────────────────────────────
    public function analytics(int $id): JsonResponse
    {
        $survey = EngagementPostEventSurvey::with([
                'post:id,title,headline,category,published_at',
                'questions.options',
            ])
            ->findOrFail($id);

        $totalEmployees = User::where('role', User::ROLE_EMPLOYEE)->count();
        $totalResponses = EngagementPostEventSurveyResponse::where('engagement_post_event_survey_id', $id)->count();

        $questions = $survey->questions->map(function ($question) {
            $answers       = EngagementPostEventAnswer::where('engagement_post_event_question_id', $question->id)->get();
            $answeredCount = $answers->count();
            $breakdown     = [];

            if (in_array($question->type, ['multiple_choice', 'dropdown'])) {
                $optionCounts = [];
                foreach ($answers as $answer) {
                    $opt                = $answer->answer;
                    $optionCounts[$opt] = ($optionCounts[$opt] ?? 0) + 1;
                }
                foreach ($question->options as $option) {
                    $count       = $optionCounts[$option->option_text] ?? 0;
                    $breakdown[] = [
                        'label'      => $option->option_text,
                        'count'      => $count,
                        'percentage' => $answeredCount > 0 ? round(($count / $answeredCount) * 100, 2) : 0,
                    ];
                }

            } elseif ($question->type === 'checkboxes') {
                $optionCounts = [];
                foreach ($answers as $answer) {
                    $selected = json_decode($answer->answer, true) ?? [];
                    foreach ($selected as $opt) {
                        $optionCounts[$opt] = ($optionCounts[$opt] ?? 0) + 1;
                    }
                }
                foreach ($question->options as $option) {
                    $count       = $optionCounts[$option->option_text] ?? 0;
                    $breakdown[] = [
                        'label'      => $option->option_text,
                        'count'      => $count,
                        'percentage' => $answeredCount > 0 ? round(($count / $answeredCount) * 100, 2) : 0,
                    ];
                }

            } elseif ($question->type === 'rating') {
                $totalRating  = 0;
                $ratingCounts = array_fill(1, 5, 0);
                foreach ($answers as $answer) {
                    $rating = (int) $answer->answer;
                    if ($rating >= 1 && $rating <= 5) {
                        $totalRating += $rating;
                        $ratingCounts[$rating]++;
                    }
                }
                foreach (range(1, 5) as $n) {
                    $count       = $ratingCounts[$n];
                    $breakdown[] = [
                        'label'      => (string) $n,
                        'count'      => $count,
                        'percentage' => $answeredCount > 0 ? round(($count / $answeredCount) * 100, 2) : 0,
                    ];
                }
                $breakdown['average_rating'] = $answeredCount > 0 ? round($totalRating / $answeredCount, 2) : 0;

            } else {
                $breakdown = $answers->map(fn ($a) => $a->answer)->filter()->values()->toArray();
            }

            return [
                'id'               => $question->id,
                'question_text'    => $question->question,
                'question_type'    => $question->type,
                'is_required'      => $question->is_required,
                'total_responses'  => $answeredCount,
                'answer_breakdown' => $breakdown,
            ];
        });

        return response()->json([
            'data' => [
                'survey_information' => $this->formatSurvey($survey),
                'total_employees'    => $totalEmployees,
                'total_responses'    => $totalResponses,
                'participation_rate' => $totalEmployees > 0 ? round(($totalResponses / $totalEmployees) * 100, 2) : 0,
                'questions'          => $questions,
            ],
            'status' => 'success',
        ]);
    }

    // ── Admin: close survey ──────────────────────────────────────────────────
    public function close(int $id): JsonResponse
    {
        $survey = EngagementPostEventSurvey::findOrFail($id);
        $survey->update(['status' => 'closed', 'closed_at' => now()]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Survey closed successfully.',
        ]);
    }

    // ── Admin: reopen survey ─────────────────────────────────────────────────
    public function reopen(int $id): JsonResponse
    {
        $survey = EngagementPostEventSurvey::findOrFail($id);
        $survey->update(['status' => 'published', 'closed_at' => null]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Survey reopened successfully.',
        ]);
    }

    // ── Admin: delete survey ─────────────────────────────────────────────────
    public function destroy(int $id): JsonResponse
    {
        $survey = EngagementPostEventSurvey::findOrFail($id);
        $survey->delete();

        return response()->json(['message' => 'Survey deleted successfully.']);
    }

    // ── Shared: format survey for API response ───────────────────────────────
    private function formatSurvey(EngagementPostEventSurvey $survey): array
    {
        return [
            'id'                       => $survey->id,
            'engagement_post_event_id' => $survey->engagement_post_event_id,
            'title'                    => $survey->title,
            'description'              => $survey->description,
            'status'                   => $survey->status,
            'published_at'             => $survey->published_at?->toDateString(),
            'event'                    => $survey->post ? [
                'id'       => $survey->post->id,
                'headline' => $survey->post->headline ?? $survey->post->title,
                'category' => $survey->post->category,
            ] : null,
            'questions'                => $survey->questions->map(fn ($q) => [
                'id'            => $q->id,
                'question_text' => $q->question,
                'question_type' => $q->type,
                'is_required'   => $q->is_required,
                'sort_order'    => $q->sort_order,
                'options'       => $q->options->map(fn ($o) => [
                    'id'          => $o->id,
                    'option_text' => $o->option_text,
                    'sort_order'  => $o->sort_order,
                ])->values(),
            ])->values(),
        ];
    }
}
