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

// Route::get('/talent/application', function () {
//     return Inertia::render('talent/page');
// })->name('talent');


Route::prefix('/talent/application')->group(function () {
    Route::get('', function () {
        return Inertia::render('talent/location');
    })->name('talent');
    Route::get('/notification', function () {
        return Inertia::render('talent/notification');
    })->name('notification');
    Route::get('/{job_posting_id}', function () {
        return Inertia::render('talent/page');
    });
});


Route::get('/dashboard', function () {
    return route_page(); // ✅ remove $this
})->middleware(['auth'])->name('dashboard');

Route::prefix('accounts')->middleware(['auth', 'info.complete'])->group(function () {
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
            Route::inertia('/job_offers', 'accounts/job_offers/page');;
            Route::prefix('/my_documents')->group(function () {
                Route::inertia('/', 'accounts/my_documents/page');
                Route::inertia('/acknowledgements', 'accounts/my_documents/acknowledgements/page');
            });
            if ($role == 'administrator') {
                Route::inertia('/my_requisition', 'accounts/my_requisition/page');
            }
            Route::inertia('/settings', 'accounts/settings/page');

            // Shared Dynamic Routes (Inertia automatically passes route parameters as props)
            Route::inertia("/performance_evaluation/{user_id}", 'accounts/performance_evaluation/page')
                ->name("{$role}.performance_evaluation");
            Route::inertia('/job_offers/{id}', 'accounts/job_offers/id/page');

            Route::prefix('')->group(function () {
                Route::get('/setup1', function () {
                    return Inertia::render('accounts/setup/setup1/page');
                });
                Route::get('/setup2', function () {
                    return Inertia::render('accounts/setup/setup2/page');
                });
            })->withoutMiddleware(['info.complete']);
            // My Profile Sub-group
            Route::prefix('my_profile')->group(function () {
                Route::inertia('/employee', 'accounts/my_profile/page');
                Route::inertia('/personal', 'accounts/my_profile/page');
                Route::inertia('/professional', 'accounts/my_profile/page');
                Route::inertia('/documents', 'accounts/my_profile/page');
                Route::inertia('/emergency', 'accounts/my_profile/page');
                Route::inertia('/customization', 'accounts/my_profile/page');
                Route::inertia('/signature', 'accounts/my_profile/signature/page')->withoutMiddleware(['info.complete']);
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
            Route::redirect('/', '/accounts/administrator/activities/home');
            Route::inertia('/home', 'accounts/_administrator/activities/home/page');
            Route::inertia('/company_newsfeed', 'accounts/_administrator/activities/company_newsfeed/page');
            Route::inertia('/events_calendar', 'accounts/_administrator/activities/events_calendar/page');
            Route::inertia('/department_showcase', 'accounts/_administrator/activities/department_showcase/page');
            Route::inertia('/poll_analytics', 'accounts/_administrator/activities/poll_analytics/page');
            Route::inertia('/poll_analytics/{id}', 'accounts/_administrator/activities/poll_analytics/id/page');

            Route::inertia('/post_event_survey', 'accounts/_administrator/activities/post_event_survey/page');
            Route::inertia('/post_event_survey/{id}', 'accounts/_administrator/activities/post_event_survey/id/page');
            Route::inertia('/company_gallery', 'accounts/_administrator/activities/company_gallery/page');
        });
        Route::prefix('asset_inventory')->group(function () {
            Route::redirect('/', '/accounts/administrator/asset_inventory/dashboard');
            Route::inertia('/dashboard', 'accounts/_administrator/asset_inventory/dashboard/page');
            Route::inertia('/purchase_request', 'accounts/_administrator/asset_inventory/purchase_request/page');
            Route::inertia('/item_request', 'accounts/_administrator/asset_inventory/item_request/page');
            Route::inertia('/liability_form', 'accounts/_administrator/asset_inventory/liability_form/page');
            Route::inertia('/devices', 'accounts/_administrator/asset_inventory/devices/page');
            Route::inertia('/system_unit', 'accounts/_administrator/asset_inventory/system_unit/page');
            Route::inertia('/monitors', 'accounts/_administrator/asset_inventory/monitors/page');
            Route::inertia('/peripherals', 'accounts/_administrator/asset_inventory/peripherals/page');
            Route::inertia('/parts_and_accessories', 'accounts/_administrator/asset_inventory/parts_and_accessories/page');
            Route::inertia('/other_assets', 'accounts/_administrator/asset_inventory/other_assets/page');
            Route::inertia('/device_return', 'accounts/_administrator/asset_inventory/device_return/page');
            // Report
            Route::inertia('/report',                'accounts/_administrator/asset_inventory/report/page');
        });
        Route::prefix('e_store')->group(function () {
            Route::redirect('/', '/accounts/administrator/e_store/rewards_items');
            Route::inertia('/rewards_items', 'accounts/_administrator/e_store/rewards_item/page');
            Route::inertia('/redemption_history', 'accounts/_administrator/e_store/redemption_history/page');
            Route::inertia('/analytics', 'accounts/_administrator/e_store/analytics/page');
        });
        Route::prefix('rnr')->group(function () {
            Route::redirect('/', '/accounts/administrator/rnr/grand_rewards');
            Route::inertia('/grand_rewards', 'accounts/_administrator/rnr/grand_rewards/page');
            Route::inertia('/manage_rewards', 'accounts/_administrator/rnr/manage_rewards/page');
            Route::inertia('/leaderboard', 'accounts/_administrator/rnr/leaderboard/page');
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
            Route::inertia('/erp', 'accounts/_administrator/talent_acquisition/erp/page');
            Route::inertia('/qr_code', 'accounts/_administrator/talent_acquisition/qr_code/page');
            Route::inertia('/ai_interviews', 'accounts/_administrator/talent_acquisition/ai_interviews/page');
            Route::inertia('/job_posting/{id}/applicants', 'accounts/_administrator/talent_acquisition/job_posting/id/page');
        });

        Route::prefix('human_resources')->group(function () use ($employeeDetailsRoutes) {
            Route::inertia('employees', 'accounts/_administrator/human_resources/employees/page');
            Route::inertia('pooling', 'accounts/_administrator/human_resources/pooling/page');
            Route::inertia('disciplinary_records', 'accounts/_administrator/human_resources/disciplinary_records/page');
            Route::inertia('separation', 'accounts/_administrator/human_resources/separation/page');
            Route::inertia('acknowledgements', 'accounts/_administrator/human_resources/acknowledgements/page');

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

        Route::prefix('time_keeping')->group(function () {
            Route::redirect('/', '/accounts/administrator/time_keeping/dashboard');
            Route::inertia('/dashboard', 'accounts/_administrator/time_keeping/dashboard/page');
            Route::inertia('/attendance', 'accounts/_administrator/time_keeping/attendance/page');
            Route::inertia('/time_sheets', 'accounts/_administrator/time_keeping/time_sheets/page');
            Route::inertia('/reports', 'accounts/_administrator/time_keeping/reports/page');
            Route::inertia('/attendance_settings', 'accounts/_administrator/time_keeping/attendance_settings/page');
        });

        // Route::prefix('rnr')->group(function () { ... });
        // Route::prefix('e_store')->group(function () { ... });
        // Route::prefix('time_keeping')->group(function () { ... });
        // Route::prefix('finance')->group(function () { ... });
    });

    // 4. EMPLOYEE Specific Routes
    Route::prefix('employee')->middleware(['role.redirect:2'])->group(function () {
        Route::redirect('/activities', '/accounts/employee/activities/home');
        Route::inertia('/activities/home', 'accounts/_employee/activities/home/page');
        Route::inertia('/activities/company_newsfeed', 'accounts/_employee/activities/company_newsfeed/page');
        Route::inertia('/activities/events_calendar', 'accounts/_employee/activities/events_calendar/page');
        Route::inertia('/activities/department_showcase', 'accounts/_employee/activities/department_showcase/page');
        Route::inertia('/activities/post_event_survey', 'accounts/_employee/activities/post_event_survey/page');
        Route::inertia('/activities/post_event_survey/{id}', 'accounts/_employee/activities/post_event_survey/id/page');
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
        Route::inertia('/employee_change_form', 'accounts/my_documents/employee_change_form/page');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
