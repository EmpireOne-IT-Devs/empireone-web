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

    // Step 1: Redirect to Google
    public function redirectToGoogle()
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
