<?php

namespace App\Http\Controllers\API\EmpireoneHealth;

use App\Models\EmpireOneHealth\EmpireOneHealthConsultationAppointment;
use App\Models\EmpireOneHealth\EmpireOneHealthBooking;
use App\Http\Controllers\Controller;
use App\Models\EmpireOneHealth\EmpireOneHealthAppointmentDetails;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

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



    private function send_empireone_health_appointment_schedule(array $payload)
    {
        $webAppUrl = env('SEND_EMPIREONEHEALTH_APPOINTMENT');
        Http::asJson()
            ->withOptions([
                'allow_redirects' => [
                    'strict' => true, // Preserves POST method and JSON payload across Google 302 redirects
                ],
            ])
            ->post($webAppUrl, [
                'recipient'      => $payload['recipient'],
                'subject' => $payload['subject'],
                'body' => $payload['body'], // Contains your HTML string
            ]);
    }

    public function add_appointment(Request $request)
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'notes' => 'nullable',
            'phone' => 'nullable|string|max:20',
            'appointment_id' => 'nullable|exists:empire_one_health_bookings,id',
            'company_name' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:255',
            'looking_for' => 'nullable|string|max:255',
            'privacy_policy_agreed' => 'nullable|boolean',
        ]);

        // Create the booking
        $booking = EmpireOneHealthBooking::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'notes' => $request->notes,
        ]);

        // Use the newly created booking ID
        if (
            $request->company_name ||
            $request->source ||
            $request->looking_for ||
            $request->privacy_policy_agreed
        ) {
            EmpireOneHealthAppointmentDetails::create([
                'appointment_id' => $booking->id,
                'company_name' => $request->company_name,
                'source' => $request->source,
                'looking_for' => $request->looking_for,
                'privacy_policy_agreed' => $request->boolean('privacy_policy_agreed'),
            ]);
        }


        // Send appointment notification email via the Apps Script endpoint
        $this->send_empireone_health_appointment_schedule([
            'recipient' => $request->email,
            'subject' => "Appointment Confirmation #{$booking->id}",
            'body' => view('emails.empireonehealth.booking-confirmation', [
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'notes' => $request->notes,
                'company_name' => $request->company_name ?? 'NA',
                'source' => $request->source ?? 'NA',
                'looking_for' => $request->looking_for ?? 'NA',
                'appointment_id' => $booking->id ?? 'NA',
            ])->render(),
        ]);

        $this->send_empireone_health_appointment_schedule([
            'recipient' => 'info@empireonehealth.com',
            'subject' => "Appointment Notification #{$booking->id}",
            'body' => view('emails.empireonehealth.booking-notification', [
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'notes' => $request->notes,
                'company_name' => $request->company_name ?? 'NA',
                'source' => $request->source ?? 'NA',
                'looking_for' => $request->looking_for ?? 'NA',
                'appointment_id' => $booking->id ?? 'NA',
            ])->render(),
        ]);
        return response()->json([
            'success' => true,
            'message' => 'Appointment added successfully',
            'appointment_id' => $booking->id,
        ], 200);
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
                "Booking EmpireOne Health - 30 Minutes Call\n" .
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
                'title'       => "EmpireOne Health 30 Minutes Call - " . $request->name
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



    public function add_consultation(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'source' => 'nullable|string|max:255',
            'help_with' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $booking = EmpireOneHealthConsultationAppointment::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Consultation added successfully',
            // 'data'    => $booking
        ], 200);
    }
}
