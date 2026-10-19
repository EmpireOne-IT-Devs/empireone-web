<?php

namespace App\Http\Resources\Account;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccountPendingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'location_id' => $this->location_id,
            'location_name' => $this->location?->name,
            'full_name' => $this->full_name,
            'eid' => $this->eid,
            'employee_email' => $this->employee_email,
            'position' => $this->position,
            'status' => $this->status,
            'approved_at' => $this->approved_at,
            'approved_by_user_id' => $this->approved_by_user_id,
            'declined_at' => $this->declined_at,
            'declined_by_user_id' => $this->declined_by_user_id,
            'user_id' => $this->user_id,
            'created_at' => $this->created_at,
        ];
    }
}
