<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContractSigningMail extends Mailable
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
            subject: config('app.name') . '! You have a job contract to sign! 🚀',
        );
    }


    public function build()
    {
        return $this->subject('Action Required: Upload your 201 File')
            ->view('emails.job_requisition.contract-signing');
    }
}
