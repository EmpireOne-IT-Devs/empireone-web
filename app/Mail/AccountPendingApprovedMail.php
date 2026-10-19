<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AccountPendingApprovedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public string $eid,
        public string $initialPassword,
        public string $loginUrl,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your ' . config('app.name') . ' account is approved',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.account.account_pending_approved',
            with: [
                'user' => $this->user,
                'eid' => $this->eid,
                'initialPassword' => $this->initialPassword,
                'loginUrl' => $this->loginUrl,
            ],
        );
    }
}
