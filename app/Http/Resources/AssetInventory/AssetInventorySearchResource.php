<?php

namespace App\Http\Resources\AssetInventory;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssetInventorySearchResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->inventory_category.':'.$this->uuid,
            'category' => $this->inventory_category,
            'assetTag' => $this->asset_tag,
            'serialNumber' => $this->serial_number,
            'deviceType' => $this->asset_type,
            'name' => $this->name,
            'brand' => $this->brand,
            'model' => $this->model,
            'condition' => $this->condition,
            'status' => $this->status,
            'availability' => $this->availability,
            'quantity' => $this->quantity === null ? null : (int) $this->quantity,
            'price' => $this->price === null ? null : (float) $this->price,
            'purchaseDate' => $this->purchase_date,
            'issuedTo' => $this->issued_to,
            'receivedBy' => $this->received_by,
        ];
    }
}
