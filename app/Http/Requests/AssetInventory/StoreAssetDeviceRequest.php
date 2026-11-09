<?php

namespace App\Http\Requests\AssetInventory;

use Illuminate\Foundation\Http\FormRequest;

class StoreAssetDeviceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $deviceId = $this->route('asset_device')?->id;

        return [
            'asset_tag' => ['required', 'string', 'max:100', 'unique:asset_devices,asset_tag' . ($deviceId ? ',' . $deviceId : '')],
            'serial_number' => ['nullable', 'string', 'max:100', 'unique:asset_devices,serial_number' . ($deviceId ? ',' . $deviceId : '')],
            'device_type' => ['required', 'string', 'in:Laptop,MAC,Desktop,Mobile,Tablet'],
            'brand' => ['required', 'string', 'max:100'],
            'model' => ['nullable', 'string', 'max:150'],
            'status' => ['required', 'string', 'in:New,Working,Defective,For Repair'],
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
