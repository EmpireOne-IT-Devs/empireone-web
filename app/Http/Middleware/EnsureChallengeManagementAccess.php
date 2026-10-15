<?php

namespace App\Http\Middleware;

use App\Models\Account\AccountEmployee;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureChallengeManagementAccess
{
    private const ALLOWED_DEPARTMENT_IDS = [1, 11];

    public function handle(Request $request, Closure $next): Response
    {
        $departmentId = AccountEmployee::query()
            ->where('user_id', $request->user()->id)
            ->value('department_id');

        abort_unless(
            in_array((int) $departmentId, self::ALLOWED_DEPARTMENT_IDS, true),
            403,
        );

        return $next($request);
    }
}
