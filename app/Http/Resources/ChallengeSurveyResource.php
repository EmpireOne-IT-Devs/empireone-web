<?php

namespace App\Http\Resources;

use App\Services\ChallengeSurveyService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChallengeSurveyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $participant = $this->challenge->participationFor($request->user()->id);
        $completed = $participant->hasCompletedSurvey($this->challenge);

        return [
            'id' => $this->id,
            'challenge_id' => $this->reward_challenge_id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'reward_points' => ChallengeSurveyService::REWARD_POINTS,
            'user_has_responded' => $completed,
            'can_submit' => ! $completed && $this->status === 'published' && $participant->canAnswerSurvey($this->challenge),
            'questions' => $this->questions->map(fn ($question) => [
                'id' => $question->id,
                'question_text' => $question->question,
                'question_type' => $question->type,
                'is_required' => (bool) $question->is_required,
                'sort_order' => $question->sort_order,
                'rating_min' => $question->type === 'rating' ? 1 : null,
                'rating_max' => $question->type === 'rating' ? 5 : null,
            ])->values(),
        ];
    }
}
