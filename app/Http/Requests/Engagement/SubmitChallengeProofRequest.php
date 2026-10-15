<?php

namespace App\Http\Requests\Engagement;

use App\Http\Requests\Engagement\Concerns\ValidatesChallengeProofMedia;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class SubmitChallengeProofRequest extends FormRequest
{
    use ValidatesChallengeProofMedia;

    public function authorize(): bool
    {
        return $this->user() !== null;
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
