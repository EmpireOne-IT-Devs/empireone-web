<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ChangeFormEmail extends Mailable
{
    use Queueable, SerializesModels;
    public $user;
    public $url;


    public function __construct($user, $url)
    {
        // Passing the user object to the email view
        $this->user = $user;
        $this->url = $url;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Welcome to ' . config('app.name') . '! You have an Employee Change Form! 🚀',
        );
    }


    public function build()
    {
        return $this->subject('Action Required: Employee Change Form')
            ->view('emails.job_requisition.employee-change-form');
    }
}
