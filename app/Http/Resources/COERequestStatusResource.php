<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class COERequestStatusResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'can_generate' => $this->resource['next_available_at'] === null,
            'last_requested_at' => $this->resource['last_requested_at']?->toIso8601String(),
            'next_available_at' => $this->resource['next_available_at']?->toIso8601String(),
        ];
    }
}
