<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Exception;
use Illuminate\Http\Request;
use Google_Client;
use Illuminate\Support\Facades\Hash;

class GoogleController extends Controller
{
    public function webRedirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    // Step 1: Redirect to Google
    public function appRedirectToGoogle()
    {
        $url = Socialite::driver('google')->stateless()->redirect()->getTargetUrl();
        return response()->json([
            'url' => $url
        ]);
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            // Find or create the user
            $user = User::updateOrCreate(
                ['email' => $googleUser->email],
                [
                    'name' => $googleUser->name,
                    'google_id' => $googleUser->id,
                ]
            );

            // Create Sanctum token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Internal Server Error',
                'status' => 'error',
                // 'debug' => $e->getMessage() // comment out in production
            ], 500);
        }
    }
}
