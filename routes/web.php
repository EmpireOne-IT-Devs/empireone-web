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
        1 => redirect('/administrator/dashboard'),
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


// admin routes (Role 1)
Route::prefix('administrator')->middleware(['auth', 'verified', 'role.redirect:1'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('administrator/dashboard/page');
    });
    Route::get('/users', function () {
        return Inertia::render('administrator/users/page');
    });
    Route::prefix('activities')->group(function () {
        Route::prefix('manage_content')->group(function () {
            Route::get('/', function () {
                return Inertia::render('administrator/activities/manage_content/page');
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

        Route::get('/view', function () {
            return Inertia::render('administrator/activities/view/page');
        });
    });

    Route::prefix('ticketing')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('administrator/ticketing/dashboard/page');
        });
        Route::get('/my_tickets', function () {
            return Inertia::render('administrator/ticketing/my_tickets/page');
        });
        Route::get('/categories', function () {
            return Inertia::render('administrator/ticketing/categories/page');
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
        Route::get('/active_posting/{id}', function () {
            return Inertia::render('administrator/job_posting/active_posting/id/page');
        });
        Route::get('/job_offers', function () {
            return Inertia::render('administrator/job_posting/job_offers/page');
        });
        Route::get('/applicants', function () {
            return Inertia::render('administrator/job_posting/applicants/page');
        });
        Route::get('/interviews', function () {
            return Inertia::render('administrator/job_posting/interviews/page');
        });
    });
    Route::get('/job_requisition', function () {
        return Inertia::render('administrator/job_requisition/page');
    });

    Route::prefix('employee_relation')->group(function () {
        Route::get('employees', function () {
            return Inertia::render('administrator/employee_relation/employees/page');
        });
        Route::get('pooling', function () {
            return Inertia::render('administrator/employee_relation/pooling/page');
        });

        Route::prefix('{id}')->group(function () {
            Route::get('personal_information', function () {
                return Inertia::render('administrator/employee_relation/employees/id/personal_information/page');
            });
            Route::get('employee_details', function () {
                return Inertia::render('administrator/employee_relation/employees/id/employee_details/page');
            });
            Route::get('contract', function () {
                return Inertia::render('administrator/employee_relation/employees/id/contract/page');
            });
            Route::get('onboarding', function () {
                return Inertia::render('administrator/employee_relation/employees/id/onboarding/page');
            });
        });
    });

    Route::get('/job_requisition/{id}', function () {
        return Inertia::render('administrator/job_requisition/id/page');
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
        // Route::get('/onboarding', function () {
        //     return Inertia::render('administrator/hr_central/onboarding/page');
        // });
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

Route::prefix('accounts')->middleware(['auth', 'verified'])->group(function () {
    // Employee routes (Role 2), 'role.redirect'
    Route::prefix('employee')->middleware(['role.redirect:2'])->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('accounts/_employee/dashboard/page');
        });
        Route::get('/job_openings', function () {
            return Inertia::render('accounts/job_openings/page');
        });
        Route::get('/my_applications', function () {
            return Inertia::render('accounts/my_applications/page');
        });
        Route::get('/messages', function () {
            return Inertia::render('accounts/messages/page');
        });
        Route::prefix('my_profile')->group(function () {
            Route::get('/', function () {
                return Inertia::render('accounts/my_profile/page');
            });
            Route::get('/signature', function () {
                return Inertia::render('accounts/my_profile/signature/page');
            });
        });
        Route::get('/job_offers', function () {
            return Inertia::render('accounts/job_offers/page');
        });
        Route::get('/my_documents', function () {
            return Inertia::render('accounts/my_documents/page');
        });
        Route::get('/settings', function () {
            return Inertia::render('accounts/settings/page');
        });


        Route::get('/activities', function () {
            return Inertia::render('accounts/_employee/activities/page');
        });

        Route::get('/hr_services', function () {
            return Inertia::render('accounts/_employee/hr_services/page');
        });
        Route::get('/rnr', function () {
            return Inertia::render('accounts/_employee/rnr/page');
        });

        Route::get('rewards_store', function () {
            return Inertia::render('accounts/_employee/rewards_store/page');
        });

        Route::get('loan', function () {
            return Inertia::render('accounts/_employee/loan/page');
        });
        Route::get('payroll', function () {
            return Inertia::render('accounts/_employee/payroll/page');
        });
    });
    // Employee routes (Role 3)
    Route::prefix('applicant')->middleware(['role.redirect:3'])->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('accounts/_employee/dashboard/page');
        });
        Route::get('/job_openings', function () {
            return Inertia::render('accounts/job_openings/page');
        });
        Route::get('/my_applications', function () {
            return Inertia::render('accounts/my_applications/page');
        });
        Route::get('/messages', function () {
            return Inertia::render('accounts/messages/page');
        });
        Route::prefix('my_profile')->group(function () {
            Route::get('/', function () {
                return Inertia::render('accounts/my_profile/page');
            });
            Route::get('/signature', function () {
                return Inertia::render('accounts/my_profile/signature/page');
            });
        });
        Route::get('/job_offers', function () {
            return Inertia::render('accounts/job_offers/page');
        });
        Route::get('/my_documents', function () {
            return Inertia::render('accounts/my_documents/page');
        });
        Route::get('/settings', function () {
            return Inertia::render('accounts/settings/page');
        });
    });

    Route::get('/my_documents/{id}/contract', function () {
        return Inertia::render('administrator/employee_relation/employees/id/contract/page');
    });
    Route::get('/my_documents/{id}/onboarding', function () {
        return Inertia::render('administrator/employee_relation/employees/id/onboarding/page');
    });
    Route::get('/my_profile/signature', function () {
        return Inertia::render('accounts/my_profile/signature/page');
    });
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
