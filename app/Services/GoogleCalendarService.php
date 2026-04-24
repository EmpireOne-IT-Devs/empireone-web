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
        $event = new Event([
            'summary' => $interviewDetails['title'],
            'description' => $interviewDetails['description'],
            'start' => [
                'dateTime' => $interviewDetails['start_time'],
                'timeZone' => 'Asia/Manila',
            ],
            'end' => [
                'dateTime' => $interviewDetails['end_time'],
                'timeZone' => 'Asia/Manila',
            ],
        ]);

        // 🛑 WE ARE HARDCODING THIS TO THE ROBOT TO BYPASS THE ERROR 🛑
        $calendarId = 'webdev@empireonegroup.com';

        $createdEvent = $this->calendarService->events->insert($calendarId, $event, [
            'sendUpdates' => 'none'
        ]);

        return [
            'event_id' => $createdEvent->getId(),
            // No meet link here, we are just proving the event saves!
        ];
    }
}
