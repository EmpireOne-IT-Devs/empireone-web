<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class RedirectByRole
{
    public function handle(Request $request, Closure $next, $role)
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('login');
        }
        if ((int) $user->role === User::ROLE_ADMIN
            && (int) $role === User::ROLE_EMPLOYEE
            && $request->is('accounts/employee/rnr/challenge_event')) {
            $query = $request->getQueryString();

            return redirect('/accounts/administrator/rnr/challenges_events/join'.($query ? '?'.$query : ''));
        }
        if ($user->role != $role) {
            return redirect()->back()->with('error', 'You are not authorized to access this page.');
        }

        return $next($request);
    }
}
