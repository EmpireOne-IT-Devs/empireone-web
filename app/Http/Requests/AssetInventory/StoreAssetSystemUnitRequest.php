<?php

namespace App\Http\Requests\AssetInventory;

use App\Models\AssetInventory\AssetSystemUnit;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAssetSystemUnitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', AssetSystemUnit::class);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:2', 'max:150'],
            'type' => ['required', Rule::in(AssetSystemUnit::TYPES)],
            'cpu' => ['required', 'string', 'max:150'],
            'ram' => ['required', 'string', 'max:150'],
            'storage' => ['required', 'string', 'max:150'],
            'os' => ['required', 'string', 'max:150'],
            'status' => ['required', Rule::in(AssetSystemUnit::STATUSES)],
            'location' => ['required', 'string', 'max:150'],
            'station' => ['nullable', 'string', 'max:100'],
        ];
    }
}
