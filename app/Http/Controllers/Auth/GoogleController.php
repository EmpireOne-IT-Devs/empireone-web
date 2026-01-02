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
    public function googleLogin(Request $request)
    {
        $idToken = $request->token;
        $client = new Google_Client(['client_id' => env('GOOGLE_CLIENT_ID')]);

        // Verify the token with Google
        $payload = $client->verifyIdToken($idToken);

        if ($payload) {
            $user = User::updateOrCreate([
                'email' => $payload['email'],
            ], [
                'name' => $payload['name'],
                'google_id' => $payload['sub'], // 'sub' is the unique Google ID
                'password' => null,
            ]);

            // Create a Sanctum token for the mobile app
            $token = $user->createToken('mobile-app')->plainTextToken;

            return response()->json([
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]);
        } else {
            return response()->json(['error' => 'Invalid Token'], 401);
        }
    }
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            // Find or Create the user
            $user = User::updateOrCreate([
                'email' => $googleUser->email,
            ], [
                'name' => $googleUser->name,
                'google_id' => $googleUser->id,
                'password' => null, // No password needed for social login
            ]);
            $token = $user->createToken('auth_token')->plainTextToken;
            Auth::login($user);
            return response()->json([
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
            ], 500);
        }
    }
}
