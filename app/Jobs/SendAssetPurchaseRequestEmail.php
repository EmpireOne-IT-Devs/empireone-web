<?php

namespace App\Jobs;

use App\Models\AssetInventory\AssetPurchaseRequest;
use App\Models\User;
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
        Mail::send([
            'html' => 'emails.asset_inventory.purchase-request',
            'raw' => "{$body}\n\nView purchase request: {$url}",
        ], compact('subject', 'body', 'url'), function (Message $message) use ($recipient, $subject) {
            $message->to($recipient->email)->subject($subject);
        });
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
