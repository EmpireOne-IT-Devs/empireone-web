<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PreEmploymentMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;

    public function __construct($user)
    {
        // Passing the user object to the email view
        $this->user = $user;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: config('app.name') . '! Pre-Employment Checklist 🎊',
        );
    }


    public function build()
    {
        return $this->subject('Action Required: Pre-Employment Checklist')
            ->view('emails.job_requisition.pre-employment');
    }
}
