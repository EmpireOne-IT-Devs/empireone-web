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
        // Point this to your downloaded JSON file
        $this->client->setAuthConfig(storage_path('app/google-credentials.json'));
        $this->client->addScope(Calendar::CALENDAR);

        $this->calendarService = new Calendar($this->client);
    }

    public function createInterviewEvent($interviewDetails)
    {
        $staticMeetLink = 'https://meet.google.com/ibi-cdps-fxp';

        $event = new Event([
            'summary'     => $interviewDetails['title'],
            'description' => $interviewDetails['description'] . "\n\nJoin the interview here: " . $staticMeetLink,
            'location'    => $staticMeetLink, // Puts it in the location field!
            'start'       => [
                'dateTime' => $interviewDetails['start_time'],
                'timeZone' => 'Asia/Manila',
            ],
            'end'         => [
                'dateTime' => $interviewDetails['end_time'],
                'timeZone' => 'Asia/Manila',
            ]
        ]);

        $calendarId = 'ce764e3392da86d58050b4aa89f7dc8005e0c352f0e308e30dacc31280347ee9@group.calendar.google.com';

        $createdEvent = $this->calendarService->events->insert($calendarId, $event, [
            'sendUpdates' => 'none'
        ]);

        return [
            'event_id' => $createdEvent->getId(),
            'meet_link' => $staticMeetLink
        ];
    }
}
