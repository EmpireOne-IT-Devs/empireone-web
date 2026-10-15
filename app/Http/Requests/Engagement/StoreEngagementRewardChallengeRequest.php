<?php

namespace App\Http\Requests\Engagement;

use App\Http\Requests\Engagement\Concerns\ValidatesChallengeDuration;
use Illuminate\Foundation\Http\FormRequest;

class StoreEngagementRewardChallengeRequest extends FormRequest
{
    use ValidatesChallengeDuration;

    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $startDate = $this->input('start_date');
        $deadline = $this->input('deadline');

        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'type' => ['required', 'string', 'in:Individual,Team'],
            'category' => ['required', 'string', 'max:50'],
            'points' => ['required', 'integer', 'min:1'],
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
            'all_employees' => ['required', 'boolean'],
            'account_ids' => ['nullable', 'array'],
            'account_ids.*' => ['integer', 'distinct', 'exists:accounts,id'],
            'department_ids' => ['nullable', 'array'],
            'department_ids.*' => ['integer', 'distinct', 'exists:departments,id'],
            'max_participants' => ['nullable', 'integer', 'min:1'],
            'start_date' => ['required', 'date'],
            'deadline' => ['required', 'date', 'after_or_equal:start_date'],
            'card_color' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ];
    }
}
