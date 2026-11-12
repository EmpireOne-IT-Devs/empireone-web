<?php

namespace App\Http\Middleware;

use App\Models\Account\AccountEmployee;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureChallengeManagementAccess
{
    private const ALLOWED_DEPARTMENT_IDS = [1, 11];

    public function handle(Request $request, Closure $next, string $access = 'department'): Response
    {
        $user = $request->user();

        if ($access === 'administrator') {
            if ((int) $user->role === 1) {
                return $next($request);
            }

            abort_unless((int) $user->role === 2, 403);
        }

        $departmentId = AccountEmployee::query()
            ->where('user_id', $user->id)
            ->value('department_id');

        if ($access === 'administrator'
            && ! in_array((int) $departmentId, self::ALLOWED_DEPARTMENT_IDS, true)) {
            $query = $request->getQueryString();

            return redirect()->to(
                '/accounts/employee/rnr/challenge_event'.($query ? '?'.$query : ''),
            );
        }

        abort_unless(in_array((int) $departmentId, self::ALLOWED_DEPARTMENT_IDS, true), 403);

        return $next($request);
    }
}
