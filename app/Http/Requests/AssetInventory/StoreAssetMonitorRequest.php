<?php

namespace App\Http\Requests\AssetInventory;

use Illuminate\Foundation\Http\FormRequest;

class StoreAssetMonitorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('asset_monitor')?->id;

        return [
            'asset_tag' => ['required', 'string', 'max:100', 'unique:asset_monitors,asset_tag' . ($id ? ',' . $id : '')],
            'serial_number' => ['nullable', 'string', 'max:100', 'unique:asset_monitors,serial_number' . ($id ? ',' . $id : '')],
            'brand' => ['required', 'string', 'max:100'],
            'model' => ['nullable', 'string', 'max:150'],
            'screen_size' => ['nullable', 'string', 'max:50'],
            'resolution' => ['nullable', 'string', 'max:50'],
            'monitor_type' => ['nullable', 'string', 'max:100'],
            'status' => ['required', 'string', 'in:Deployed,Available,Out of Service,For Repair'],
            'availability' => ['required', 'string', 'in:Available,Assigned,Unavailable'],
            'condition' => ['nullable', 'string', 'in:Brandnew,Second Hand'],
            'nature' => ['nullable', 'string', 'in:Dedicated,Shared'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'purchase_date' => ['nullable', 'date'],
            'account' => ['nullable', 'string', 'max:100'],
            'issued_to' => ['nullable', 'string', 'max:150'],
            'received_by' => ['nullable', 'string', 'max:150'],
            'location' => ['nullable', 'string', 'max:150'],
            'site' => ['nullable', 'string', 'max:150'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
