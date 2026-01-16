<?php

use App\Http\Controllers\Auth\AuthorizationController;
use App\Http\Controllers\Auth\EmailOtpController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\API\Ticketing\TicketingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



Route::post('auth/login', [AuthorizationController::class, 'login']);
Route::post('auth/google/app', [GoogleController::class, 'googleLogin']);
Route::post('auth/send_otp', [EmailOtpController::class, 'send_OTP']);
Route::post('auth/verify_otp', [EmailOtpController::class, 'verify_OTP']);


Route::get('auth/google/web', [GoogleController::class, 'webRedirectToGoogle']);
Route::get('auth/google/app', [GoogleController::class, 'appRedirectToGoogle']);
Route::get('auth/google/callback', [GoogleController::class, 'handleGoogleCallback']);


// Route::prefix('')->middleware(['auth', 'verified'])->group(function () {
//     Route::apiResource('tickets', TicketingController::class);
// });

Route::apiResource('tickets', TicketingController::class);
