<?php

namespace App\Http\Requests\AssetInventory;

use Illuminate\Foundation\Http\FormRequest;

class DecideAssetPurchaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('view', $this->route('purchaseRequest'));
    }

    public function rules(): array
    {
        return [
            'step' => ['required', 'string', 'max:50'],
            'remarks' => [$this->routeIs('asset-purchase-requests.reject') ? 'required' : 'nullable', 'string', 'max:1000'],
        ];
    }
}
