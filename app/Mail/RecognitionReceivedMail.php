<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RecognitionReceivedMail extends Mailable
{
    use Queueable, SerializesModels;

    // Mirrors AWARD_MESSAGES in certificate-reward-section.jsx
    private const AWARD_MESSAGES = [
        'Reliability' => [
            'In recognition of your steadfast reliability, unwavering commitment, and consistent dedication to honoring every promise you make. You have demonstrated that trust is built through actions—by showing up, following through, delivering with consistency, and remaining dependable when it matters most.',
            'Your commitment to excellence and your ability to be counted on by colleagues, clients, and partners exemplify the Trust & Reliability values of EmpireOneCX. You remind us that meaningful relationships are built one commitment at a time, and that when people can count on you, trust follows.',
            'With sincere appreciation for being someone others can rely on and for consistently turning commitments into results.',
        ],
        'Excellence' => [
            'In recognition of your exceptional commitment to excellence, outstanding performance, and unwavering dedication to the highest standards of quality. Through your professionalism, discipline, and continuous pursuit of improvement, you have distinguished yourself as an individual who raises the bar, inspires others, and exemplifies what excellence means at EmpireOneCX.',
            'Your contribution is not only recognized—it is celebrated as a standard for others to aspire to.',
            'With appreciation for your pursuit of excellence and your lasting impact on our success.',
        ],
        'Adaptability' => [
            'In recognition of your remarkable adaptability, agility, and unwavering ability to embrace change with confidence and purpose. You consistently respond to new challenges with an open mind, turn uncertainty into opportunity, and find innovative ways to navigate evolving demands.',
            'Your resilience, flexibility, and willingness to learn exemplify the Adaptability values of EmpireOneCX, enabling our teams to move forward, evolve, and thrive in an ever-changing environment. You remind us that progress belongs to those who are willing to embrace change, challenge the familiar, and create new possibilities.',
            'With sincere appreciation for your resilience, flexibility, and ability to help others move forward through change.',
        ],
        'Collaboration' => [
            'In recognition of your exceptional spirit of collaboration, unwavering support for others, and commitment to building a stronger team. Through your generosity, teamwork, and willingness to lift those around you, you demonstrate that our greatest achievements are made possible when we work together, support one another, and share a common purpose.',
            'Your ability to bring people together, foster trust, and contribute to a culture of collaboration exemplifies the spirit of One Team at EmpireOneCX. Your impact reminds us that when we work as one, we achieve more together.',
            'With appreciation for your commitment to teamwork and the positive difference you make every day.',
        ],
        'Integrity' => [
            'In recognition of your unwavering integrity, exceptional sense of responsibility, and steadfast commitment to protecting what matters most. You consistently demonstrate honesty, accountability, and sound judgment while upholding the highest standards of confidentiality, security, and ethical conduct.',
            'Through your actions, you help safeguard our people, our clients, our customers, and the trust placed in EmpireOneCX. Your commitment to doing what is right—especially when it matters most—sets an example for those around you. You embody the belief that integrity builds trust, security protects it, and accountability sustains it.',
            'With sincere appreciation for your commitment to protecting our people, our information, and the trust we have earned together.',
        ],
        'The Empathy Award' => [
            'In recognition of your genuine compassion, exceptional understanding, and unwavering commitment to putting people first. Through your kindness, patience, and willingness to listen, you create meaningful connections and make those around you feel heard, valued, and respected.',
            'Your ability to lead with empathy, support others through challenges, and treat every person with dignity exemplifies the People First spirit of EmpireOneCX. Your actions remind us that while excellence drives what we do, empathy defines how we do it.',
            'With sincere appreciation for the positive impact you make through every interaction, every act of kindness, and every person you inspire.',
        ],
        'The Initiative Award' => [
            'In recognition of your exceptional initiative, proactive spirit, and unwavering determination to turn opportunities into action. You consistently step forward, take ownership, and find ways to make things happen—often going beyond what is expected to create meaningful results and positive change.',
            'Your willingness to act, solve problems, embrace challenges, and inspire others through your example reflects the entrepreneurial spirit and can-do culture of EmpireOneCX. You remind us that great ideas become great achievements when someone has the courage to take the first step and the determination to see it through.',
            'With sincere appreciation for your drive, resourcefulness, and the positive impact you create through action.',
        ],
        'The Innovation Award' => [
            'In recognition of your visionary thinking, creative problem-solving, and unwavering commitment to finding better ways forward. You challenge the ordinary, question the expected, and transform ideas into meaningful solutions that create value for our people, our clients, and our customers.',
            'Your curiosity, creativity, and courage to explore new possibilities exemplify the innovative spirit of EmpireOneCX and inspire those around you to see challenges as opportunities for improvement. You remind us that innovation begins with the willingness to think differently, challenge convention, and turn possibilities into progress.',
            'With sincere appreciation for your creativity, ingenuity, and contribution to shaping a smarter, better, and more innovative future.',
        ],
        'The Customer Champion' => [
            'In recognition of your exceptional dedication to our customers, unwavering commitment to service excellence, and remarkable willingness to go the extra mile. Through every interaction, you demonstrate genuine care, professionalism, and a relentless commitment to creating experiences that exceed expectations.',
            'Your ability to listen, understand, anticipate needs, and turn challenges into opportunities reflects the very best of the customer-first spirit of EmpireOneCX. You remind us that extraordinary service is not simply about meeting expectations—it is about creating moments that customers remember and trust.',
            'Your dedication strengthens our client relationships, elevates the customer experience, and sets a standard of service for others to follow.',
            'With sincere appreciation for making every customer interaction count and for consistently going the extra mile.',
        ],
        'The Ownership Award' => [
            'In recognition of your exceptional sense of ownership, unwavering accountability, and steadfast commitment to delivering results. You take responsibility, follow through on your commitments, and consistently rise to the occasion—turning challenges into opportunities and expectations into results.',
            'Your determination to see things through, coupled with your reliability and proactive approach, exemplifies the ownership mindset of EmpireOneCX. You demonstrate that true ownership is more than accepting responsibility—it is having the initiative to act, the discipline to follow through, and the commitment to deliver.',
            'With sincere appreciation for your dependability, accountability, and the lasting impact you make through taking ownership of every opportunity.',
        ],
    ];

    private const AWARD_ALIASES = [
        'Trust & Reliability' => 'Reliability',
        'The Excellence Award' => 'Excellence',
        'The One Team Award' => 'Collaboration',
        'The Integrity Award' => 'Integrity',
        'Integrity & Security' => 'Integrity',
    ];

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
        $key = $this->recognition->award_category ?: $this->recognition->company_value;
        $key = self::AWARD_ALIASES[$key] ?? $key;

        return $this->view('emails.engagement.recognition-received', [
            'awardMessage' => self::AWARD_MESSAGES[$key] ?? null,
        ]);
    }
}
