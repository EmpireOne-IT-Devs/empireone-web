<?php

namespace App\Http\Requests\Engagement;

use App\Http\Requests\Engagement\Concerns\ValidatesChallengeProofMedia;
use App\Models\ER\ERLeader;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class SubmitTeamChallengeRequest extends FormRequest
{
    use ValidatesChallengeProofMedia;

    public function authorize(): bool
    {
        return $this->user() !== null
            && ERLeader::query()->where('user_id', $this->user()->id)->exists();
    }

    public function rules(): array
    {
        return $this->proofMediaRules();
    }

    public function messages(): array
    {
        return $this->proofMediaMessages();
    }

    public function withValidator(Validator $validator): void
    {
        $this->validateProofMedia($validator);
    }
}
