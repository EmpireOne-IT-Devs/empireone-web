<?php

namespace App\Http\Requests\AssetInventory;

use Illuminate\Foundation\Http\FormRequest;

class AcknowledgeAssetLiabilityForm extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('acknowledge', $this->route('liabilityForm'));
    }

    public function rules(): array
    {
        return [
            'accepted' => ['required', 'accepted'],
            'templateVersion' => ['required', 'string', 'max:40'],
        ];
    }
}
