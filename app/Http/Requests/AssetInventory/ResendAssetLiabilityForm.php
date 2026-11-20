<?php

namespace App\Http\Requests\AssetInventory;

use Illuminate\Foundation\Http\FormRequest;

class ResendAssetLiabilityForm extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('resend', $this->route('liabilityForm'));
    }

    public function rules(): array
    {
        return [];
    }
}
