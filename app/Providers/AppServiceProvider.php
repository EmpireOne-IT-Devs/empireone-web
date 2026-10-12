<?php

namespace App\Providers;

use App\Models\Engagement\EngagementPostEventSurvey;
use App\Policies\ChallengeSurveyPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

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
        Gate::policy(EngagementPostEventSurvey::class, ChallengeSurveyPolicy::class);
        Vite::prefetch(concurrency: 3);
        Schema::defaultStringLength(191);
    }
}
