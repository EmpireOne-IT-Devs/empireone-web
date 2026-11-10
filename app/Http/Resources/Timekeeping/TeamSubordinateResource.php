<?php

namespace App\Http\Resources\Timekeeping;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeamSubordinateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'user_id' => $this->resource['user_id'],
            'name' => $this->resource['name'],
            'employee_id' => $this->resource['employee_id'],
        ];
    }
}
