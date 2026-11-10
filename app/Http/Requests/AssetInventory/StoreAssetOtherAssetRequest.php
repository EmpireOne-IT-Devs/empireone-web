<?php

namespace App\Http\Requests\AssetInventory;

use Illuminate\Foundation\Http\FormRequest;

class StoreAssetOtherAssetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('asset_other_asset')?->id;

        return [
            'asset_tag' => ['required', 'string', 'max:100', 'unique:asset_other_assets,asset_tag' . ($id ? ',' . $id : '')],
            'serial_number' => ['nullable', 'string', 'max:100', 'unique:asset_other_assets,serial_number' . ($id ? ',' . $id : '')],
            'name' => ['required', 'string', 'max:150'],
            'category' => ['required', 'string', 'max:100'],
            'details' => ['nullable', 'string', 'max:2000'],
            'status' => ['required', 'string', 'in:Available,Assigned,In Maintenance,Retired'],
            'condition' => ['nullable', 'string', 'in:Brandnew,Second Hand'],
            'nature' => ['nullable', 'string', 'in:Dedicated,Shared'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'purchase_date' => ['nullable', 'date'],
            'account' => ['nullable', 'string', 'max:100'],
            'assigned_to' => ['nullable', 'string', 'max:150'],
            'location' => ['nullable', 'string', 'max:150'],
            'site' => ['nullable', 'string', 'max:150'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
