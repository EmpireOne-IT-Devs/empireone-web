<?php
namespace App\Http\Controllers\API\Account;

use App\Http\Controllers\Controller;
use App\Models\Account\AccountPersonalInformation;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class AccountPersonalInformationController extends Controller
{
    public function accounts_personal_information(Request $request)
    {
        $auth = Auth::user();

        // 1️⃣ Validate request (throws automatic JSON response on failure in API)
        $validated = $request->validate([
            'first_name'   => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name'     => 'required|string|max:255',
            'suffix' => 'nullable|string|max:255',
            'gender'   => 'required|string|max:255',
            'date_of_birth' => 'required|string|max:255',
            'nationality'  => 'nullable|string|max:255',
            'birth_place'  => 'nullable|string|max:255',
            'marital_status'  => 'nullable|string|max:255',
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
            'region'   => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'city'     => 'required|string|max:255',
            'barangay' => 'required|string|max:255',
            'street'   => 'required|string|max:255',
            'zip_code' => 'required|string|max:20',
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
            'government_type'   => 'required|string|max:255',
            'id_number' => 'required|string|max:255',
            'sss'     => 'required|string|max:255',
            'tin' => 'required|string|max:255',
            'philhealth'   => 'required|string|max:255',
            'pagibig' => 'required|string|max:255',
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
