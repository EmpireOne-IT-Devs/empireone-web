<?php

namespace App\Http\Resources\AssetInventory;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssetSystemUnitResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->asset_tag,
            'uuid' => $this->uuid,
            'name' => $this->name,
            'type' => $this->system_type,
            'cpu' => $this->cpu,
            'ram' => $this->ram,
            'storage' => $this->storage,
            'os' => $this->os,
            'status' => $this->status,
            'location' => $this->location,
            'station' => $this->station,
            'customBuilt' => str_contains(mb_strtolower($this->name), 'custom'),
            'createdAt' => $this->created_at?->toDateTimeString(),
        ];
    }
}
