<?php

namespace App\Http\Resources\AssetInventory;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssetOtherAssetResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->uuid,
            'assetTag' => $this->asset_tag,
            'serialNumber' => $this->serial_number,
            'name' => $this->name,
            'category' => $this->category,
            'details' => $this->details,
            'status' => $this->status,
            'condition' => $this->condition,
            'nature' => $this->nature,
            'price' => $this->price !== null ? (float) $this->price : null,
            'purchaseDate' => $this->purchase_date?->toDateString(),
            'account' => $this->account,
            'assignedTo' => $this->assigned_to,
            'location' => $this->location,
            'site' => $this->site,
            'notes' => $this->notes,
            'createdAt' => $this->created_at?->toDateTimeString(),
        ];
    }
}
