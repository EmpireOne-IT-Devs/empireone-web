<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EmpireOneHealthNotificationBookingMail extends Mailable
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
            subject: 'EmpireOne Health Booking Notification',
        );
    }


    public function build()
    {
        return $this->subject('EmpireOne Health Booking Notification')
            ->view('emails.empireonehealth.booking-notification')
            ->with([
                'name' => $this->user['name'] ?? 'N/A',
                'email' => $this->user['email'] ?? 'N/A',
                'phone' => $this->user['phone'] ?? 'N/A',
                'company_name' => $this->user['company_name'] ?? 'N/A',
                'source' => $this->user['source'] ?? 'N/A',
                'looking_for' => $this->user['looking_for'] ?? 'N/A',
                'notes' => $this->user['notes'] ?? 'N/A',
            ]);
    }
}
