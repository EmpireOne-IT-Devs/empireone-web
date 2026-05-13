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

Route::get('/talent/application', function () {
    return Inertia::render('talent/page');
})->name('talent');



Route::get('/dashboard', function () {
    return route_page(); // ✅ remove $this
})->middleware(['auth', 'verified'])->name('dashboard');

Route::prefix('accounts')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/talent/{job_interview_id}/ai_interview', function () {
        return Inertia::render('accounts/ai_interview/page');
    });
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

            // Shared Dynamic Routes (Inertia automatically passes route parameters as props)
            Route::inertia("/performance_evaluation/{user_id}", 'accounts/performance_evaluation/page')
                ->name("{$role}.performance_evaluation");
            Route::inertia('/job_offers/{id}', 'accounts/job_offers/id/page');

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

    // --- Reusable Route Groups ---
    // Extracting duplicate routes for employee details used in 'my_team' and 'human_resources'
    $employeeDetailsRoutes = function () {
        Route::inertia('personal_information', 'accounts/_administrator/human_resources/employees/id/personal_information/page');
        Route::inertia('evaluations', 'accounts/_administrator/human_resources/employees/id/evaluations/page');
        Route::inertia('evaluations/{evaluation_id}', 'accounts/_administrator/human_resources/employees/id/evaluations/id/page');
        Route::inertia('201_files', 'accounts/_administrator/human_resources/employees/id/201_files/page');
        Route::inertia('employee_details', 'accounts/_administrator/human_resources/employees/id/employee_details/page');
        Route::inertia('contract', 'accounts/_administrator/human_resources/employees/id/contract/page');
        Route::inertia('onboarding', 'accounts/_administrator/human_resources/employees/id/onboarding/page');
    };

    // 3. ADMINISTRATOR Specific Routes
    Route::prefix('administrator')->middleware(['role.redirect:1'])->group(function () use ($employeeDetailsRoutes) {

        Route::inertia('/users', 'accounts/_administrator/users/page');

        Route::prefix('my_team')->group(function () use ($employeeDetailsRoutes) {
            Route::inertia('', 'accounts/my_team/dashboard/page');
            Route::inertia('/team', 'accounts/my_team/team/page');
            Route::inertia('/assessment_process', 'accounts/my_team/assessment_process/page');
            Route::inertia('/employee_status_changes', 'accounts/my_team/employee_status_changes/page');
            Route::prefix('{id}')->group($employeeDetailsRoutes); // Applied Reusable Group

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
            Route::inertia('/ai_interviews', 'accounts/_administrator/talent_acquisition/ai_interviews/page');
            Route::inertia('/job_posting/{id}/applicants', 'accounts/_administrator/talent_acquisition/job_posting/id/page');
        });

        Route::prefix('human_resources')->group(function () use ($employeeDetailsRoutes) {
            Route::inertia('employees', 'accounts/_administrator/human_resources/employees/page');
            Route::inertia('pooling', 'accounts/_administrator/human_resources/pooling/page');
            Route::inertia('disciplinary_records', 'accounts/_administrator/human_resources/disciplinary_records/page');
            Route::inertia('separation', 'accounts/_administrator/human_resources/separation/page');

            Route::prefix('leads')->group(function () {
                Route::inertia('', 'accounts/_administrator/human_resources/leads/page');
                Route::inertia('/{id}', 'accounts/_administrator/human_resources/leads/id/page');
            });
            Route::prefix('employee_movements')->group(function () {
                // Route::prefix('assessment_process')->group(function () {
                //     $assessmentTypes = ['mid_regularization', 'regularization', 'extended_regularization', 'none_regularization'];
                //     foreach ($assessmentTypes as $type) {
                //         Route::prefix($type)->group(function () use ($type) {
                //             Route::inertia('', "accounts/_administrator/human_resources/employee_movements/assessment_process/{$type}/page");
                //             Route::inertia('/{id}', 'accounts/_administrator/human_resources/employee_movements/assessment_process/id/page');
                //         });
                //     }
                // });

                Route::inertia('/assessment_process', "accounts/_administrator/human_resources/employee_movements/assessment_process/page");
                Route::inertia('/assessment_process/promotions', "accounts/_administrator/human_resources/employee_movements/assessment_process/promotions/page");
                Route::inertia('/assessment_process/transfers', "accounts/_administrator/human_resources/employee_movements/assessment_process/transfers/page");
                Route::inertia('/employee_status_changes', "accounts/_administrator/human_resources/employee_movements/employee_status_changes/page");
                // Route::inertia('/position_and_title', "accounts/_administrator/human_resources/employee_movements/position_and_title/page");
                // Route::inertia('/tiering', "accounts/_administrator/human_resources/employee_movements/tiering/page");
            });

            Route::prefix('{id}')->group($employeeDetailsRoutes); // Applied Reusable Group
        });

        // Route::prefix('rnr')->group(function () { ... });
        // Route::prefix('e_store')->group(function () { ... });
        // Route::prefix('time_keeping')->group(function () { ... });
        // Route::prefix('finance')->group(function () { ... });
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

    // 5. GLOBAL "Accounts" level routes
    Route::prefix('my_documents/{id}')->group(function () {
        Route::inertia('/contract', 'accounts/_administrator/human_resources/employees/id/contract/page');
        Route::inertia('/onboarding', 'accounts/_administrator/human_resources/employees/id/onboarding/page');
        // Route::inertia('/employee_change_form', 'accounts/my_documents/employee_change_form/page');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
