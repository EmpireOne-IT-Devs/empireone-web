<?php

use App\Http\Controllers\API\Account\AccountAccessController;
use App\Http\Controllers\API\Account\AccountContractController;
use App\Http\Controllers\API\Account\AccountDocumentController;
use App\Http\Controllers\API\Account\AccountEmployeeController;
use App\Http\Controllers\API\Account\AccountPersonalInformationController;
use App\Http\Controllers\API\Account\AccountSkillsController;
use App\Http\Controllers\API\Account\AccountWorkingExperienceController;
use App\Http\Controllers\API\ER\EREmployeeChangeFormController;
use App\Http\Controllers\API\ER\ERLeaderController;
use App\Http\Controllers\API\ER\ERPerformanceEvaluationFormController;
use App\Http\Controllers\API\ER\ERSubordinateController;
use App\Http\Controllers\API\Jobs\JobAIInterviewController;
use App\Http\Controllers\API\Jobs\JobApplicantScheduleController;
use App\Http\Controllers\API\Jobs\JobApplicationController;
use App\Http\Controllers\API\Jobs\JobOfferController;
use App\Http\Controllers\API\Jobs\JobPostingController;
use App\Http\Controllers\API\Jobs\JobRequisitionController;
use App\Http\Controllers\API\Jobs\JobRequisitionLogController;
use App\Http\Controllers\API\Jobs\JobInterviewerScheduleController;
use App\Http\Controllers\Auth\AuthorizationController;
use App\Http\Controllers\Auth\EmailOtpController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\API\Activities\ActivityBirthdayController;
use App\Http\Controllers\API\Activities\ActivityPollController;
use App\Http\Controllers\API\Activities\ActivityPostController;
use App\Http\Controllers\API\Activities\ActivityPostInteractionController;
use App\Http\Controllers\API\Activities\PostEventSurveyController;
use App\Http\Controllers\API\Engagement\EngagementPostEventController;
use App\Http\Controllers\API\Ticketing\TicketingController;
use App\Http\Controllers\AppController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\SiteController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::middleware('auth:sanctum')->post('auth/logout', [AuthorizationController::class, 'logout']);
Route::post('auth/login', [AuthorizationController::class, 'login']);
Route::post('auth/send_otp', [EmailOtpController::class, 'send_OTP']);
Route::post('auth/verify_otp', [EmailOtpController::class, 'verify_OTP']);
Route::post('auth/job_seeker_sign_up', [EmailOtpController::class, 'job_seeker_sign_up']);
Route::post('auth/job_seeker_verify_otp', [EmailOtpController::class, 'job_seeker_verify_otp']);
Route::post('auth/forgot_password_send_otp', [EmailOtpController::class, 'forgot_password_send_otp']);
Route::post('auth/forgot_password_verify_otp', [EmailOtpController::class, 'forgot_password_verify_otp']);
Route::post('auth/change_password', [EmailOtpController::class, 'change_password']);



Route::get('auth/google/app', [GoogleController::class, 'appRedirectToGoogle']);
Route::middleware('web')->group(function () {
    Route::get('auth/google/web', [GoogleController::class, 'webRedirectToGoogle']);
    Route::get('auth/google/callback', [GoogleController::class, 'handleGoogleCallback']);
});

Route::post('job/apply_job_application',  [JobApplicationController::class, 'apply_job_application']);
Route::get('job/employee_applicants',  [JobApplicationController::class, 'employee_applicants']);
Route::post('job/get_job_application_from_email',  [JobApplicationController::class, 'get_job_application_from_email']);
Route::get('job/postings',  [JobPostingController::class, 'index']);
Route::resource('job/job_interviewer_schedules', JobInterviewerScheduleController::class);
Route::get('merge_account',  [AccountPersonalInformationController::class, 'accounts_merge_account']);

Route::get('get_employee', [GoogleController::class, 'get_employee']); // do not remove this
Route::get('merge_data', [GoogleController::class, 'merge_data']); // do not remove this
Route::get('employee_assessment_notifications', [AppController::class, 'employee_assessment_notifications']); // do not remove this
Route::get('get_all_email', [GoogleController::class, 'get_all_email']); // do not remove this
// Route::get('assigned_leads', [GoogleController::class, 'assigned_leads']); // do not remove this


Route::prefix('')->middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('tickets', TicketingController::class);
    Route::get('my_tickets', [TicketingController::class, 'my_tickets']);
    Route::resource('get_app_data', AppController::class);
    Route::resource('accounts_information', AccountPersonalInformationController::class);

    Route::post('/interviews/start', [JobAIInterviewController::class, 'start']);
    Route::post('/interviews/{id}/submitAnswer', [JobAIInterviewController::class, 'submitAnswer']);
    Route::get('/get_job_interview_by_id/{id}', [JobAIInterviewController::class, 'get_job_interview_by_id']);

    Route::prefix('job')->group(function () {
        Route::resource('requisitions', JobRequisitionController::class);
        Route::get('get_job_requisitions_by_user',  [JobRequisitionController::class, 'get_job_requisitions_by_user']);
        Route::post('approve_job_requisition',  [JobRequisitionController::class, 'approve_job_requisition']);
        Route::resource('requisition_logs', JobRequisitionLogController::class);
        Route::resource('postings', JobPostingController::class)->only(['show', 'store', 'update', 'destroy']);
        Route::get('dashboard_stats', [JobPostingController::class, 'dashboard_stats']);
        Route::get('recent_activity', [JobPostingController::class, 'recent_activity']);
        Route::get('top_performing_jobs', [JobPostingController::class, 'top_performing_jobs']);
        Route::resource('application', JobApplicationController::class);
        Route::resource('offers', JobOfferController::class);
        Route::resource('job_interview', JobAIInterviewController::class);
        Route::get('get_job_offers_by_job_posting/{id}',  [JobOfferController::class, 'get_job_offers_by_job_posting']);

        Route::resource('job_applicant_schedules', JobApplicantScheduleController::class);
        Route::resource('account_access', AccountAccessController::class);
        Route::get('get_job_offer_by_user',  [JobOfferController::class, 'get_job_offer_by_user']);
        Route::post('submit_job_offer',  [JobOfferController::class, 'submit_job_offer']);
        Route::post('transfer_job_offer',  [JobOfferController::class, 'transfer_job_offer']);
        Route::get('applicants',  [JobApplicationController::class, 'applicants']);
        Route::get('export_applicant_csv',  [JobApplicationController::class, 'export_applicant_csv']);
        
        Route::get('get_applicant_pooling',  [JobApplicationController::class, 'get_applicant_pooling']);
        Route::get('get_job_application_by_user',  [JobApplicationController::class, 'get_job_application_by_user']);
        Route::post('application_failed_notification',  [JobApplicationController::class, 'application_failed_notification']);

        Route::get('get_applications_by_user',  [JobApplicationController::class, 'get_applications_by_user']);
        Route::post('update_job_application_status',  [JobApplicationController::class, 'update_job_application_status']);
        Route::post('send_job_offer',  [JobApplicationController::class, 'send_job_offer']);
    });


    Route::prefix('accounts')->group(function () {
        Route::resource('employees',  AccountEmployeeController::class);
        Route::get('get_all_employees',  [AccountEmployeeController::class, 'get_all_employees']);
        Route::post('add_employee',  [AccountEmployeeController::class, 'add_employee']);
        Route::get('get_regular',  [AccountEmployeeController::class, 'get_regular']);
        Route::get('user',  [AccountPersonalInformationController::class, 'accounts_user']);
        Route::post('personal_information',  [AccountPersonalInformationController::class, 'accounts_personal_information']);
        Route::post('address_information',  [AccountPersonalInformationController::class, 'accounts_address_information']);
        Route::post('government_information',  [AccountPersonalInformationController::class, 'accounts_government_information']);
        Route::post('emergency_contact_information',  [AccountPersonalInformationController::class, 'accounts_emergency_contact_information']);
        Route::post('educational_information',  [AccountPersonalInformationController::class, 'accounts_educational_information']);
        Route::post('save_signature',  [AccountPersonalInformationController::class, 'accounts_save_signature']);
        Route::post('upload_avatar',  [AccountPersonalInformationController::class, 'upload_avatar']);
        Route::get('get_user_by_id/{user_id}',  [AccountPersonalInformationController::class, 'get_user_by_id']);
        Route::resource('contract', AccountContractController::class);
        Route::post('agree_onboarding',  [AccountContractController::class, 'agree_onboarding']);
        Route::post('edit_information',  [AccountContractController::class, 'edit_information']);
        Route::resource('work_experience', AccountWorkingExperienceController::class);
        Route::resource('skills', AccountSkillsController::class);
        Route::resource('documents', AccountDocumentController::class);
        Route::post('add_documents',  [AccountDocumentController::class, 'add_documents']);
        Route::post('re_upload_documents',  [AccountDocumentController::class, 're_upload_documents']);
        Route::get('get_documents_by_user',  [AccountDocumentController::class, 'get_documents_by_user']);
        Route::post('send_documents',  [AccountDocumentController::class, 'send_documents']);
        Route::get('get_201_files_by_user/{user_id}',  [AccountDocumentController::class, 'get_201_files_by_user']);
    });


    Route::prefix('engagement')->group(function () {
        Route::resource('post_events', EngagementPostEventController::class);
    });
    
    Route::prefix('er')->group(function () {
        Route::resource('leaders', ERLeaderController::class);
        Route::resource('subordinates', ERSubordinateController::class);
        Route::resource('performance_evaluation', ERPerformanceEvaluationFormController::class);
        Route::resource('employee_change_form', EREmployeeChangeFormController::class);
        Route::post('accept_employee_change_form',  [EREmployeeChangeFormController::class, 'accept_employee_change_form']);
        Route::get('performance_evaluation_by_user_id/{user_id}',  [ERPerformanceEvaluationFormController::class, 'performance_evaluation_by_user_id']);
    });


    Route::prefix('activities')->group(function () {
        Route::get('upcoming_birthdays', [ActivityBirthdayController::class, 'upcoming_birthdays']);
        Route::get('posts',              [ActivityPostController::class,    'index']);
        Route::post('posts',             [ActivityPostController::class,    'store']);
        Route::put('posts/{activityPost}',    [ActivityPostController::class, 'update']);
        Route::delete('posts/{activityPost}', [ActivityPostController::class, 'destroy']);

        Route::post('posts/{id}/react',                      [ActivityPostInteractionController::class, 'toggle_reaction']);
        Route::get('posts/{id}/comments',                    [ActivityPostInteractionController::class, 'get_comments']);
        Route::post('posts/{id}/comments',                   [ActivityPostInteractionController::class, 'add_comment']);
        Route::delete('posts/{id}/comments/{commentId}',     [ActivityPostInteractionController::class, 'delete_comment']);
        Route::get('upcoming_events',    [ActivityPostController::class,    'upcoming_events']);
        Route::get('polls/analytics/dashboard', [ActivityPollController::class, 'dashboard']);
        Route::get('polls/analytics', [ActivityPollController::class, 'index']);
        Route::get('polls/{id}/vote-records/export', [ActivityPollController::class, 'export_vote_records']);
        Route::get('polls/{id}/vote-records', [ActivityPollController::class, 'vote_records']);
        Route::get('polls/{id}', [ActivityPollController::class, 'show']);
        Route::post('polls/{id}/close', [ActivityPollController::class, 'close_poll']);
        Route::post('polls/{id}/reopen', [ActivityPollController::class, 'reopen_poll']);
        Route::post('polls/{id}/vote', [ActivityPollController::class, 'vote']);

        // post event surveys
        Route::get('surveys',                    [PostEventSurveyController::class, 'index']);
        Route::post('surveys',                   [PostEventSurveyController::class, 'store']);
        Route::get('surveys/{id}',               [PostEventSurveyController::class, 'show']);
        Route::post('surveys/{id}/submit',       [PostEventSurveyController::class, 'submit']);
        Route::get('surveys/{id}/responses',     [PostEventSurveyController::class, 'responses']);
        Route::get('surveys/{id}/analytics',     [PostEventSurveyController::class, 'analytics']);
        Route::post('surveys/{id}/close',        [PostEventSurveyController::class, 'close']);
        Route::post('surveys/{id}/reopen',       [PostEventSurveyController::class, 'reopen']);
        Route::delete('surveys/{id}',            [PostEventSurveyController::class, 'destroy']);
    });
});



Route::resource('departments', DepartmentController::class);
Route::resource('sites', SiteController::class);
Route::get('departments/{department}/users', [DepartmentController::class, 'getDepartmentUsers']);
Route::resource('users', RegisteredUserController::class);
