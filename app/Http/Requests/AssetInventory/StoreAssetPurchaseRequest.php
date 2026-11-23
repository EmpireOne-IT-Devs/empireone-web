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
        $unitCost = ['required', 'numeric', 'decimal:0,2', 'min:0', 'max:9999999999.99'];
        $itemRules = $this->has('items') ? [
            'items' => ['required', 'array', 'list', 'min:1', 'max:25'],
            'items.*' => ['required', 'array:unit,description,quantity,unitCost'],
            'items.*.unit' => ['exclude'],
            'items.*.description' => ['required', 'string', 'min:2', 'max:150'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:1000000'],
            'items.*.unitCost' => $unitCost,
        ] : [
            'itemName' => ['required', 'string', 'min:2', 'max:150'],
            'quantity' => ['required', 'integer', 'min:1', 'max:1000000'],
            'unitPrice' => $unitCost,
        ];

        return [
            ...$itemRules,
            'department' => ['required', Rule::in(array_keys(config('purchase_request.departments')))],
            'justification' => ['required', 'string', 'max:1000'],
            'category' => ['required', Rule::in(config('purchase_request.categories'))],
            'priority' => ['required', Rule::in(config('purchase_request.priorities'))],
            'supplierName' => ['nullable', 'string', 'max:150'],
            'supplierQuotation' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
            'approverIds' => ['required', 'array', 'size:3'],
            'approverIds.*' => ['required', 'integer', 'exists:users,id'],
        ];
    }
}
