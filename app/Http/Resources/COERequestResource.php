<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class COERequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $info = $this->user?->personal_information;
        $name = $info
            ? trim(collect([$info->first_name, $info->middle_name, $info->last_name])->filter()->implode(' '))
            : '';

        return [
            'id' => $this->uuid,
            'control_no' => sprintf('COE-%06d', $this->id),
            'employee_id' => $this->employee_id,
            'name' => $name !== '' ? $name : ($this->user?->name ?? ''),
            'purpose' => $this->purpose,
            'requested_at' => $this->requested_at?->toIso8601String(),
        ];
    }
}
