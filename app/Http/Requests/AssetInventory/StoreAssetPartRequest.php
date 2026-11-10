<?php

namespace App\Http\Requests\AssetInventory;

use Illuminate\Foundation\Http\FormRequest;

class StoreAssetPartRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('asset_part')?->id;

        return [
            'asset_tag' => ['required', 'string', 'max:100', 'unique:asset_parts,asset_tag' . ($id ? ',' . $id : '')],
            'serial_number' => ['nullable', 'string', 'max:100', 'unique:asset_parts,serial_number' . ($id ? ',' . $id : '')],
            'name' => ['required', 'string', 'max:150'],
            'brand' => ['nullable', 'string', 'max:100'],
            'part_type' => ['required', 'string', 'max:100'],
            'quantity' => ['required', 'integer', 'min:0'],
            'low_stock_threshold' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', 'string', 'in:Working,New,Defective,For Repair'],
            'condition' => ['nullable', 'string', 'in:Brandnew,Second Hand'],
            'nature' => ['nullable', 'string', 'in:Dedicated,Shared'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'purchase_date' => ['nullable', 'date'],
            'account' => ['nullable', 'string', 'max:100'],
            'location' => ['nullable', 'string', 'max:150'],
            'site' => ['nullable', 'string', 'max:150'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
