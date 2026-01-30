<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();
        $userRole = $user->role;

        // Convert string roles to integers if needed
        $allowedRoles = array_map(function($role) {
            return is_numeric($role) ? (int)$role : $role;
        }, $roles);

        if (!in_array($userRole, $allowedRoles)) {
            // Redirect to user's appropriate dashboard
            return redirect($user->getDashboardRoute())->with('error', 'Unauthorized access to this section.');
        }

        return $next($request);
    }
}
