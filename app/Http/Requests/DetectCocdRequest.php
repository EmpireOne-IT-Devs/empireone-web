<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DetectCocdRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'text' => ['required', 'string', 'min:10', 'max:5000'],
            'type' => ['nullable', 'string', 'in:medical,ideation'],
        ];
    }
}
