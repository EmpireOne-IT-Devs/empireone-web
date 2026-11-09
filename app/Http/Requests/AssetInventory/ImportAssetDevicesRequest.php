<?php

namespace App\Http\Requests\AssetInventory;

use Illuminate\Foundation\Http\FormRequest;

class ImportAssetDevicesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'rows' => ['required', 'array', 'min:1', 'max:500'],
            'rows.*.asset_tag' => ['required', 'string', 'max:100'],
            'rows.*.serial_number' => ['nullable', 'string', 'max:100'],
            'rows.*.device_type' => ['required', 'string', 'in:Laptop,MAC,Desktop,Mobile,Tablet'],
            'rows.*.brand' => ['required', 'string', 'max:100'],
            'rows.*.model' => ['nullable', 'string', 'max:150'],
            'rows.*.status' => ['required', 'string', 'in:New,Working,Defective,For Repair'],
            'rows.*.availability' => ['required', 'string', 'in:Available,Assigned,Unavailable'],
            'rows.*.condition' => ['nullable', 'string', 'in:Brandnew,Second Hand'],
            'rows.*.nature' => ['nullable', 'string', 'in:Dedicated,Shared'],
            'rows.*.price' => ['nullable', 'numeric', 'min:0'],
            'rows.*.purchase_date' => ['nullable', 'date'],
            'rows.*.account' => ['nullable', 'string', 'max:100'],
            'rows.*.issued_to' => ['nullable', 'string', 'max:150'],
            'rows.*.received_by' => ['nullable', 'string', 'max:150'],
            'rows.*.location' => ['nullable', 'string', 'max:150'],
            'rows.*.site' => ['nullable', 'string', 'max:150'],
            'rows.*.notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
