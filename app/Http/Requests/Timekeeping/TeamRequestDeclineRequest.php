<?php

namespace App\Http\Requests\Timekeeping;

use Illuminate\Foundation\Http\FormRequest;

class TeamRequestDeclineRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'note' => 'required|string|max:1000',
        ];
    }
}
