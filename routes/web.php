<?php

use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


function route_page()
{
    $user = Auth::user();
    return match ($user?->role) {
        1 => redirect('/accounts/administrator/dashboard'),
        2 => redirect('/accounts/employee/dashboard'),
        3 => redirect('/accounts/applicant/dashboard'),
        default => Inertia::render('auth/login/page'),
    };
}

Route::get('/', function () {
    if (Auth::user()) {
        return route_page();
    }
    return Inertia::render('landing_page/page');
});

Route::get('/auth/forgot_password', function () {
    return Inertia::render('auth/forgot_password/verify/page');
});


Route::get('/auth/login', function () {
    if (Auth::user()) {
        return route_page();
    }
    return Inertia::render('auth/login/page');
})->name('login');

Route::get('/talent/application', function () {
    return Inertia::render('talent/page');
})->name('talent');

Route::get('/dashboard', function () {
    return route_page(); // ✅ remove $this
})->middleware(['auth', 'verified'])->name('dashboard');



Route::prefix('accounts')->middleware(['auth', 'verified'])->group(function () {

    // 1. Map roles to their respective middleware IDs
    $roles = [
        'administrator' => 1,
        'employee'      => 2,
        'applicant'     => 3,
    ];

    // 2. Generate SHARED routes for all roles
    foreach ($roles as $role => $roleId) {
        Route::prefix($role)->middleware(["role.redirect:{$roleId}"])->group(function () use ($role) {
            Route::inertia('/dashboard', 'accounts/dashboard/page');
            Route::inertia('/job_openings', 'accounts/job_openings/page');
            Route::inertia('/my_applications', 'accounts/my_applications/page');
            Route::inertia('/job_offers', 'accounts/job_offers/page');
            Route::inertia('/my_documents', 'accounts/my_documents/page');
            Route::inertia('/settings', 'accounts/settings/page');

            // Shared Dynamic Routes
            Route::get("/performance_evaluation/{user_id}", fn($user_id) => Inertia::render('accounts/performance_evaluation/page'))
                ->name("{$role}.performance_evaluation");
            Route::get('/job_offers/{id}', fn($id) => Inertia::render('accounts/job_offers/id/page'));

            // My Profile Sub-group
            Route::prefix('my_profile')->group(function () {
                Route::inertia('/', 'accounts/my_profile/page');
                Route::inertia('/signature', 'accounts/my_profile/signature/page');
            });

            // Employee and Applicant shared routes
            if (in_array($role, ['employee', 'applicant'])) {
                Route::inertia('/messages', 'accounts/messages/page');
            }
        });
    }

    // 3. ADMINISTRATOR Specific Routes
    Route::prefix('administrator')->middleware(['role.redirect:1'])->group(function () {

        Route::inertia('/users', 'accounts/_administrator/users/page');

        Route::prefix('my_team')->group(function () {
            Route::inertia('', 'accounts/my_team/dashboard/page');
            Route::inertia('/team', 'accounts/my_team/team/page');
            // Route::inertia('/regularization', 'accounts/my_team/regularization/page');
            // Route::inertia('/extended_regularization', 'accounts/my_team/extended_regularization/page');
            // Route::inertia('/none_regularization', 'accounts/my_team/none_regularization/page');
        });

        Route::prefix('activities')->group(function () {
            Route::inertia('/', 'accounts/_administrator/activities/view/page');
            Route::prefix('manage_content')->group(function () {
                Route::inertia('/', 'accounts/_administrator/activities/manage_content/page');
                Route::inertia('/announcement', 'accounts/_administrator/activities/manage_content/announcement/page');
                Route::inertia('/activities', 'accounts/_administrator/activities/manage_content/activities/page');
                Route::inertia('/news', 'accounts/_administrator/activities/manage_content/news/page');
                Route::inertia('/events', 'accounts/_administrator/activities/manage_content/events/page');
            });
        });

        Route::prefix('ticketing')->group(function () {
            Route::inertia('/', 'accounts/_administrator/ticketing/dashboard/page');
            Route::inertia('/my_tickets', 'accounts/_administrator/ticketing/my_tickets/page');
            Route::inertia('/categories', 'accounts/_administrator/ticketing/categories/page');
            Route::inertia('/tickets', 'accounts/_administrator/ticketing/tickets/page');
            Route::inertia('/reports', 'accounts/_administrator/ticketing/reports/page');
        });

        Route::prefix('talent_acquisition')->group(function () {
            Route::inertia('/dashboard', 'accounts/_administrator/talent_acquisition/dashboard/page');
            Route::inertia('/job_requisition', 'accounts/_administrator/talent_acquisition/job_requisition/page');
            Route::inertia('/job_posting', 'accounts/_administrator/talent_acquisition/job_posting/page');
            Route::inertia('/calendar', 'accounts/_administrator/talent_acquisition/calendar/page');
            Route::inertia('/job_offers', 'accounts/_administrator/talent_acquisition/job_offers/page');
            Route::inertia('/applicants', 'accounts/_administrator/talent_acquisition/applicants/page');
            Route::inertia('/interviews', 'accounts/_administrator/talent_acquisition/interviews/page');
            Route::inertia('/qr_code', 'accounts/_administrator/talent_acquisition/qr_code/page');

            // Dynamic Routes
            Route::get('/job_posting/{id}/applicants', fn($id) => Inertia::render('accounts/_administrator/talent_acquisition/job_posting/id/applicants/page'));
            Route::get('/job_posting/{id}/job_offers', fn($id) => Inertia::render('accounts/_administrator/talent_acquisition/job_posting/id/job_offers/page'));
        });

        Route::prefix('employee_relation')->group(function () {
            Route::inertia('employees', 'accounts/_administrator/employee_relation/employees/page');
            Route::inertia('pooling', 'accounts/_administrator/employee_relation/pooling/page');
            Route::inertia('disciplinary_records', 'accounts/_administrator/employee_relation/disciplinary_records/page');
            Route::inertia('separation', 'accounts/_administrator/employee_relation/separation/page');

            Route::prefix('leads')->group(function () {
                Route::inertia('', 'accounts/_administrator/employee_relation/leads/page');
                Route::get('/{id}', fn($id) => Inertia::render('accounts/_administrator/employee_relation/leads/id/page'));
            });

            Route::prefix('assessment_process')->group(function () {
                $assessmentTypes = ['regularization', 'extended_regularization', 'none_regularization'];
                foreach ($assessmentTypes as $type) {
                    Route::prefix($type)->group(function () use ($type) {
                        Route::inertia('', "accounts/_administrator/employee_relation/assessment_process/{$type}/page");
                        Route::get('/{id}', fn($id) => Inertia::render('accounts/_administrator/employee_relation/assessment_process/id/page'));
                    });
                }
            });

            Route::prefix('{id}')->group(function () {
                Route::get('personal_information', fn($id) => Inertia::render('accounts/_administrator/employee_relation/employees/id/personal_information/page'));
                Route::get('evaluations', fn($id) => Inertia::render('accounts/_administrator/employee_relation/employees/id/evaluations/page'));
                Route::get('evaluations/{evaluation_id}', fn($id) => Inertia::render('accounts/_administrator/employee_relation/employees/id/evaluations/id/page'));
                Route::get('201_files', fn($id) => Inertia::render('accounts/_administrator/employee_relation/employees/id/201_files/page'));
                Route::get('employee_details', fn($id) => Inertia::render('accounts/_administrator/employee_relation/employees/id/employee_details/page'));
                Route::get('contract', fn($id) => Inertia::render('accounts/_administrator/employee_relation/employees/id/contract/page'));
                Route::get('onboarding', fn($id) => Inertia::render('accounts/_administrator/employee_relation/employees/id/onboarding/page'));
            });
        });

        // Route::prefix('rnr')->group(function () {
        //     Route::inertia('/grand_rewards', 'accounts/_administrator/rnr/grand_rewards/page');
        //     Route::inertia('/manage_rewards', 'accounts/_administrator/rnr/manage_rewards/page');
        //     Route::inertia('/leaderboard', 'accounts/_administrator/rnr/leaderboard/page');
        // });

        // Route::prefix('e_store')->group(function () {
        //     Route::inertia('/rewards_items', 'accounts/_administrator/e_store/rewards_item/page');
        //     Route::inertia('/redemption_history', 'accounts/_administrator/e_store/redemption_history/page');
        //     Route::inertia('/analytics', 'accounts/_administrator/e_store/analytics/page');
        // });

        // Route::prefix('time_keeping')->group(function () {
        //     Route::inertia('/dashboard', 'accounts/_administrator/time_keeping/dashboard/page');
        //     Route::inertia('/attendance', 'accounts/_administrator/time_keeping/attendance/page');
        //     Route::inertia('/time_sheets', 'accounts/_administrator/time_keeping/time_sheets/page');
        //     Route::inertia('/reports', 'accounts/_administrator/time_keeping/reports/page');
        // });

        // Route::prefix('finance')->group(function () {
        //     Route::inertia('/dashboard', 'accounts/_administrator/finance/dashboard/page');
        //     Route::inertia('/expenses', 'accounts/_administrator/finance/expenses/page');
        //     Route::inertia('/revenue', 'accounts/_administrator/finance/revenue/page');
        //     Route::inertia('/reports', 'accounts/_administrator/finance/reports/page');
        // });
    });

    // 4. EMPLOYEE Specific Routes
    Route::prefix('employee')->middleware(['role.redirect:2'])->group(function () {
        Route::inertia('/activities', 'accounts/_employee/activities/page');
        Route::inertia('/hr_services', 'accounts/_employee/hr_services/page');
        Route::inertia('/rnr', 'accounts/_employee/rnr/page');
        Route::inertia('/rewards_store', 'accounts/_employee/rewards_store/page');
        Route::inertia('/loan', 'accounts/_employee/loan/page');
        Route::inertia('/payroll', 'accounts/_employee/payroll/page');
    });

    // Note: APPLICANT doesn't currently have specific unique routes beyond the shared ones above. 
    // If you add them later, put them in a `Route::prefix('applicant')->middleware(['role.redirect:3'])` block here.

    // 5. GLOBAL "Accounts" level routes
    Route::get('/my_documents/{id}/contract', fn($id) => Inertia::render('accounts/_administrator/employee_relation/employees/id/contract/page'));
    Route::get('/my_documents/{id}/onboarding', fn($id) => Inertia::render('accounts/_administrator/employee_relation/employees/id/onboarding/page'));
    Route::inertia('/my_profile/signature', 'accounts/my_profile/signature/page');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
