<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectByRole
{
    public function handle(Request $request, Closure $next, $role)
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('login');
        }
        if ($user->role != $role) {
            return redirect()->back()->with('error', 'You are not authorized to access this page.');
        }

        return $next($request);
    }
}
