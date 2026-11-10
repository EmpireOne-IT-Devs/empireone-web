<?php

namespace App\Http\Resources\AssetInventory;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssetPeripheralResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->uuid,
            'assetTag' => $this->asset_tag,
            'serialNumber' => $this->serial_number,
            'peripheralType' => $this->peripheral_type,
            'brand' => $this->brand,
            'model' => $this->model,
            'description' => $this->description,
            'quantity' => (int) $this->quantity,
            'lowStockThreshold' => (int) $this->low_stock_threshold,
            'status' => $this->status,
            'condition' => $this->condition,
            'price' => $this->price !== null ? (float) $this->price : null,
            'purchaseDate' => $this->purchase_date?->toDateString(),
            'account' => $this->account,
            'location' => $this->location,
            'site' => $this->site,
            'notes' => $this->notes,
            'createdAt' => $this->created_at?->toDateTimeString(),
        ];
    }
}
