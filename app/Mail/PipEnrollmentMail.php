<?php

namespace App\Mail;

use App\Models\PM\PMPip;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PipEnrollmentMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public PMPip $pip,
        public string $customSubject = 'PIP Enrollment',
        public bool $isCc = false,
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $employeeName = trim("{$this->pip->first_name} {$this->pip->last_name}")
            ?: 'Employee';

        $pipId = $this->pip->id ?? 'N/A';

        return new Envelope(
            subject: "Action Required: {$this->customSubject} [{$pipId}] - {$employeeName}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.performance_management.pip-enrollment',
            with: [
                'isCc' => $this->isCc,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
