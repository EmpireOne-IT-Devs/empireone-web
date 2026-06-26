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

        // 3. If the record doesn't exist at all, redirect them
        if (!$info) {
            return redirect()->route('dashboard');
        }

        // 4. List of required database columns
        $requiredFields = [
            'employee_id',
            'started_at',
            'position_level',
            'e_r_leader_id',
            'account_id',
            'position',
            'eogs_email',
            'basic_pay',
            'status'
        ];

        // 5. Check if required fields are filled for Admins (1) and Employees (2)
        if ($user->role == 2 || $user->role == 1) {
            foreach ($requiredFields as $field) {
                if (blank($info->{$field})) {
                    
                    // Determine the URL segment based on role
                    $accountType = ($user->role == 1) ? 'administrator' : 'employee';
                    
                    // Redirect with the query string
                    return redirect("/accounts/{$accountType}/my_profile/employee?error_message=Please complete your employee profile.");
                }
            }
        }

        // 6. If everything is filled out, let the request proceed
        return $next($request);
    }
}