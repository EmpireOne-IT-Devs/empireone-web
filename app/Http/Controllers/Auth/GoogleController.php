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
        $url = Socialite::driver('google')->redirect()->getTargetUrl();
        return response()->json([
            'url' => $url
        ]);
    }

    public function handleGoogleCallback()
    {
        // $googleUser = Socialite::driver('google')->user();

        // $user = User::updateOrCreate(
        //     [
        //         'email' => $googleUser->getEmail(),
        //     ],
        //     [
        //         'google_id' => $googleUser->getId(),
        //         'name' => $googleUser->getName(),
        //     ]
        // );

        // $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            // 'user' => $user,
            // 'token' => $token,
            'token_type' => 'Bearer',
        ]);
    }
}
