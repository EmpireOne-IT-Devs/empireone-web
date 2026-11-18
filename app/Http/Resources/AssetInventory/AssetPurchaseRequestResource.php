<?php

namespace App\Http\Resources\AssetInventory;

use App\Models\AssetInventory\AssetPurchaseRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssetPurchaseRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'id' => sprintf('PR-%03d', $this->getKey()),
            'itemName' => $this->item_name,
            'department' => $this->department,
            'requesterName' => $this->requester_name,
            'requesterEmail' => $this->requester_email,
            'category' => $this->category,
            'quantity' => $this->quantity,
            'unitPrice' => (float) $this->unit_price,
            'totalAmount' => round($this->quantity * (float) $this->unit_price, 2),
            'departmentCode' => $this->department_code,
            'priority' => $this->priority,
            'purchaseDate' => $this->purchase_date->toDateString(),
            'requestDate' => $this->created_at->toDateString(),
            'status' => $this->status,
            'supplier' => $this->supplier,
            'quotationName' => $this->quotation_name,
            'approvals' => $this->whenLoaded('steps', fn () => $this->steps->map(fn ($step) => [
                'key' => $step->key,
                'label' => $step->label,
                'description' => $step->description,
                'status' => $step->status,
                'approverName' => $step->approver_name,
                'actedAt' => $step->acted_at?->toIso8601String(),
                'remarks' => $step->remarks,
            ])),
            'canAct' => $this->whenLoaded('steps', function () use ($request) {
                $step = $this->steps->firstWhere('status', 'pending');

                return $this->isPending() && $step !== null
                    && $request->user()->can('decide', [AssetPurchaseRequest::class, $step->key]);
            }),
        ];
    }
}
