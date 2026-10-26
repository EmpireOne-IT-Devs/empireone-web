<?php

namespace App\Providers;

use App\Models\Engagement\EngagementPostEventSurvey;
use App\Models\Engagement\EngagementRewardChallengeTeamSubmission;
use App\Models\Timekeeping\AttendanceCorrection;
use App\Models\Timekeeping\Attendance;
use App\Models\Timekeeping\LeaveRequest;
use App\Models\Timekeeping\OvertimeRequest;
use App\Policies\ChallengeSurveyPolicy;
use App\Policies\Engagement\EngagementRewardChallengeTeamSubmissionPolicy;
use App\Policies\TeamRequestPolicy;
use App\Policies\TimeSheetPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (config('app.env') === 'production') {
            URL::forceRootUrl(config('app.url'));
            URL::forceScheme('https');
        }
        Gate::policy(EngagementPostEventSurvey::class, ChallengeSurveyPolicy::class);
        Gate::policy(EngagementRewardChallengeTeamSubmission::class, EngagementRewardChallengeTeamSubmissionPolicy::class);
        Gate::policy(OvertimeRequest::class, TeamRequestPolicy::class);
        Gate::policy(AttendanceCorrection::class, TeamRequestPolicy::class);
        Gate::policy(LeaveRequest::class, TeamRequestPolicy::class);
        Gate::policy(Attendance::class, TimeSheetPolicy::class);
        Vite::prefetch(concurrency: 3);
        Schema::defaultStringLength(191);
    }
}
