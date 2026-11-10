<?php

namespace App\Http\Requests\AssetInventory;

use Illuminate\Foundation\Http\FormRequest;

class StoreAssetPeripheralRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('asset_peripheral')?->id;

        return [
            'asset_tag' => ['required', 'string', 'max:100', 'unique:asset_peripherals,asset_tag' . ($id ? ',' . $id : '')],
            'serial_number' => ['nullable', 'string', 'max:100', 'unique:asset_peripherals,serial_number' . ($id ? ',' . $id : '')],
            'peripheral_type' => ['required', 'string', 'max:100'],
            'brand' => ['nullable', 'string', 'max:100'],
            'model' => ['nullable', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:2000'],
            'quantity' => ['required', 'integer', 'min:0'],
            'low_stock_threshold' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', 'string', 'in:Active,Inactive,Retired'],
            'condition' => ['nullable', 'string', 'in:Brandnew,Second Hand'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'purchase_date' => ['nullable', 'date'],
            'account' => ['nullable', 'string', 'max:100'],
            'location' => ['nullable', 'string', 'max:150'],
            'site' => ['nullable', 'string', 'max:150'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
