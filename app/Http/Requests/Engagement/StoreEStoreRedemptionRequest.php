<?php

namespace App\Http\Requests\Engagement;

use Illuminate\Foundation\Http\FormRequest;

class StoreEStoreRedemptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'engagement_e_store_id' => ['required', 'integer', 'exists:engagement_e_stores,id'],
            'quantity' => ['required', 'integer', 'min:1', 'max:99'],
            'idempotency_key' => ['required', 'string', 'max:64'],
        ];
    }
}
