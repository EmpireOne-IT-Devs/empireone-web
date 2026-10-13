<?php

namespace App\Http\Requests\Engagement;

use App\Models\ER\ERLeader;
use Illuminate\Foundation\Http\FormRequest;

class SubmitTeamChallengeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null
            && ERLeader::query()->where('user_id', $this->user()->id)->exists();
    }

    public function rules(): array
    {
        return [
            'photo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'challenge_description' => ['required', 'string', 'max:1000'],
        ];
    }
}
