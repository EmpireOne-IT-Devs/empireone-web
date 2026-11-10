<?php

namespace App\Http\Middleware;

use App\Services\TeamRequestService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureFinalApprover
{
    public function __construct(private TeamRequestService $service)
    {
    }

    public function handle(Request $request, Closure $next): Response
    {
        abort_unless($request->user() && $this->service->isFinalApprover($request->user()), 403);

        return $next($request);
    }
}
