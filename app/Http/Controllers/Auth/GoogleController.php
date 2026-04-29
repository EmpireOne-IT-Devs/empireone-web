<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Account\AccountEmployee;
use App\Models\Account\AccountPersonalInformation;
use App\Models\Location;
use App\Models\Site;
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

    public function get_employee()
    {
        $filename = public_path("csv/active_employees.csv");
        $employees = [];

        if (!file_exists($filename)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        if (($handle = fopen($filename, "r")) !== FALSE) {
            $raw_headers = fgetcsv($handle, 0, ",");

            $clean_headers = array_map(function ($header, $index) {
                $header = mb_convert_encoding(trim($header), 'UTF-8', 'ISO-8859-1');
                if ($index === 0) {
                    $header = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $header);
                }
                return strtolower(str_replace(' ', '_', $header));
            }, $raw_headers, array_keys($raw_headers));

            $header_count = count($clean_headers);

            while (($data = fgetcsv($handle, 0, ",")) !== FALSE) {
                if (count($data) === $header_count) {
                    $utf8_data = array_map(function ($value) {
                        return mb_convert_encoding($value, 'UTF-8', 'ISO-8859-1');
                    }, $data);

                    $row = array_combine($clean_headers, $utf8_data);
                    $employees[] = (object) $row; // Saving as OBJECT
                }
            }
            fclose($handle);
        }

        // Initialize an array to track emails that were skipped
        $existing_emails = [];
        $inserted_emails = [];

        foreach ($employees as $value) {
            if (!empty($value->email)) {
                $has_user = User::where('email', $value->email)->first();

                if (!$has_user) {
                    // INSERTION LOGIC
                    $user = User::create([
                        'name' => $value->firstname . " " . $value->lastname,
                        'email' => $value->email,
                        'password' => bcrypt('Business12'),
                        'role' => 2,
                    ]);

                    $location = Location::where('name', $value->site)->first();

                    if ($location) {
                        $site = Site::where('location_id', $location->id)->first();

                        $dateHired = \Carbon\Carbon::parse($value->datehired);
                        $isRegular = $dateHired->diffInMonths(now()) >= 6;

                        AccountEmployee::create([
                            'user_id'     => $user->id,
                            'employee_id' => $value->employee_id, 
                            'eogs_email'  => $value->email,
                            'site_id'     => $site ? $site->id : null,
                            'location_id' => $location->id,
                            'started_at'  => $value->datehired,
                            'position'    => $value->position,
                            'status'      => $isRegular ? 'Regular' : 'Probationary'
                        ]);
                    }

                    AccountPersonalInformation::create([
                        'user_id' => $user->id,
                        'first_name' => $value->firstname,
                        'last_name' => $value->lastname,
                        'date_of_birth' => $value->birthdate,
                        'contact' => $value->mobileno,
                        'philhealth' => $value->philhealth,
                        'sss' => $value->sss,
                        'pagibig' => $value->pagibig,
                        'tin' => $value->tin,
                    ]);

                    $inserted_emails[] = $value->email;
                }
            } else {
                // Collect the emails that were already in the DB
                $existing_emails[] = $value->firstname;
            }
        }

        return response()->json([
            'message' => 'Processing complete',
            'total' => count($employees),
            'new_inserts_count' => count($inserted_emails),
            'already_existed_count' => count($inserted_emails),
            'skipped_emails_count' => count($existing_emails),
            'skipped_emails' => $existing_emails,
        ]);
    }

    public function route_page($role)
    {
        return match ($role) {
            1 => redirect('/accounts/administrator/dashboard'),
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
