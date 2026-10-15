<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class SubmitChallengeSurveyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $survey = $this->route('engagementRewardChallenge')->survey()->firstOrFail();

        return Gate::allows('submit', $survey);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $survey = $this->route('engagementRewardChallenge')->survey()->with('questions')->firstOrFail();
        abort_if($survey->questions->isEmpty(), 409, 'This challenge survey has no questions. Please contact an administrator.');

        $rules = [
            'answers' => ['required', 'array:'.$survey->questions->pluck('id')->implode(',')],
        ];

        foreach ($survey->questions as $question) {
            $rules["answers.{$question->id}"] = [
                $question->is_required ? 'required' : 'nullable',
                ...match ($question->type) {
                    'rating' => ['integer', 'between:1,5'],
                    'paragraph' => ['string', 'max:5000'],
                    default => abort(409, 'This challenge survey contains an unsupported question type.'),
                },
            ];
        }

        return $rules;
    }
}
