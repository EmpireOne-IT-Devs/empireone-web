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

        // 2. Applicants (role 3) don't have an account_employee record — skip check
        if ($user->role === 3) {
            return $next($request);
        }

        $info = $user->account_employee;
        $info2 = $user->personal_information;

        $accountType = ($user->role == 1) ? 'administrator' : 'employee';
        $dashboardUrl = "/accounts/{$accountType}/dashboard";

        $requiredFields1 = [
            'first_name',
            'last_name',
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

        // 3. List of required database columns
        $requiredFields2 = [
            'employee_id',
            'started_at',
            'position_level',
            'e_r_leader_id',
            'position',
            'eogs_email',
            'status',
            'signature',
            'department_id',
            'department_manager_id',
        ];

        // 4. Verify completion for Admins (1) and Employees (2)
        if ($user->role == 2 || $user->role == 1) {

            // STEP 1: Check personal_information fields first (Redirects to setup1)
            foreach ($requiredFields1 as $field) {
                if (!$info2 || blank($info2->{$field})) {
                    // Allow access if already on setup1, otherwise redirect
                    if ($request->is("accounts/{$accountType}/setup1")) {
                        return $next($request);
                    }
                    return redirect("/accounts/{$accountType}/setup1");
                }
            }

            // STEP 2: Check account_employee fields next
            foreach ($requiredFields2 as $field) {
                if (!$info || blank($info->{$field})) {
                    if ($field === 'signature') {
                        // Allow access if already on the signature page
                        if ($request->is("accounts/{$accountType}/my_profile/signature")) {
                            return $next($request);
                        }
                        return redirect("/accounts/{$accountType}/my_profile/signature");
                    }

                    // Allow access if already on setup2
                    if ($request->is("accounts/{$accountType}/setup2")) {
                        return $next($request);
                    }
                    return redirect("/accounts/{$accountType}/setup2");
                }
            }

            // STEP 3: If everything IS complete, prevent them from accessing setup or signature pages
            if (
                $request->is('accounts/*/setup*') ||
                $request->is('accounts/*/my_profile/signature')
            ) {
                return redirect($dashboardUrl);
            }
        }

        // 5. Allow standard request flow
        return $next($request);
    }
}
