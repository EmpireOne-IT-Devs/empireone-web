<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SendEmailAccountCreation extends Mailable
{
    use Queueable, SerializesModels;

    // 1. Define public properties so they are automatically available in the view
    public $user;
    public $url;
    public $schedule;

    /**
     * Create a new message instance.
     */
    public function __construct($user, $url, $schedule)
    {
        $this->user = $user;
        $this->url = $url;
        $this->schedule = $schedule;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Welcome to ' . config('app.name') . '! 🚀',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.account.account_created', // Make sure this matches your file name
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
