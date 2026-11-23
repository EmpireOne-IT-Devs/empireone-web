<?php

namespace App\Providers;

use App\Models\AssetInventory\AssetDevice;
use App\Models\AssetInventory\AssetItemRequest;
use App\Models\AssetInventory\AssetLiabilityForm;
use App\Models\AssetInventory\AssetMonitor;
use App\Models\AssetInventory\AssetOtherAsset;
use App\Models\AssetInventory\AssetPart;
use App\Models\AssetInventory\AssetPeripheral;
use App\Models\AssetInventory\AssetPurchaseRequest;
use App\Models\AssetInventory\AssetSystemUnit;
use App\Models\COERequest;
use App\Models\Engagement\EngagementEStoreRedemption;
use App\Models\Engagement\EngagementPostEventSurvey;
use App\Models\Engagement\EngagementRewardChallengeTeamSubmission;
use App\Models\Timekeeping\AttendanceCorrection;
use App\Models\Timekeeping\Attendance;
use App\Models\Timekeeping\LeaveRequest;
use App\Models\Timekeeping\OvertimeRequest;
use App\Policies\AssetDevicePolicy;
use App\Policies\AssetItemRequestPolicy;
use App\Policies\AssetLiabilityFormPolicy;
use App\Policies\AssetMonitorPolicy;
use App\Policies\AssetOtherAssetPolicy;
use App\Policies\AssetPartPolicy;
use App\Policies\AssetPeripheralPolicy;
use App\Policies\AssetPurchaseRequestPolicy;
use App\Policies\AssetSystemUnitPolicy;
use App\Policies\ChallengeSurveyPolicy;
use App\Policies\COERequestPolicy;
use App\Policies\Engagement\EngagementEStoreRedemptionPolicy;
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
        Gate::policy(AssetDevice::class, AssetDevicePolicy::class);
        Gate::policy(AssetItemRequest::class, AssetItemRequestPolicy::class);
        Gate::policy(AssetLiabilityForm::class, AssetLiabilityFormPolicy::class);
        Gate::policy(AssetMonitor::class, AssetMonitorPolicy::class);
        Gate::policy(AssetOtherAsset::class, AssetOtherAssetPolicy::class);
        Gate::policy(AssetPart::class, AssetPartPolicy::class);
        Gate::policy(AssetPeripheral::class, AssetPeripheralPolicy::class);
        Gate::policy(AssetPurchaseRequest::class, AssetPurchaseRequestPolicy::class);
        Gate::policy(AssetSystemUnit::class, AssetSystemUnitPolicy::class);
        Gate::policy(COERequest::class, COERequestPolicy::class);
        Gate::policy(EngagementEStoreRedemption::class, EngagementEStoreRedemptionPolicy::class);
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
