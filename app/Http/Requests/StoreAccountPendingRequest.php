<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAccountPendingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'location_id' => ['required', 'integer', 'exists:locations,id'],
            'full_name' => ['required', 'string', 'max:255'],
            'eid' => ['required', 'string', 'max:100'],
            'employee_email' => ['required', 'email', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
        ];
    }
}
