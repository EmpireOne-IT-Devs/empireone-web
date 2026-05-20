<?php

namespace App\Services;

use Google\Client;
use Google\Service\Calendar;
use Google\Service\Calendar\Event;
use Illuminate\Support\Str;

class GoogleCalendarService
{
    protected $client;
    protected $calendarService;

    public function __construct()
    {
        $this->client = new Client();
        $this->client->setAuthConfig(storage_path('app/google-credentials.json'));
        $this->client->addScope(Calendar::CALENDAR);

        $this->calendarService = new Calendar($this->client);
    }

    public function createInterviewEvent($interviewDetails)
    {
        $staticMeetLink = 'https://meet.google.com/ibi-cdps-fxp';

        // Build a detailed description including the applicant and interviewer emails
        $description = $interviewDetails['description'] . "\n\n";

        // Ensure these keys are passed from your controller!
        if (isset($interviewDetails['applicant_email'])) {
            $description .= "Applicant: " . $interviewDetails['applicant_email'] . "\n";
        }
        if (isset($interviewDetails['interviewer_email'])) {
            $description .= "Interviewer: " . $interviewDetails['interviewer_email'] . "\n";
        }

        $description .= "\nJoin the interview here: " . $staticMeetLink;

        $event = new Event([
            // The title already contains the applicant's name based on your earlier controller code
            'summary'     => $interviewDetails['title'],
            'description' => $description,
            'location'    => $staticMeetLink,
            'start'       => [
                'dateTime' => $interviewDetails['start_time'],
                'timeZone' => 'Asia/Manila',
            ],
            'end'         => [
                'dateTime' => $interviewDetails['end_time'],
                'timeZone' => 'Asia/Manila',
            ]
        ]);

        // Note: Make sure this calendar ID belongs to your Service Account 
        // or a calendar shared directly with the Service Account email!
        $calendarId = 'ce764e3392da86d58050b4aa89f7dc8005e0c352f0e308e30dacc31280347ee9@group.calendar.google.com';

        $createdEvent = $this->calendarService->events->insert($calendarId, $event, [
            // ✅ MUST BE 'none' IF THERE ARE NO ATTENDEES
            'sendUpdates' => 'none'
        ]);

        return [
            'event_id'  => $createdEvent->getId(),
            'meet_link' => $staticMeetLink
        ];
    }
}
