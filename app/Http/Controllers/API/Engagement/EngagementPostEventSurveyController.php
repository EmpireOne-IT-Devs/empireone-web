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

            $survey = EngagementPostEventSurvey::find($id);
            if ($survey) {
                $survey->refreshSentimentOverview();
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
        $survey = EngagementPostEventSurvey::with(['questions'])->findOrFail($id);

        $employees = User::where('role', User::ROLE_EMPLOYEE)
            ->with(['account_employee.account', 'account_employee.department', 'account_employee.location'])
            ->select('id', 'name', 'email')
            ->get();

        $responseModels = EngagementPostEventSurveyResponse::with(['answers.question'])
            ->where('engagement_post_event_survey_id', $id)
            ->get();

        $responseMap = $responseModels->keyBy('user_id');

        // Each survey question becomes its own response-table column.
        $questions = $survey->questions->map(fn ($question) => [
            'id'            => $question->id,
            'question_text' => $question->question,
            'question_type' => $question->type,
        ])->values();

        $tracker = $employees->map(function ($employee) use ($responseMap) {
            $response = $responseMap->get($employee->id);

            $answersByQuestion = [];
            if ($response) {
                foreach ($response->answers as $answer) {
                    $answersByQuestion[$answer->engagement_post_event_question_id] = $answer->answer;
                }
            }

            return [
                'user_id'       => $employee->id,
                'employee_id'   => $employee->account_employee?->employee_id ?? 'N/A',
                'employee_name' => $employee->name,
                'site'          => $employee->account_employee?->location?->name ?? 'N/A',
                'program_department' => $employee->account_employee?->account?->name
                    ?? $employee->account_employee?->department?->name
                    ?? 'N/A',
                'email'         => $employee->email,
                'status'        => $response ? 'Completed' : 'Pending',
                'submitted_at'  => $response ? optional($response->submitted_at)->toDateTimeString() : null,
                'answers'       => $answersByQuestion,
            ];
        });

        $totalEmployees = $employees->count();
        $totalResponses = $responseMap->count();

        if ($survey->sentiment_overview === null) {
            $survey->refreshSentimentOverview();
        }

        $sentimentOverview = $survey->sentiment_overview ?? [];

        return response()->json([
            'data' => [
                'total_employees'    => $totalEmployees,
                'total_responses'    => $totalResponses,
                'participation_rate' => $totalEmployees > 0 ? round(($totalResponses / $totalEmployees) * 100, 2) : 0,
                'questions'          => $questions,
                'response_tracker'   => $tracker,
                'sentiment_overview' => $sentimentOverview,
            ],
            'status' => 'success',
        ]);
    }

    // ── Admin: export only submitted responses as a CSV (importable into Google Sheets) ──
    public function exportResponses(int $id)
    {
        $survey = EngagementPostEventSurvey::with(['questions'])->findOrFail($id);

        // Only responses actually submitted are included; employees who never answered are skipped.
        $responses = EngagementPostEventSurveyResponse::with([
                'user.account_employee.account',
                'user.account_employee.department',
                'user.account_employee.location',
                'answers',
            ])
            ->where('engagement_post_event_survey_id', $id)
            ->orderBy('submitted_at')
            ->get();

        $questions = $survey->questions;
        $filename  = 'survey_' . $survey->id . '_responses_' . now()->format('Ymd_His') . '.csv';

        return response()->streamDownload(function () use ($responses, $questions) {
            $handle = fopen('php://output', 'w');

            $header = ['Employee ID', 'Employee Name', 'Site', 'Program / Department', 'Email'];
            foreach ($questions as $question) {
                $header[] = $question->question;
            }
            $header[] = 'Submitted At';
            fputcsv($handle, $header);

            foreach ($responses as $response) {
                $employee        = $response->user;
                $accountEmployee = $employee?->account_employee;
                $answersByQuestion = $response->answers->keyBy('engagement_post_event_question_id');

                $row = [
                    $accountEmployee?->employee_id ?? 'N/A',
                    $employee?->name ?? 'N/A',
                    $accountEmployee?->location?->name ?? 'N/A',
                    $accountEmployee?->account?->name ?? $accountEmployee?->department?->name ?? 'N/A',
                    $employee?->email ?? 'N/A',
                ];

                foreach ($questions as $question) {
                    $answer = $answersByQuestion->get($question->id);
                    $row[]  = $this->formatAnswerForExport($question, $answer?->answer);
                }

                $row[] = optional($response->submitted_at)->toDateTimeString() ?? '';

                fputcsv($handle, $row);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }

    private function formatAnswerForExport($question, ?string $rawAnswer): string
    {
        if ($rawAnswer === null || $rawAnswer === '') {
            return '';
        }

        if ($question->type === 'checkboxes') {
            $decoded = json_decode($rawAnswer, true);
            return is_array($decoded) ? implode(', ', $decoded) : $rawAnswer;
        }

        return (string) $rawAnswer;
    }

    public function employeeResponse(int $surveyId, int $userId): JsonResponse
    {
        $survey = EngagementPostEventSurvey::with(['questions.options'])->findOrFail($surveyId);
        $response = EngagementPostEventSurveyResponse::with(['answers.question'])->where('engagement_post_event_survey_id', $surveyId)
            ->where('user_id', $userId)
            ->firstOrFail();

        $answers = $response->answers->map(function ($answer) use ($survey) {
            $question = $survey->questions->firstWhere('id', $answer->engagement_post_event_question_id);

            return [
                'id' => $answer->id,
                'question_id' => $answer->engagement_post_event_question_id,
                'question_text' => $question?->question ?? 'Question removed',
                'question_type' => $question?->type ?? 'short_answer',
                'answer' => $answer->answer,
            ];
        })->values();

        return response()->json([
            'data' => [
                'survey_id' => $survey->id,
                'employee_id' => $userId,
                'employee_name' => User::find($userId)?->name ?? 'Employee',
                'submitted_at' => $response->submitted_at?->toDateTimeString(),
                'answers' => $answers,
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
    private function normalizeRating(mixed $answer): ?int
    {
        if (is_numeric($answer)) {
            $value = (int) $answer;
            return $value >= 1 && $value <= 5 ? $value : null;
        }

        if (is_string($answer)) {
            if (preg_match('/(\d+)/', $answer, $matches)) {
                $value = (int) $matches[1];
                return $value >= 1 && $value <= 5 ? $value : null;
            }
        }

        return null;
    }

    private function buildSentimentOverview(int $surveyId): array
    {
        $responses = EngagementPostEventSurveyResponse::with(['answers.question'])
            ->where('engagement_post_event_survey_id', $surveyId)
            ->get();

        if ($responses->isEmpty()) {
            return [
                'average_rating' => 0.0,
                'positive' => ['count' => 0, 'percentage' => 0],
                'neutral' => ['count' => 0, 'percentage' => 0],
                'negative' => ['count' => 0, 'percentage' => 0],
            ];
        }

        $sentimentCounts = [
            'positive' => 0,
            'neutral'  => 0,
            'negative' => 0,
        ];
        $ratingSum = 0;
        $ratingResponses = 0;

        foreach ($responses as $response) {
            $ratings = [];

            foreach ($response->answers as $answer) {
                if ($answer->question?->type !== 'rating') {
                    continue;
                }

                $rating = $this->normalizeRating($answer->answer);
                if ($rating === null) {
                    continue;
                }

                $ratings[] = $rating;
            }

            if ($ratings === []) {
                $sentimentCounts['neutral']++;
                continue;
            }

            $responseAverage = round(array_sum($ratings) / count($ratings), 1);
            $ratingSum += $responseAverage;
            $ratingResponses++;

            if ($responseAverage >= 4) {
                $sentimentCounts['positive']++;
            } elseif ($responseAverage <= 2) {
                $sentimentCounts['negative']++;
            } else {
                $sentimentCounts['neutral']++;
            }
        }

        return [
            'average_rating' => $ratingResponses > 0 ? round($ratingSum / $ratingResponses, 1) : 0.0,
            'positive' => [
                'count' => $sentimentCounts['positive'],
                'percentage' => $responses->count() > 0 ? round(($sentimentCounts['positive'] / $responses->count()) * 100, 1) : 0,
            ],
            'neutral' => [
                'count' => $sentimentCounts['neutral'],
                'percentage' => $responses->count() > 0 ? round(($sentimentCounts['neutral'] / $responses->count()) * 100, 1) : 0,
            ],
            'negative' => [
                'count' => $sentimentCounts['negative'],
                'percentage' => $responses->count() > 0 ? round(($sentimentCounts['negative'] / $responses->count()) * 100, 1) : 0,
            ],
        ];
    }

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
