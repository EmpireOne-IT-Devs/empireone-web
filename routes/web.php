<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


Route::prefix('administrator')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('administrator/dashboard/page');
    });
    Route::get('/users', function () {
        return Inertia::render('administrator/users/page');
    });
    Route::prefix('activities')->group(function () {
        Route::get('/manage_content', function () {
            return Inertia::render('administrator/activities/manage_content/page');
        });
        Route::get('/view', function () {
            return Inertia::render('administrator/activities/view/page');
        });
         Route::get('/announcement', function () {
            return Inertia::render('administrator/activities/manage_content/announcement/page');
        });
        Route::get('/activities', function () {
            return Inertia::render('administrator/activities/manage_content/activities/page');
        });
         Route::get('/news', function () {
            return Inertia::render('administrator/activities/manage_content/news/page');
        });
        Route::get('/events', function () {
            return Inertia::render('administrator/activities/manage_content/events/page');
        });
    });

    Route::prefix('ticketing')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('administrator/ticketing/dashboard/page');
        });
        Route::get('/my_tickets', function () {
            return Inertia::render('administrator/ticketing/my_tickets/page');
        });
        Route::get('/sites_categories', function () {
            return Inertia::render('administrator/ticketing/sites_categories/page');
        });
        Route::get('/tickets', function () {
            return Inertia::render('administrator/ticketing/tickets/page');
        });
        Route::get('/reports', function () {
            return Inertia::render('administrator/ticketing/reports/page');
        });
    });
    Route::prefix('job_posting')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('administrator/job_posting/dashboard/page');
        });
        Route::get('/active_posting', function () {
            return Inertia::render('administrator/job_posting/active_posting/page');
        });
        Route::get('/applicants', function () {
            return Inertia::render('administrator/job_posting/applicants/page');
        });
        Route::get('/interviews', function () {
            return Inertia::render('administrator/job_posting/interviews/page');
        });
    });
    Route::prefix('hr_central')->group(function () {
        Route::get('/overview', function () {
            return Inertia::render('administrator/hr_central/overview/page');
        });
        Route::get('/learning_management', function () {
            return Inertia::render('administrator/hr_central/learning_management/page');
        });
        Route::get('/payroll', function () {
            return Inertia::render('administrator/hr_central/payroll/page');
        });
        Route::get('/performance', function () {
            return Inertia::render('administrator/hr_central/performance/page');
        });
        Route::get('/onboarding', function () {
            return Inertia::render('administrator/hr_central/onboarding/page');
        });
        Route::get('/recruitment', function () {
            return Inertia::render('administrator/hr_central/recruitment/page');
        });
    });
    Route::prefix('rnr')->group(function () {
        Route::get('/grand_rewards', function () {
            return Inertia::render('administrator/rnr/grand_rewards/page');
        });
        Route::get('/manage_rewards', function () {
            return Inertia::render('administrator/rnr/manage_rewards/page');
        });
        Route::get('/leaderboard', function () {
            return Inertia::render('administrator/rnr/leaderboard/page');
        });
    });
    Route::prefix('store_admin')->group(function () {
        Route::get('/rewards_item', function () {
            return Inertia::render('administrator/store_admin/rewards_item/page');
        });
        Route::get('/redemption_history', function () {
            return Inertia::render('administrator/store_admin/redemption_history/page');
        });
        Route::get('/leaderboard', function () {
            return Inertia::render('administrator/store_admin/leaderboard/page');
        });
    });
    Route::prefix('decoration')->group(function () {
        Route::get('/avatar_decorations', function () {
            return Inertia::render('administrator/decoration/avatar_decorations/page');
        });
        Route::get('/profile_effects', function () {
            return Inertia::render('administrator/decoration/profile_effects/page');
        });
    });
    Route::prefix('time_keeping')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('administrator/time_keeping/dashboard/page');
        });
        Route::get('/attendance', function () {
            return Inertia::render('administrator/time_keeping/attendance/page');
        });
        Route::get('/time_sheets', function () {
            return Inertia::render('administrator/time_keeping/time_sheets/page');
        });
        Route::get('/reports', function () {
            return Inertia::render('administrator/time_keeping/reports/page');
        });
    });
    Route::prefix('finance')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('administrator/finance/dashboard/page');
        });
        Route::get('/expenses', function () {
            return Inertia::render('administrator/finance/expenses/page');
        });
        Route::get('/revenue', function () {
            return Inertia::render('administrator/finance/revenue/page');
        });
        Route::get('/reports', function () {
            return Inertia::render('administrator/finance/reports/page');
        });
    });
    Route::get('/reports', function () {
        return Inertia::render('administrator/reports/page');
    });
    Route::get('/analytics', function () {
        return Inertia::render('administrator/analytics/page');
    });
    Route::get('/messages', function () {
        return Inertia::render('administrator/messages/page');
    });
    Route::get('/settings', function () {
        return Inertia::render('administrator/settings/page');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
