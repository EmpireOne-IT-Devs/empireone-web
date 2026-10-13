<?php

namespace App\Http\Requests\Engagement;

use Illuminate\Foundation\Http\FormRequest;

class SubmitTeamChallengeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'photo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'challenge_description' => ['required', 'string', 'max:1000'],
        ];
    }
}
