<?php

namespace App\Jobs;

use App\Models\AssetInventory\AssetLiabilityForm;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;

class SendAssetLiabilityFormEmail implements ShouldBeUnique, ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $backoff = 60;

    public int $uniqueFor = 600;

    public function __construct(public readonly string $formUuid) {}

    public function uniqueId(): string
    {
        return $this->formUuid;
    }

    public function handle(): void
    {
        $form = AssetLiabilityForm::where('uuid', $this->formUuid)->first();
        if (! $form || $form->status !== AssetLiabilityForm::PENDING) {
            return;
        }

        $recipient = User::find($form->assignee_id);
        if (! Route::has(AssetLiabilityForm::SIGNING_ROUTE)
            || ! $recipient || Gate::forUser($recipient)->denies('acknowledge', $form)) {
            Log::warning('Liability form email skipped: signing page or eligible recipient unavailable.', ['form_uuid' => $this->formUuid]);

            return;
        }

        $url = route(AssetLiabilityForm::SIGNING_ROUTE, ['liabilityForm' => $form->uuid]);
        $subject = 'Asset Accountability Form ready for acknowledgment';
        Mail::send([
            'html' => 'emails.asset_inventory.liability-form',
            'raw' => "Sign in to review and acknowledge your Asset Accountability Form:\n{$url}",
        ], compact('url', 'subject'), function (Message $message) use ($recipient, $subject) {
            $message->to($recipient->email)->subject($subject);
        });
        AssetLiabilityForm::whereKey($form->getKey())->update(['email_sent_at' => now()]);
    }
}
