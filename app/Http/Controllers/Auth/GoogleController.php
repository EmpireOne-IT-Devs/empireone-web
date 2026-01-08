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
    public function appRedirectToGoogle(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        $idToken = $request->token;

        try {
            // Verify the token with Google
            $client = new Google_Client(['client_id' => env('GOOGLE_CLIENT_ID')]); // set in .env
            $payload = $client->verifyIdToken($idToken);

            if (!$payload) {
                return response()->json(['error' => 'Invalid Google token'], 401);
            }

            // Token is valid, create or update user
            $user = User::updateOrCreate(
                ['email' => $payload['email']],
                [
                    'google_id' => $payload['sub'],
                    'name' => $payload['name'] ?? $payload['email'],
                ]
            );

            // Create API token for Flutter app
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $user = User::updateOrCreate(
                ['email' => $googleUser->getEmail()],
                [
                    'google_id' => $googleUser->getId(),
                    'name' => $googleUser->getName(),
                ]
            );

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
