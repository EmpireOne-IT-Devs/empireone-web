<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Exception;
use Illuminate\Http\Request;
use Google_Client;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Hash;

class GoogleController extends Controller
{

    public function route_page($role)
    {
        return match ($role) {
            1 => redirect('/administrator/dashboard'),
            2 => redirect('/accounts/employee/dashboard'),
            3 => redirect('/accounts/applicant/dashboard'),
            default => redirect('/auth/login?error_message=Email is not registered!'),
        };
    }

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

        try {
            // Call Google UserInfo API
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $request->token,
            ])->get('https://www.googleapis.com/oauth2/v3/userinfo');

            if ($response->failed()) {
                return response()->json(['error' => 'Invalid Google access token'], 401);
            }

            $googleUser = $response->json();

            $user = User::updateOrCreate(
                ['email' => $googleUser['email']],
                [
                    'google_id' => $googleUser['sub'],
                    'name' => $googleUser['name'] ?? $googleUser['email'],
                    'avatar' => $googleUser['picture'] ?? null,
                ]
            );

            // Laravel Sanctum token
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
            $googleUser = Socialite::driver('google')->user();

            $user = User::where('email', $googleUser['email'])->first();

            if ($user) {
                $user->update(
                    [
                        'google_id' => $googleUser['sub'],
                        'name' => $googleUser['name'] ?? $googleUser['email'],
                        'avatar' => $googleUser['picture'] ?? null,
                    ]
                );
                Auth::login($user, true);
            }
            return $this->route_page($user->role ?? 0);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
