<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WorkAnniversaryMail extends Mailable
{
    use Queueable, SerializesModels;

    public array $employee;
    public string $customMessage;

    public function __construct(array $employee, string $customMessage)
    {
        $this->employee = $employee;
        $this->customMessage = $customMessage;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: config('app.name') . " — Happy {$this->employee['anniversary_label']}! 🎉",
        );
    }

    public function build()
    {
        return $this->view('emails.engagement.work-anniversary');
    }
}
