<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\EmailOtpMail;
use App\Models\EmailOtp;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class EmailOtpController extends Controller
{
    public function send_OTP(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();
        if ($user) {
            return response()->json(['message' => 'Email already registered'], 400);
        }
        // Generate 6-digit OTP
        $otp = rand(100000, 999999);

        // Store in DB with 10 min expiry
        EmailOtp::updateOrCreate(
            ['email' => $request->email],
            [
                'otp' => $otp,
                'expires_at' => Carbon::now()->addMinutes(10),
            ]
        );

        // Send OTP email
        Mail::to($request->email)->send(new EmailOtpMail($otp));

        return response()->json(['message' => 'OTP sent successfully!']);
    }

    public function verify_OTP(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|digits:6',
        ]);

        $otpData = EmailOtp::where([
            ['email', '=', $request->email],
            ['otp', '=', $request->otp]
        ])

            ->first();

        if (!$otpData) {
            return response()->json(['message' => 'Invalid OTP'], 400);
        }

        if (Carbon::now()->isAfter($otpData->expires_at)) {
            return response()->json(['message' => 'OTP expired'], 400);
        }

        $otpData->delete();

        return response()->json(['message' => 'OTP verified successfully!'], 200);
    }
}
