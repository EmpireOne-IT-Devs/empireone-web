<?php

namespace App\Http\Resources\AssetInventory;

use App\Models\AssetInventory\AssetLiabilityForm;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssetLiabilityFormResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $detail = ! $request->routeIs('asset-liability-forms.index');
        $pending = $this->status === AssetLiabilityForm::PENDING;

        return [
            'uuid' => $this->uuid,
            'id' => sprintf('LF-%04d', $this->getKey()),
            'itemRequestReference' => $this->whenLoaded('itemRequest', fn () => $this->itemRequest?->item_request_id),
            'itemRequestUuid' => $this->whenLoaded('itemRequest', fn () => $this->itemRequest?->uuid),
            'employeeName' => $this->employee_name,
            'employeeNumber' => $this->employee_number,
            'assetTag' => $this->asset_tag,
            'source' => $this->source,
            'status' => $this->status,
            'issueDate' => $this->issue_date?->toDateString(),
            'acknowledgedAt' => $this->acknowledged_at?->toIso8601String(),
            'paperSignedDate' => $this->paper_signed_date?->toDateString(),
            'emailSentAt' => $this->when($request->user()->can('resend', $this->resource), fn () => $this->email_sent_at?->toIso8601String()),
            'createdAt' => $this->created_at->toIso8601String(),
            $this->mergeWhen($detail, fn () => [
                'templateVersion' => $this->template_version,
                'document' => $this->document,
                'printedName' => $this->printed_name,
                'signature' => $this->signature,
                'hasPaperScan' => $this->paper_scan_path !== null && $request->user()->can('downloadPaperScan', $this->resource),
                'voidedAt' => $this->voided_at?->toIso8601String(),
                'voidReason' => $this->when($request->user()->can('void', $this->resource), fn () => $this->void_reason),
                'canAcknowledge' => $pending && $request->user()->can('acknowledge', $this->resource),
                'canResend' => $pending && $request->user()->can('resend', $this->resource),
                'canVoid' => $pending && $request->user()->can('void', $this->resource),
            ]),
        ];
    }
}
