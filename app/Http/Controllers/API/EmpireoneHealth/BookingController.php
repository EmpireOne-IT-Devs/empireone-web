<?php

namespace App\Http\Controllers\API\EmpireoneHealth;

use App\Http\Controllers\Controller;
use GuzzleHttp\Client;
use Illuminate\Http\Request;

class BookingController extends Controller
{

    public function send_empireone_health_calendar_schedule($data)
    {
        $scriptUrl = env('SEND_EMPIREONEHEALTH_SCHEDULE');
        $client = new Client();
        $response = $client->post($scriptUrl, [
            'headers' => [
                'Content-Type' => 'application/x-www-form-urlencoded'
            ],
            'form_params' => $data
        ]);
        $body = $response->getBody()->getContents();
        return $body;
    }
    public function add_appointment(){
        
    }
    public function add_booking(Request $request)
    {
        // 1. Validate incoming request
        $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'required|email|max:255',
            'start_time' => 'required|date',
            'end_time'   => 'required|date',
        ]);

        try {
            $googleStartTime = \Carbon\Carbon::parse($request->start_time)->toIso8601String();
            $googleEndTime   = \Carbon\Carbon::parse($request->end_time)->toIso8601String();

            // 2. Safely extract optional fields
            $companyName   = $request->company_name ?? 'EmpireOne Health';
            $source        = $request->source ?? 'N/A';
            $buildGoal     = $request->looking_to_build ?? 'N/A';
            $userMessage   = $request->message ?? 'None provided';
            $contactNumber = $request->contact_number ?? 'None';

            // 3. Construct the description
            $descriptionText =
                "Booking EmpireOne Health - 1 Hour Call\n" .
                "--------------------------------------------------\n" .
                "Full Name: {$request->name}\n" .
                "Company Name: {$companyName}\n" .
                "Email: {$request->email}\n" .
                "Contact Number: {$contactNumber}\n" .
                "Source: {$source}\n" .
                "Looking to build: {$buildGoal}\n" .
                "--------------------------------------------------\n" .
                "Message:\n{$userMessage}\n\n" .
                "Please be ready 5 minutes before the start time.";

            // 4. Send to calendar
            $result = $this->send_empireone_health_calendar_schedule([
                'email'       => $request->email,
                'name'        => $request->name,
                'start_time'  => $googleStartTime,
                'end_time'    => $googleEndTime,
                'description' => $descriptionText,
                'title'       => "EmpireOne. 1 hour Call - " . $request->name
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Schedule sent successfully',
                'data'    => json_decode($result, true)
            ], 200);
        } catch (\Exception $e) {
            // Handle API failures gracefully
            return response()->json([
                'success' => false,
                'message' => 'Failed to schedule booking: ' . $e->getMessage()
            ], 500);
        }
    }
}
