<?php

namespace App\Http\Resources\AssetInventory;

use App\Models\AssetInventory\AssetItemRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssetItemRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'id' => $this->item_request_id,
            'requestDate' => $this->created_at->toDateString(),
            'deviceName' => $this->asset_name,
            'assetTag' => $this->asset_tag,
            'issuedAssetTag' => $this->when($this->status === AssetItemRequest::ISSUED, $this->asset_tag),
            'assigneeName' => $this->assignee_name,
            'assigneeId' => $this->employee_number,
            'assigneeEmail' => $this->assignee_email,
            'requestType' => $this->request_type,
            'fromDate' => $this->from_date?->toDateString(),
            'untilDate' => $this->until_date?->toDateString(),
            'justification' => $this->justification,
            'purpose' => $this->purpose,
            'requesterName' => $this->requester_name,
            'requesterEmail' => $this->requester_email,
            'department' => $this->department,
            'priority' => $this->priority,
            'status' => $this->status,
            'approvals' => $this->whenLoaded('steps', fn () => $this->steps->map(fn ($step) => [
                'key' => $step->key,
                'label' => $step->label,
                'description' => $step->description,
                'status' => $step->status,
                'assignedUserId' => $step->assigned_user_id,
                'approverName' => $step->approver_name,
                'actedAt' => $step->acted_at?->toIso8601String(),
                'remarks' => $step->remarks,
            ])),
            'canAct' => $this->whenLoaded('steps', function () use ($request) {
                $step = $this->steps->firstWhere('status', 'pending');

                return $this->isPending() && $step !== null
                    && $request->user()->can('decide', [AssetItemRequest::class, $step->key]);
            }),
        ];
    }
}
