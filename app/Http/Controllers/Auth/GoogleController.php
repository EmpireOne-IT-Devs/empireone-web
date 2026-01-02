<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Exception;
use Illuminate\Http\Request;
use Google_Client;

class GoogleController extends Controller
{
    // API/Mobile Flow: Verifying an ID Token from a mobile device
    public function googleLogin(Request $request)
    {
        $idToken = $request->token;
        // Best practice: Use the env helper or config
        $client = new Google_Client(['client_id' => config('services.google.client_id')]);

        $payload = $client->verifyIdToken($idToken);

        if ($payload) {
            $user = User::updateOrCreate([
                'email' => $payload['email'],
            ], [
                'name' => $payload['name'],
                'google_id' => $payload['sub'],
                'password' => null,
            ]);

            $token = $user->createToken('mobile-app')->plainTextToken;

            return response()->json([
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]);
        }

        return response()->json(['error' => 'Invalid Token'], 401);
    }

    // Web Flow: Redirecting to Google
    public function redirectToGoogle()
    {
        // Socialite will now use the 'redirect' key from config/services.php
        return Socialite::driver('google')->redirect();
    }

    // Web Flow: Handling the Callback from Google
    public function handleGoogleCallback()
    {
        try {
            // Added stateless() to avoid session/CSRF issues during OAuth if using as API
            $googleUser = Socialite::driver('google')->user();

            $user = User::updateOrCreate([
                'email' => $googleUser->email,
            ], [
                'name' => $googleUser->name,
                'google_id' => $googleUser->id,
                'password' => null,
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;
            
            Auth::login($user);

            return response()->json([
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Internal Server Error',
                'debug' => $e->getMessage(), // Remove debug in production
                'status' => 'error',
            ], 500);
        }
    }
}