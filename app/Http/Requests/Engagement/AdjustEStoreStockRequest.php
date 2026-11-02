<?php

namespace App\Http\Requests\Engagement;

use Illuminate\Foundation\Http\FormRequest;

class AdjustEStoreStockRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'action' => ['required', 'string', 'in:set,add,subtract'],
            'quantity' => ['required', 'integer', 'min:0', 'max:1000000'],
            'is_unlimited_stock' => ['sometimes', 'boolean'],
        ];
    }
}
