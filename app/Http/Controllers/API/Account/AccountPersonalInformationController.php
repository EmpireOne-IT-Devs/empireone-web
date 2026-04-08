<?php

namespace App\Http\Controllers\API\Account;

use App\Http\Controllers\Controller;
use App\Models\Account\AccountDocument;
use App\Models\Account\AccountEmployee;
use App\Models\Account\AccountPersonalInformation;
use App\Models\Account\AccountWorkingExperience;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AccountPersonalInformationController extends Controller
{

    public function accounts_merge_account(Request $request)
    {

        // High limit is okay for local, but consider chunking for production
        set_time_limit(30000);

        foreach ($request->items ?? [] as $value) {
            if (!empty($value['app_id'])) {
                $api = AccountPersonalInformation::where('app_id', $value['app_id'])->first();
                if ($api && !empty($value['source'])) {

                    
                    AccountEmployee::updateOrCreate(
                        [
                            'user_id' => $api->user_id,
                        ],
                        [
                            'source'     => $value['source'] ?? null,
                        ]
                    );
                }
            }
        }

        return response()->json(['message' => 'Accounts processed successfully'], 200);
    }
    public function get_user_by_id($id)
    {

        $users = User::where('id', $id)->with(['department', 'personal_information', 'documents', 'skills', 'working_experience', 'account_employee', 'is_passed', 'salary', 'account_contract'])->first();
        return response()->json([
            'data' => $users,
            'status'  => 'success',
        ], 200);
    }
    public function accounts_user()
    {

        $auth = User::where('id', Auth::id())->with(['department', 'personal_information', 'documents', 'skills', 'working_experience', 'account_employee'])->first();
        $requiredFields = collect([
            'first_name',
            'middle_name',
            'last_name',
            'gender',
            'date_of_birth',
            'birth_place',
            'region',
            'province',
            'city',
            'barangay',
            'street',
            'zip_code',
            'highest_level_of_education',
            'contact'
        ]);
        $percent = '0%';
        $info = $auth->personal_information;

        // 2. Only calculate if personal_information actually exists
        if ($info) {
            // Use the collection's filter method to count how many fields are NOT empty
            $filledCount = $requiredFields->filter(function ($field) use ($info) {
                return !empty($info->{$field});
            })->count();
            // Calculate percentage
            $percent = round(($filledCount / $requiredFields->count()) * 100) . '%';
        }
        return response()->json([
            'status'  => 'success',
            'message' => 'Personal Show successfully.',
            'data'    => array_merge($auth->toArray(), [
                'percent' => $percent
            ])
        ], 200);
    }

    public function accounts_save_signature(Request $request)
    {
        $request->validate([
            'signature' => 'required|string',
        ]);
        AccountEmployee::updateOrCreate(
            ['user_id' => Auth::id()], // unique identifier
            [
                'signature' => $request->signature, // save Base64 directly
            ]
        );
        return response()->json([
            'status'  => 'success',
            'message' => 'Signature created successfully.',
        ], 200);
    }

    public function accounts_educational_information(Request $request)
    {
        $auth = Auth::user();
        $validated = $request->validate([
            'highest_level_of_education'   => 'nullable|string|max:255',
            'school_name' => 'nullable|string|max:255',
            'year_graduated'     => 'nullable|string|max:255',
            'awards' => 'nullable|string|max:255',
            'status' => 'nullable|string|max:255',
            'degree' => 'nullable|string|max:255',
        ]);
        AccountPersonalInformation::updateOrCreate(
            ['user_id' => $auth->id],
            array_merge(['user_id' => $auth->id], $validated)
        );


        return response()->json([
            'status'  => 'success',
            'message' => 'Personal Show successfully.',
            'data'    => $auth
        ], 200);
    }

    public function accounts_emergency_contact_information(Request $request)
    {
        $auth = Auth::user();

        $validated = $request->validate([
            'contact_name'   => 'nullable|string|max:255',
            'contact_address' => 'nullable|string|max:255',
            'contact_relationship'     => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:255',
        ]);

        // 2️⃣ Update or create account information
        $account = AccountPersonalInformation::updateOrCreate(
            ['user_id' => $auth->id],
            array_merge(['user_id' => $auth->id], $validated)
        );

        return response()->json([
            'status'  => 'success',
            'message' => 'Personal information saved successfully.',
            'data'    => $account
        ], 200);
    }

    public function accounts_personal_information(Request $request)
    {
        $auth = Auth::user();

        // 1️⃣ Validate request (throws automatic JSON response on failure in API)
        $validated = $request->validate([
            'first_name'   => 'nullable|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name'     => 'nullable|string|max:255',
            'suffix' => 'nullable|string|max:255',
            'gender'   => 'nullable|string|max:255',
            'date_of_birth' => 'nullable|string|max:255',
            'nationality'  => 'nullable|string|max:255',
            'birth_place'  => 'nullable|string|max:255',
            'marital_status'  => 'nullable|string|max:255',
            'contact'  => 'nullable|string|max:255',
        ]);

        // 2️⃣ Update or create account information
        $account = AccountPersonalInformation::updateOrCreate(
            ['user_id' => $auth->id],
            array_merge(['user_id' => $auth->id], $validated)
        );

        return response()->json([
            'status'  => 'success',
            'message' => 'Personal information saved successfully.',
            'data'    => $account
        ], 200);
    }

    public function accounts_address_information(Request $request)
    {
        $auth = Auth::user();

        // 1️⃣ Validate request (throws automatic JSON response on failure in API)
        $validated = $request->validate([
            'region'   => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'city'     => 'nullable|string|max:255',
            'barangay' => 'nullable|string|max:255',
            'street'   => 'nullable|string|max:255',
            'zip_code' => 'nullable|string|max:20',
            'village'  => 'nullable|string|max:255',
        ]);

        // 2️⃣ Update or create account information
        $account = AccountPersonalInformation::updateOrCreate(
            ['user_id' => $auth->id],
            array_merge(['user_id' => $auth->id], $validated)
        );

        return response()->json([
            'status'  => 'success',
            'message' => 'Address information saved successfully.',
            'data'    => $account
        ], 200);
    }

    public function accounts_government_information(Request $request)
    {
        $auth = Auth::user();

        // 1️⃣ Validate request (throws automatic JSON response on failure in API)
        $validated = $request->validate([
            'government_type'   => 'nullable|string|max:255',
            'id_number' => 'nullable|string|max:255',
            'sss'     => 'nullable|string|max:255',
            'tin' => 'nullable|string|max:255',
            'philhealth'   => 'nullable|string|max:255',
            'pagibig' => 'nullable|string|max:255',
        ]);

        // 2️⃣ Update or create account information
        $account = AccountPersonalInformation::updateOrCreate(
            ['user_id' => $auth->id],
            array_merge(['user_id' => $auth->id], $validated)
        );

        return response()->json([
            'status'  => 'success',
            'message' => 'Government information saved successfully.',
            'data'    => $account
        ], 200);
    }
}
