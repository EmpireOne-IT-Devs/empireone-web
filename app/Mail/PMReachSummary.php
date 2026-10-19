<?php

namespace App\Mail;

use App\Models\PM\PMReach as PMPMReach;
use App\Models\PMReach;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PMReachSummary extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public PMPMReach $reach) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Coaching Summary for ' . $this->reach->first_name . ' ' . $this->reach->last_name,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.performance_management.pm-reach-session',
        );
    }
}