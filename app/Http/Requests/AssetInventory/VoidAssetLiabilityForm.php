<?php

namespace App\Http\Requests\AssetInventory;

use Illuminate\Foundation\Http\FormRequest;

class VoidAssetLiabilityForm extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('void', $this->route('liabilityForm'));
    }

    public function rules(): array
    {
        return ['reason' => ['required', 'string', 'max:2000']];
    }
}
