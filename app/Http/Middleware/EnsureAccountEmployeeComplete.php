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
        if ($user->role == 2 || $user->role == 1) {
            foreach ($requiredFields as $field) {
                if (blank($info->{$field})) {
                    return redirect('/accounts/administrator/my_profile/employee?error_message=Please complete your employee profile.');
                }
            }
        }
        // If everything is filled out, let the request proceed
        return $next($request);
    }
}
