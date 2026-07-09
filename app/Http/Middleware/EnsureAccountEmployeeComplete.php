<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAccountEmployeeComplete
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        // 1. Check if user is logged in
        if (!$user) {
            return redirect()->route('login');
        }

        // 🔥 INFINITE LOOP PREVENTION
        // If the user is ALREADY on a setup page or the signature page, let them through immediately!
        // The asterisk (*) is a wildcard that matches 'administrator' or 'employee' and 'setup1' or 'setup2'
        if ($request->is('accounts/*/setup*') || $request->is('accounts/*/my_profile/signature')) {
            return $next($request);
        }

        // 2. Applicants (role 3) don't have an account_employee record — skip check
        if ($user->role === 3) {
            return $next($request);
        }

        $info = $user->account_employee;
        $info2 = $user->personal_information;

        $accountType = ($user->role == 1) ? 'administrator' : 'employee';

        // 3. If EITHER record doesn't exist at all, start them at step 1
        // if (!$info || !$info2) {
        //     return redirect("/accounts/{$accountType}/setup1");
        // }

        $requiredFields1 = [
            'first_name',
            'last_name',
            'gender',
            'date_of_birth',
            'year_graduated',
            'contact',
            'region',
            'province',
            'city',
            'barangay',
            'street',
            'zip_code',
            'degree',
            'school_name',
            'course',
        ];

        // 4. List of required database columns
        $requiredFields2 = [
            'employee_id',
            'started_at',
            'position_level',
            'e_r_leader_id',
            'position',
            'eogs_email',
            'basic_pay',
            'status',
            'signature'
        ];



        // 5. Check if required fields are filled for Admins (1) and Employees (2)
        if ($user->role == 2 || $user->role == 1) {

            // STEP 1: Check personal_information fields first (Redirects to setup1)
            foreach ($requiredFields1 as $field) {
                if (blank($info2->{$field})) {
                    return redirect("/accounts/{$accountType}/setup1");
                }
            }

            // STEP 2: Check account_employee fields next (Redirects to setup2)
            foreach ($requiredFields2 as $field) {
                if (blank($info->{$field})) {
                    if ($field == 'signature') {
                        // If they only missed the signature, send them specifically there
                        return redirect("/accounts/{$accountType}/my_profile/signature");
                    }
                    return redirect("/accounts/{$accountType}/setup2");
                }
            }
        }

        // 6. If everything is filled out, let the request proceed normally
        return $next($request);
    }
}
