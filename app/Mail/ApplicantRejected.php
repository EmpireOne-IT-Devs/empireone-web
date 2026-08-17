<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ApplicantRejected extends Mailable
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
            subject: config('app.name'),
        );
    }


    public function build()
    {
        return $this->subject('Update on your Job Application')
            ->view('emails.job_requisition.job-offer-applicant-rejected');
    }
}
