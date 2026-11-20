<?php

namespace App\Jobs;

use App\Models\AssetInventory\AssetItemRequest;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendAssetItemRequestEmail implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $backoff = 60;

    public function __construct(
        public readonly string $requestUuid,
        public readonly string $expectedStatus,
        public readonly ?string $stepKey,
    ) {}

    public function handle(): void
    {
        $request = AssetItemRequest::where('uuid', $this->requestUuid)->first();
        if (! $request || $request->status !== $this->expectedStatus) {
            return;
        }

        $reference = $request->item_request_id;
        if ($this->stepKey !== null) {
            $step = $request->steps()->where('status', 'pending')->first();
            if ($step?->key !== $this->stepKey) {
                return;
            }
            $email = trim((string) config('item_request.steps.'.$step->key.'.email'));
            $recipient = $email === '' ? null : User::whereRaw('LOWER(email) = ?', [strtolower($email)])->first();
            $allowed = $recipient && Gate::forUser($recipient)->allows('decide', [AssetItemRequest::class, $step->key]);
            $subject = "{$reference} needs your approval";
            $body = "{$reference} is waiting for your review at the {$step->label} step.";
        } else {
            $recipient = User::find($request->requester_id);
            $allowed = $recipient && $recipient->hasVerifiedEmail() && Gate::forUser($recipient)->allows('view', $request);
            $subject = "{$reference} was rejected";
            $body = "{$reference} was rejected. Sign in to review the request.";
        }
        if (! $allowed) {
            Log::warning('Item request email skipped: no eligible verified recipient.', [
                'request_uuid' => $this->requestUuid,
                'step' => $this->stepKey,
                'status' => $this->expectedStatus,
            ]);

            return;
        }

        $url = route('asset-item-requests.page.show', ['id' => $request->uuid]);
        Mail::send([
            'html' => 'emails.asset_inventory.item-request',
            'raw' => "{$body}\n\nView item request: {$url}",
        ], compact('subject', 'body', 'url'), function (Message $message) use ($recipient, $subject) {
            $message->to($recipient->email)->subject($subject);
        });
    }
}
