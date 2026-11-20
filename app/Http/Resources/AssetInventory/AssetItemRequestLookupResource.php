<?php

namespace App\Http\Resources\AssetInventory;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssetItemRequestLookupResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return $this->resource;
    }
}
