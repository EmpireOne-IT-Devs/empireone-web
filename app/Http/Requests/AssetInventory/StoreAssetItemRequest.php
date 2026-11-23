<?php

namespace App\Http\Requests\AssetInventory;

use App\Models\AssetInventory\AssetItemRequest;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAssetItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', AssetItemRequest::class);
    }

    public function rules(): array
    {
        return [
            'assetType' => ['required', Rule::in(array_keys(AssetItemRequest::ASSETS))],
            'assetUuid' => ['required', 'uuid'],
            'assigneeId' => ['required', 'integer', 'min:1'],
            'requestType' => ['required', Rule::in(config('item_request.types'))],
            'priority' => ['required', Rule::in(config('item_request.priorities'))],
            'fromDate' => ['nullable', 'required_with:untilDate', 'date_format:Y-m-d'],
            'untilDate' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:fromDate'],
            'justification' => ['required', 'string', 'max:4000'],
            'purpose' => ['nullable', 'string', 'max:4000'],
            'approverIds' => ['required', 'array', 'size:3'],
            'approverIds.*' => ['required', 'integer', 'exists:users,id'],
        ];
    }
}
