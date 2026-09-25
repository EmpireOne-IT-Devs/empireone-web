<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RecognitionReceivedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $recognition;
    public $recipientName;
    public $senderName;

    public function __construct($recognition, $recipientName, $senderName)
    {
        $this->recognition = $recognition;
        $this->recipientName = $recipientName;
        $this->senderName = $senderName;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: config('app.name') . ' — You\'ve been recognized! 🎉',
        );
    }

    public function build()
    {
        return $this->view('emails.engagement.recognition-received');
    }
}
