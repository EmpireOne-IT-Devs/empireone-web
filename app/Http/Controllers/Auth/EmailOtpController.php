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
use Illuminate\Support\Facades\Validator;

class EmailOtpController extends Controller
{
    public function generate_otp(string $email)
    {
        $existingOtp = EmailOtp::where('email', $email)->first();

        // ⛔ Block resend if OTP still valid
        if ($existingOtp && Carbon::now()->lt($existingOtp->expires_at)) {
            return response()->json([
                'message' => 'OTP already sent. Please try again after 10 minutes.'
            ], 429);
        }

        // ✅ Generate secure OTP
        $otp = random_int(100000, 999999);

        EmailOtp::updateOrCreate(
            ['email' => $email],
            [
                'otp' => Hash::make($otp),
                'expires_at' => Carbon::now()->addMinutes(10),
            ]
        );

        Mail::to($email)->queue(new EmailOtpMail($otp));

        return response()->json([
            'message' => 'OTP sent successfully.'
        ], 200);
    }
    public function forgot_password_send_otp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);
        $response = $this->generate_otp($request->email);
        return $response;
    }
    public function forgot_password_verify_otp(Request $request)
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

        return response()->json([
            'message' => 'OTP verified successfully!',
        ], 200);
    }

    public function change_password(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'password' => 'required|min:5|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found.'
            ], 404);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Password changed successfully!'
        ], 200);
    }
    public function job_seeker_sign_up(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }
        $response = $this->generate_otp($request->email);

        return $response;
    }

    public function job_seeker_verify_otp(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email',
            'otp' => 'required|digits:6',
            'password' => 'required',
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

        // Create new user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 2,
            'user_type' => 'job seeker'
        ]);
        return response()->json([
            'message' => 'OTP verified successfully!',
            'user' => $user
        ], 200);
    }
    public function send_OTP(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();
        if ($user) {
            return response()->json(['message' => 'Email already registered'], 400);
        }

        $response = $this->generate_otp($request->email);
        return $response;
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
