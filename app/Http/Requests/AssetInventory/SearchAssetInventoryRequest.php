<?php

namespace App\Http\Requests\AssetInventory;

use App\Services\AssetInventorySearch;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SearchAssetInventoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        foreach (array_keys(AssetInventorySearch::SOURCES) as $model) {
            if ($this->user()->cannot('viewAny', $model)) {
                return false;
            }
        }

        return true;
    }

    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:150'],
            'category' => ['nullable', Rule::in(array_column(AssetInventorySearch::SOURCES, 0))],
            'status' => ['nullable', 'string', 'max:50'],
            'device_type' => ['nullable', 'string', 'max:50'],
            'availability' => ['nullable', Rule::in(['Available', 'Assigned', 'Unavailable'])],
            'page' => ['nullable', 'integer', 'min:1', 'max:1000000'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
