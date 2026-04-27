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


// admin routes (Role 1)


Route::prefix('accounts')->middleware(['auth', 'verified'])->group(function () {

    Route::prefix('administrator')->middleware(['role.redirect:1'])->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('accounts/dashboard/page');
        });
        Route::get('/job_openings', function () {
            return Inertia::render('accounts/job_openings/page');
        });
        Route::get('/my_applications', function () {
            return Inertia::render('accounts/my_applications/page');
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
        Route::get('/job_offers/{id}', function () {
            return Inertia::render('accounts/job_offers/id/page');
        });
        Route::get('/my_documents', function () {
            return Inertia::render('accounts/my_documents/page');
        });
        Route::get('/settings', function () {
            return Inertia::render('accounts/settings/page');
        });
        Route::get('/users', function () {
            return Inertia::render('accounts/_administrator/users/page');
        });

        Route::prefix('activities')->group(function () {

            Route::get('/', function () {
                return Inertia::render('accounts/_administrator/activities/view/page');
            });
            Route::prefix('manage_content')->group(function () {
                Route::get('/', function () {
                    return Inertia::render('accounts/_administrator/activities/manage_content/page');
                });
                Route::get('/announcement', function () {
                    return Inertia::render('accounts/_administrator/activities/manage_content/announcement/page');
                });
                Route::get('/activities', function () {
                    return Inertia::render('accounts/_administrator/activities/manage_content/activities/page');
                });
                Route::get('/news', function () {
                    return Inertia::render('accounts/_administrator/activities/manage_content/news/page');
                });
                Route::get('/events', function () {
                    return Inertia::render('accounts/_administrator/activities/manage_content/events/page');
                });
            });
        });

        Route::prefix('ticketing')->group(function () {
            Route::get('/', function () {
                return Inertia::render('accounts/_administrator/ticketing/dashboard/page');
            });
            Route::get('/my_tickets', function () {
                return Inertia::render('accounts/_administrator/ticketing/my_tickets/page');
            });
            Route::get('/categories', function () {
                return Inertia::render('accounts/_administrator/ticketing/categories/page');
            });
            Route::get('/tickets', function () {
                return Inertia::render('accounts/_administrator/ticketing/tickets/page');
            });
            Route::get('/reports', function () {
                return Inertia::render('accounts/_administrator/ticketing/reports/page');
            });
        });

        Route::prefix('talent_acquisition')->group(function () {
            Route::get('/dashboard', function () {
                return Inertia::render('accounts/_administrator/talent_acquisition/dashboard/page');
            });
            Route::get('/job_requisition', function () {
                return Inertia::render('accounts/_administrator/talent_acquisition/job_requisition/page');
            });
            Route::get('/job_posting', function () {
                return Inertia::render('accounts/_administrator/talent_acquisition/job_posting/page');
            });
            Route::get('/calendar', function () {
                return Inertia::render('accounts/_administrator/talent_acquisition/calendar/page');
            });
            Route::get('/job_posting/{id}/applicants', function () {
                return Inertia::render('accounts/_administrator/talent_acquisition/job_posting/id/applicants/page');
            });
            Route::get('/job_posting/{id}/job_offers', function () {
                return Inertia::render('accounts/_administrator/talent_acquisition/job_posting/id/job_offers/page');
            });
            Route::get('/job_offers', function () {
                return Inertia::render('accounts/_administrator/talent_acquisition/job_offers/page');
            });
            Route::get('/applicants', function () {
                return Inertia::render('accounts/_administrator/talent_acquisition/applicants/page');
            });
            Route::get('/interviews', function () {
                return Inertia::render('accounts/_administrator/talent_acquisition/interviews/page');
            });
            Route::get('/qr_code', function () {
                return Inertia::render('accounts/_administrator/talent_acquisition/qr_code/page');
            });
        });
        Route::prefix('employee_relation')->group(function () {
            Route::get('employees', function () {
                return Inertia::render('accounts/_administrator/employee_relation/employees/page');
            });
            Route::get('pooling', function () {
                return Inertia::render('accounts/_administrator/employee_relation/pooling/page');
            });
            Route::get('regularization', function () {
                return Inertia::render('accounts/_administrator/employee_relation/regularization/page');
            });
            Route::get('disciplinary_records', function () {
                return Inertia::render('accounts/_administrator/employee_relation/disciplinary_records/page');
            });
            Route::get('separation', function () {
                return Inertia::render('accounts/_administrator/employee_relation/separation/page');
            });

            Route::prefix('{id}')->group(function () {
                Route::get('personal_information', function () {
                    return Inertia::render('accounts/_administrator/employee_relation/employees/id/personal_information/page');
                });
                Route::get('201_files', function () {
                    return Inertia::render('accounts/_administrator/employee_relation/employees/id/201_files/page');
                });
                Route::get('employee_details', function () {
                    return Inertia::render('accounts/_administrator/employee_relation/employees/id/employee_details/page');
                });
                Route::get('contract', function () {
                    return Inertia::render('accounts/_administrator/employee_relation/employees/id/contract/page');
                });
                Route::get('onboarding', function () {
                    return Inertia::render('accounts/_administrator/employee_relation/employees/id/onboarding/page');
                });
            });
        });

        Route::prefix('rnr')->group(function () {
            Route::get('/grand_rewards', function () {
                return Inertia::render('accounts/_administrator/rnr/grand_rewards/page');
            });
            Route::get('/manage_rewards', function () {
                return Inertia::render('accounts/_administrator/rnr/manage_rewards/page');
            });
            Route::get('/leaderboard', function () {
                return Inertia::render('accounts/_administrator/rnr/leaderboard/page');
            });
        });

        Route::prefix('e_store')->group(function () {
            Route::get('/rewards_items', function () {
                return Inertia::render('accounts/_administrator/e_store/rewards_item/page');
            });
            Route::get('/redemption_history', function () {
                return Inertia::render('accounts/_administrator/e_store/redemption_history/page');
            });
            Route::get('/analytics', function () {
                return Inertia::render('accounts/_administrator/e_store/analytics/page');
            });
        });

        Route::prefix('time_keeping')->group(function () {
            Route::get('/dashboard', function () {
                return Inertia::render('accounts/_administrator/time_keeping/dashboard/page');
            });
            Route::get('/attendance', function () {
                return Inertia::render('accounts/_administrator/time_keeping/attendance/page');
            });
            Route::get('/time_sheets', function () {
                return Inertia::render('accounts/_administrator/time_keeping/time_sheets/page');
            });
            Route::get('/reports', function () {
                return Inertia::render('accounts/_administrator/time_keeping/reports/page');
            });
        });

        Route::prefix('finance')->group(function () {
            Route::get('/dashboard', function () {
                return Inertia::render('accounts/_administrator/finance/dashboard/page');
            });
            Route::get('/expenses', function () {
                return Inertia::render('accounts/_administrator/finance/expenses/page');
            });
            Route::get('/revenue', function () {
                return Inertia::render('accounts/_administrator/finance/revenue/page');
            });
            Route::get('/reports', function () {
                return Inertia::render('accounts/_administrator/finance/reports/page');
            });
        });
    });
    // Employee routes (Role 2), 'role.redirect'
    Route::prefix('employee')->middleware(['role.redirect:2'])->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('accounts/dashboard/page');
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

        Route::get('/job_offers/{id}', function () {
            return Inertia::render('accounts/job_offers/id/page');
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
            return Inertia::render('accounts/dashboard/page');
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
        Route::get('/job_offers/{id}', function () {
            return Inertia::render('accounts/job_offers/id/page');
        });
        Route::get('/my_documents', function () {
            return Inertia::render('accounts/my_documents/page');
        });
        Route::get('/settings', function () {
            return Inertia::render('accounts/settings/page');
        });
    });

    Route::get('/my_documents/{id}/contract', function () {
        return Inertia::render('accounts/_administrator/employee_relation/employees/id/contract/page');
    });
    Route::get('/my_documents/{id}/onboarding', function () {
        return Inertia::render('accounts/_administrator/employee_relation/employees/id/onboarding/page');
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
