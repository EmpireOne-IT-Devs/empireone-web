<?php

namespace App\Http\Controllers\API\ER;

use App\Http\Controllers\Controller;
use App\Models\ER\ERPerformanceEvaluationForm;
use App\Models\ER\ERPerformanceEvaluationSection1;
use App\Models\ER\ERPerformanceEvaluationSection2;
use Illuminate\Http\Request;

class ERPerformanceEvaluationFormController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $evaluations = ERPerformanceEvaluationForm::where('recommendation', $request->status)->with(['supervisor'])->get();
        return response()->json([
            'data' => $evaluations,
            'status'  => 'success',
        ], 200);
    }


    public function performance_evaluation_by_user_id($user_id)
    {
        $evaluations = ERPerformanceEvaluationForm::where('user_id', $user_id)->get();
        return response()->json([
            'data' => $evaluations,
            'status'  => 'success',
        ], 200);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $totalAverage = $request->calculated_scores['total_average'] ?? null;

            $status = null;
            if ($totalAverage !== null) {
                $status = $totalAverage >= 3 ? 'Passed' : 'Failed';
            }
            $evaluation = ERPerformanceEvaluationForm::updateOrCreate(
                ['id' => $request->evaluation_id],
                [
                    'user_id' => $request->user_id,
                    'supervisor_id' => $request->supervisor_id,
                    'has_supervisor_signature' => true,
                    'date_of_assessment' => $request->date_of_assessment,
                    'remarks' => $request->remarks,
                    'section1_average' => $request->calculated_scores['section_1'] ?? null,
                    'section2_average' => $request->calculated_scores['section_2'] ?? null,
                    'total_average' => $totalAverage,
                    'recommendation' => $request->recommendation,
                    'status' => $status,
                ]
            );

            // 2. HANDLE SECTION 1 (Objectives) Line-by-Line
            $section1_ids_kept = [];

            if ($request->has('objectives')) {
                foreach ($request->objectives as $value) {
                    $objective = ERPerformanceEvaluationSection1::updateOrCreate(
                        [
                            'id' => $value['id'] ?? null,
                            'e_r_performance_evaluation_form_id' => $evaluation->id
                        ],
                        [
                            'objective' => $value['title'] ?? null,
                            'action' => $value['action_items'] ?? null,
                            'outcome' => $value['outcomes'] ?? null,
                            'rating' => $value['mgr_rating'] ?? null,
                        ]
                    );

                    $section1_ids_kept[] = $objective->id;
                }
            }

            // Delete any objectives in the DB that belong to this form but were NOT in the request
            ERPerformanceEvaluationSection1::where('e_r_performance_evaluation_form_id', $evaluation->id)
                ->whereNotIn('id', $section1_ids_kept)
                ->delete();

            // 3. HANDLE SECTION 2 (Performances) Line-by-Line
            $section2_ids_kept = [];

            if ($request->has('performances')) {
                foreach ($request->performances as $value) {
                    $performance = ERPerformanceEvaluationSection2::updateOrCreate(
                        [
                            'id' => $value['id'] ?? null,
                            'e_r_performance_evaluation_form_id' => $evaluation->id
                        ],
                        [
                            'requirements' => $value['title'] ?? null,
                            'description' => $value['action_items'] ?? null,
                            'rating' => $value['mgr_rating'] ?? null,
                        ]
                    );

                    $section2_ids_kept[] = $performance->id;
                }
            }

            // Delete any performances in the DB that belong to this form but were NOT in the request
            ERPerformanceEvaluationSection2::where('e_r_performance_evaluation_form_id', $evaluation->id)
                ->whereNotIn('id', $section2_ids_kept)
                ->delete();

            return response()->json([
                'data' => $evaluation->load(['section1s', 'section2s']),
                'status'  => 'success',
                'message' => 'Performance evaluation saved successfully.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to save evaluation: ' . $e->getMessage(),
            ], 500);
        }
    }
    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $evaluation = ERPerformanceEvaluationForm::where('id', $id)->with(['user', 'supervisor', 'section1s', 'section2s'])->first();
        return response()->json([
            'data' => $evaluation,
            'status'  => 'success',
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ERPerformanceEvaluationForm $eRPerformanceEvaluationForm)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ERPerformanceEvaluationForm $eRPerformanceEvaluationForm)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ERPerformanceEvaluationForm $eRPerformanceEvaluationForm)
    {
        //
    }
}
