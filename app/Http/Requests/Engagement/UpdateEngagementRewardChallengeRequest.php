<?php

namespace App\Http\Requests\Engagement;

use App\Http\Requests\Engagement\Concerns\ValidatesChallengeDuration;
use App\Models\Engagement\EngagementRewardChallenge;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class UpdateEngagementRewardChallengeRequest extends FormRequest
{
    use ValidatesChallengeDuration;

    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $challenge = $this->route('engagementRewardChallenge');
        $startDate = $this->input(
            'start_date',
            $challenge instanceof EngagementRewardChallenge ? Carbon::parse($challenge->start_date)->toDateString() : null,
        );
        $deadline = $this->input(
            'deadline',
            $challenge instanceof EngagementRewardChallenge ? Carbon::parse($challenge->deadline)->toDateString() : null,
        );

        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string', 'max:5000'],
            'type' => ['sometimes', 'string', 'in:Individual,Team'],
            'category' => ['sometimes', 'required', 'string', 'max:50'],
            'points' => ['sometimes', 'integer', 'min:1'],
            'duration_days' => [
                'nullable',
                'integer',
                'min:1',
                'max:366',
                $this->durationDaysRule($startDate, $deadline),
            ],
            'proof_type' => ['sometimes', 'required', 'in:photo_only,photo_or_video'],
            'banner' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'banner_position_x' => ['nullable', 'integer', 'min:0', 'max:100'],
            'banner_position_y' => ['nullable', 'integer', 'min:0', 'max:100'],
            'all_employees' => ['sometimes', 'boolean'],
            'account_ids' => ['nullable', 'array'],
            'account_ids.*' => ['integer', 'distinct', 'exists:accounts,id'],
            'department_ids' => ['nullable', 'array'],
            'department_ids.*' => ['integer', 'distinct', 'exists:departments,id'],
            'max_participants' => ['nullable', 'integer', 'min:1'],
            'start_date' => ['sometimes', 'date'],
            'deadline' => ['sometimes', 'date', 'after_or_equal:start_date'],
            'card_color' => ['sometimes', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ];
    }
}
