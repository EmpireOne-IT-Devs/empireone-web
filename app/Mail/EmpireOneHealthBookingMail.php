<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EmpireOneHealthBookingMail extends Mailable
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
            subject: 'EmpireOne Health Booking Confirmation',
        );
    }


    public function build()
    {
        return $this->subject('EmpireOne Health Booking Confirmation')
            ->view('emails.empireonehealth.booking-confirmation');
    }
}
