<?php

use App\Http\Controllers\Auth\AuthorizationController;
use App\Http\Controllers\Auth\EmailOtpController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\API\Ticketing\TicketingController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\JobPostingController;
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


// Route::prefix('')->middleware(['auth', 'verified'])->group(function () {
//     Route::apiResource('tickets', TicketingController::class);
// });

Route::apiResource('tickets', TicketingController::class);
Route::resource('job-postings', JobPostingController::class);
Route::resource('departments', DepartmentController::class);
