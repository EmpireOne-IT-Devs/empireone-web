<?php

namespace App\Http\Requests;

use App\Models\COERequest;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreCOERequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('create', COERequest::class);
    }

    public function rules(): array
    {
        return [
            'purpose' => ['required', 'string', 'max:255'],
        ];
    }
}
