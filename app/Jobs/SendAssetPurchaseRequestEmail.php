<?php

namespace App\Jobs;

use App\Models\AssetInventory\AssetPurchaseRequest;
use App\Models\User;
use Brick\Math\BigDecimal;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendAssetPurchaseRequestEmail implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $backoff = 60;

    public function __construct(
        public readonly string $requestUuid,
        public readonly string $expectedStatus,
        public readonly ?string $stepKey = null,
    ) {}

    public function handle(): void
    {
        $request = AssetPurchaseRequest::where('uuid', $this->requestUuid)->first();
        if (! $request || $request->status !== $this->expectedStatus) {
            return;
        }

        $reference = $request->reference();
        if ($this->stepKey !== null) {
            $step = $request->steps()->where('status', 'pending')->first();
            if ($step?->key !== $this->stepKey) {
                return;
            }

            $email = trim((string) config('purchase_request.steps.'.$step->key.'.email'));
            $recipient = $email === '' ? null : User::whereRaw('LOWER(email) = ?', [strtolower($email)])->first();
            if (! $recipient || Gate::forUser($recipient)->denies('decide', [AssetPurchaseRequest::class, $step->key])) {
                $this->logMissingRecipient();
                return;
            }

            $subject = "{$reference} needs your approval";
            $body = "Purchase request {$reference} is waiting for your review at the {$step->label} step.";
        } else {
            // Use the owner's current verified account, not the historical email snapshot.
            $recipient = User::find($request->requester_id);
            if (! $recipient || ! $recipient->hasVerifiedEmail() || Gate::forUser($recipient)->denies('view', $request)) {
                $this->logMissingRecipient();
                return;
            }

            $approved = $request->status === AssetPurchaseRequest::APPROVED;
            $subject = "{$reference} was ".($approved ? 'approved' : 'rejected');
            $body = $approved
                ? "Purchase request {$reference} has completed all approval steps."
                : "Purchase request {$reference} was rejected. Sign in to see the review details.";
        }

        $url = route('asset-purchase-requests.page.show', ['id' => $request->uuid]);
        $summary = ['Requester' => $request->requester_name, 'Priority' => $request->priority];
        $items = $request->itemLines();
        if ($request->items !== null) {
            $total = $request->grandTotal();
        } else {
            $total = (string) BigDecimal::of($request->unit_price)->multipliedBy($request->quantity);
            $items = [[
                'description' => $request->item_name,
                'quantity' => $request->quantity,
                'unitCost' => $request->unit_price,
                'lineTotal' => $total,
            ]];
        }
        $grandTotal = $this->formatAmount($total);
        $summaryText = '';
        foreach ($summary as $label => $value) {
            $summaryText .= "\n{$label}: {$value}";
        }
        $itemRows = [];
        $itemText = '';
        foreach ($items as $index => $item) {
            $unitCost = $this->formatAmount($item['unitCost']);
            $lineTotal = $this->formatAmount($item['lineTotal']);
            $itemRows[] = [...$item, 'unitCost' => $unitCost, 'lineTotal' => $lineTotal];
            $itemText .= "\n".($index + 1).". {$item['description']} ({$item['quantity']} x {$unitCost} = {$lineTotal})";
        }

        Mail::send([
            'html' => 'emails.asset_inventory.purchase-request',
            'raw' => "{$body}\n\nRequest summary{$summaryText}\n\nRequested items{$itemText}\n\nGrand total: {$grandTotal}\n\nView purchase request: {$url}",
        ], compact('subject', 'body', 'url', 'summary', 'itemRows', 'grandTotal'), function (Message $message) use ($recipient, $subject) {
            $message->to($recipient->email)->subject($subject);
        });
    }

    private function formatAmount(string $amount): string
    {
        [$whole, $fraction] = explode('.', $amount, 2);

        return 'PHP '.preg_replace('/\B(?=(\d{3})+$)/', ',', $whole).'.'.$fraction;
    }

    private function logMissingRecipient(): void
    {
        Log::warning('Purchase request email skipped: no eligible verified recipient.', [
            'request_uuid' => $this->requestUuid,
            'step' => $this->stepKey,
            'status' => $this->expectedStatus,
        ]);
    }
}
