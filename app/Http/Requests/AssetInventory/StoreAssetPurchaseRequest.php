<?php

namespace App\Http\Requests\AssetInventory;

use App\Models\AssetInventory\AssetPurchaseRequest;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAssetPurchaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', AssetPurchaseRequest::class);
    }

    public function rules(): array
    {
        return [
            'itemName' => ['required', 'string', 'min:2', 'max:150'],
            'department' => ['required', Rule::in(array_keys(config('purchase_request.departments')))],
            'requesterName' => ['nullable', 'string', 'max:150'],
            'category' => ['required', Rule::in(config('purchase_request.categories'))],
            'priority' => ['required', Rule::in(config('purchase_request.priorities'))],
            'quantity' => ['required', 'integer', 'min:1', 'max:1000000'],
            'unitPrice' => ['required', 'numeric', 'decimal:0,2', 'min:0', 'max:9999999999.99'],
            'supplierName' => ['nullable', 'string', 'max:150'],
            'supplierQuotation' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
        ];
    }
}
