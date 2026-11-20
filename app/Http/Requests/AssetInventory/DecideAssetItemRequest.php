<?php

namespace App\Http\Requests\AssetInventory;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DecideAssetItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('view', $this->route('itemRequest'));
    }

    public function rules(): array
    {
        return [
            'step' => ['required', Rule::in(array_keys(config('item_request.steps')))],
            'remarks' => [
                Rule::requiredIf($this->routeIs('asset-item-requests.reject')),
                'nullable', 'string', 'max:4000',
            ],
        ];
    }
}
