<?php

namespace App\Http\Controllers\API\Engagement;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubmitChallengeSurveyRequest;
use App\Http\Resources\ChallengeSurveyResource;
use App\Http\Resources\ChallengeSurveySubmissionResource;
use App\Models\Engagement\EngagementRewardChallenge;
use App\Services\ChallengeSurveyService;
use Illuminate\Support\Facades\Gate;

class ChallengeSurveyController extends Controller
{
    public function show(EngagementRewardChallenge $engagementRewardChallenge): ChallengeSurveyResource
    {
        $survey = $engagementRewardChallenge->survey()->with(['questions', 'challenge'])->firstOrFail();
        Gate::authorize('view', $survey);
        abort_if($survey->questions->isEmpty(), 409, 'This challenge survey has no questions. Please contact an administrator.');

        return new ChallengeSurveyResource($survey);
    }

    public function submit(SubmitChallengeSurveyRequest $request, EngagementRewardChallenge $engagementRewardChallenge, ChallengeSurveyService $service): ChallengeSurveySubmissionResource
    {
        $participant = $service->submit($engagementRewardChallenge, $request->user()->id, $request->validated('answers'));

        return (new ChallengeSurveySubmissionResource($participant->load(['challenge', 'surveyResponse'])))
            ->additional(['message' => 'Survey completed. Its reward has been recorded.']);
    }
}
