<?php

namespace App\Http\Resources\AssetInventory;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaperLiabilityEmployeeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->getKey(),
            'name' => $this->user->name,
            'employeeNumber' => $this->employee_id,
        ];
    }
}
