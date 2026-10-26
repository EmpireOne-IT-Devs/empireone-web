<?php

namespace App\Http\Requests\Timekeeping;

use Illuminate\Foundation\Http\FormRequest;

class TimeSheetIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_id' => 'nullable|string|exists:account_employees,employee_id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'nullable|in:Present,Late,Undertime,Absent,Day Off,On Leave,Clocked In,On Break,Holiday',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ];
    }
}
