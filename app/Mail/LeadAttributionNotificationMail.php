<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LeadAttributionNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $applicantName,
        public ?string $applicantEmail,
        public ?string $position,
        public array $attribution,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New application: ' . ($this->position ?: 'Careers') . ' [' . ($this->attribution['lead_source'] ?? 'direct/unknown') . ']',
        );
    }

    public function build()
    {
        return $this->view('emails.job_requisition.lead-attribution');
    }
}
