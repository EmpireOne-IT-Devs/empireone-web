<?php

namespace App\Http\Resources\AssetInventory;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssetDeviceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->uuid,
            'assetTag' => $this->asset_tag,
            'serialNumber' => $this->serial_number,
            'deviceType' => $this->device_type,
            'brand' => $this->brand,
            'model' => $this->model,
            'status' => $this->status,
            'availability' => $this->availability,
            'condition' => $this->condition,
            'nature' => $this->nature,
            'price' => $this->price !== null ? (float) $this->price : null,
            'purchaseDate' => $this->purchase_date?->toDateString(),
            'account' => $this->account,
            'issuedTo' => $this->issued_to,
            'receivedBy' => $this->received_by,
            'location' => $this->location,
            'site' => $this->site,
            'notes' => $this->notes,
            'createdAt' => $this->created_at?->toDateTimeString(),
        ];
    }
}
