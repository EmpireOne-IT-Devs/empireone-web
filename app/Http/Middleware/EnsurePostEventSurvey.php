<?php

namespace App\Http\Middleware;

use App\Models\Engagement\EngagementPostEventSurvey;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePostEventSurvey
{
    public function handle(Request $request, Closure $next, string $access = 'event'): Response
    {
        $survey = EngagementPostEventSurvey::findOrFail($request->route('id'));

        if ($survey->reward_challenge_id !== null) {
            abort_unless(
                $access === 'view' && $request->isMethod('GET'),
                404,
                'Challenge surveys are only accessible through read-only review.',
            );
        }

        return $next($request);
    }
}
