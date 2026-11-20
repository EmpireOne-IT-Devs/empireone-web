<?php

namespace App\Http\Requests\AssetInventory;

use App\Models\AssetInventory\AssetLiabilityForm;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

class StorePaperLiabilityForm extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('recordPaper', AssetLiabilityForm::class);
    }

    public function rules(): array
    {
        return [
            'employeeProfileId' => ['required', 'integer', 'min:1'],
            'signedDate' => ['required', 'date_format:Y-m-d', 'before_or_equal:today'],
            'issueDate' => ['nullable', 'date_format:Y-m-d', 'before_or_equal:signedDate'],
            'hireDate' => ['nullable', 'date_format:Y-m-d'],
            'accountProgram' => ['nullable', 'string', 'max:150'],
            'location' => ['nullable', 'string', 'max:150'],
            'items' => ['required', 'array', 'list', 'min:1', 'max:20'],
            'items.*' => ['required', 'array:assetType,assetTag,brandModel,serialNumber,conditionAtIssuance,purchaseValue,remarks'],
            'items.*.assetType' => ['required', Rule::in(AssetLiabilityForm::PAPER_ASSET_TYPES)],
            'items.*.assetTag' => ['nullable', 'string', 'max:100'],
            'items.*.brandModel' => ['required', 'string', 'max:150'],
            'items.*.serialNumber' => ['nullable', 'string', 'max:150'],
            'items.*.conditionAtIssuance' => ['nullable', 'string', 'max:100'],
            'items.*.purchaseValue' => ['nullable', 'numeric', 'decimal:0,2', 'min:0', 'max:9999999999.99'],
            'items.*.remarks' => ['nullable', 'string', 'max:500'],
            'scan' => ['nullable', 'file', File::types(['pdf', 'jpg', 'jpeg', 'png'])->max('10mb')],
        ];
    }
}
