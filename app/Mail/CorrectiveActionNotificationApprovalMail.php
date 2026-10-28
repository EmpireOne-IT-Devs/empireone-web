<?php

namespace App\Mail;

use App\Models\PM\PMCorrectiveAction;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

// REMOVED: implements ShouldQueue
class CorrectiveActionNotificationApprovalMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(public PMCorrectiveAction $correctiveAction) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $employeeName = trim("{$this->correctiveAction->first_name} {$this->correctiveAction->last_name}")
            ?: ($this->correctiveAction->name ?? 'Employee');

        // Use ca_id instead of integer id so it shows "CA-202610-XXX"
        $caId = $this->correctiveAction->id ?? $this->correctiveAction->id ?? 'N/A';

        return new Envelope(
            subject: "Action Required: Corrective Action Approval [{$caId}] - {$employeeName}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.performance_management.corrective-action-approval',
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
