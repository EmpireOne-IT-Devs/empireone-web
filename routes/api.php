<?php

use App\Http\Controllers\API\Account\AccountDocumentController;
use App\Http\Controllers\API\Account\AccountPersonalInformationController;
use App\Http\Controllers\API\Account\AccountSkillsController;
use App\Http\Controllers\API\Account\AccountWorkingExperienceController;
use App\Http\Controllers\API\Jobs\JobApplicationController;
use App\Http\Controllers\API\Jobs\JobOfferController;
use App\Http\Controllers\API\Jobs\JobPostingController;
use App\Http\Controllers\API\Jobs\JobRequisitionController;
use App\Http\Controllers\API\Jobs\JobRequisitionLogController;
use App\Http\Controllers\Auth\AuthorizationController;
use App\Http\Controllers\Auth\EmailOtpController;
use App\Http\Controllers\Auth\GoogleController;
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



Route::get('auth/google/web', [GoogleController::class, 'webRedirectToGoogle']);
Route::get('auth/google/app', [GoogleController::class, 'appRedirectToGoogle']);
Route::get('auth/google/callback', [GoogleController::class, 'handleGoogleCallback']);



Route::post('job/apply_job_application',  [JobApplicationController::class, 'apply_job_application']);
Route::get('job/postings',  [JobPostingController::class, 'index']);

Route::prefix('')->middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('tickets', TicketingController::class);
    Route::get('my_tickets', [TicketingController::class, 'my_tickets']);
    Route::resource('get_app_data', AppController::class);
    Route::resource('accounts_information', AccountPersonalInformationController::class);

    Route::prefix('job')->group(function () {
        Route::resource('requisitions', JobRequisitionController::class);
        Route::post('approve_job_requisition',  [JobRequisitionController::class, 'approve_job_requisition']);
        Route::resource('requisition_logs', JobRequisitionLogController::class);
        Route::resource('postings', JobPostingController::class)->only(['show', 'store', 'update', 'destroy']);
        Route::resource('application', JobApplicationController::class);
        Route::resource('offers', JobOfferController::class);
        Route::get('get_job_offer_by_user',  [JobOfferController::class, 'get_job_offer_by_user']);
        Route::post('submit_job_offer',  [JobOfferController::class, 'submit_job_offer']);
        Route::get('applicants',  [JobApplicationController::class, 'applicants']);
        Route::get('get_applications_by_user',  [JobApplicationController::class, 'get_applications_by_user']);
        Route::post('update_job_application_status',  [JobApplicationController::class, 'update_job_application_status']);
        Route::post('send_job_offer',  [JobApplicationController::class, 'send_job_offer']);
    });


    Route::prefix('accounts')->group(function () {
        Route::get('user',  [AccountPersonalInformationController::class, 'accounts_user']);
        Route::post('personal_information',  [AccountPersonalInformationController::class, 'accounts_personal_information']);
        Route::post('address_information',  [AccountPersonalInformationController::class, 'accounts_address_information']);
        Route::post('government_information',  [AccountPersonalInformationController::class, 'accounts_government_information']);
        Route::post('emergency_contact_information',  [AccountPersonalInformationController::class, 'accounts_emergency_contact_information']);
        Route::post('educational_information',  [AccountPersonalInformationController::class, 'accounts_educational_information']);
        Route::post('save_signature',  [AccountPersonalInformationController::class, 'accounts_save_signature']);
        Route::resource('work_experience', AccountWorkingExperienceController::class);
        Route::resource('skills', AccountSkillsController::class);
        Route::resource('documents', AccountDocumentController::class);
        Route::post('add_documents',  [AccountDocumentController::class, 'add_documents']);
        Route::get('get_documents_by_user',  [AccountDocumentController::class, 'get_documents_by_user']);
        Route::post('send_documents',  [AccountDocumentController::class, 'send_documents']);
    });
});



Route::resource('departments', DepartmentController::class);
Route::resource('sites', SiteController::class);
Route::get('departments/{department}/users', [DepartmentController::class, 'getDepartmentUsers']);
Route::resource('users', RegisteredUserController::class);
