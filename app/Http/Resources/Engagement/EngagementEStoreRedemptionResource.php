<?php

namespace App\Http\Resources\Engagement;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EngagementEStoreRedemptionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $item = $this->item;
        $employee = $this->employee;
        $employeeProfile = $employee?->account_employee;

        return [
            'reference' => $this->reference,
            'quantity' => (int) $this->quantity,
            'unit_point_cost' => (int) $this->unit_point_cost,
            'total_point_cost' => (int) $this->total_point_cost,
            'status' => $this->status,
            'item' => $item ? [
                'id' => $item->id,
                'product_name' => $item->product_name,
                'product_image' => $item->product_image,
                'reward_type' => $item->reward_type,
            ] : null,
            'employee' => $employee ? [
                'id' => $employee->id,
                'name' => $employee->name,
                'email' => $employee->email,
                'eoid' => $employeeProfile?->employee_id,
                'department_name' => $employeeProfile?->department?->name,
            ] : null,
            'rejection_reason' => $this->rejection_reason,
            'cancellation_reason' => $this->cancellation_reason,
            'admin_notes' => $this->admin_notes,
            'fulfillment_notes' => $this->fulfillment_notes,
            'approved_by' => $this->approver?->name,
            'approved_at' => $this->approved_at?->toDateTimeString(),
            'processed_by' => $this->processor?->name,
            'processed_at' => $this->processed_at?->toDateTimeString(),
            'fulfilled_by' => $this->fulfiller?->name,
            'fulfilled_at' => $this->fulfilled_at?->toDateTimeString(),
            'rejected_by' => $this->rejecter?->name,
            'rejected_at' => $this->rejected_at?->toDateTimeString(),
            'cancelled_by' => $this->canceller?->name,
            'cancelled_at' => $this->cancelled_at?->toDateTimeString(),
            'refunded' => $this->relationLoaded('refund') ? $this->refund !== null : false,
            'histories' => EngagementEStoreRedemptionHistoryResource::collection($this->whenLoaded('histories')),
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
        ];
    }
}
