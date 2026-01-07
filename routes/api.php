<?php

use App\Http\Controllers\Auth\AuthorizationController;
use App\Http\Controllers\Auth\EmailOtpController;
use App\Http\Controllers\Auth\GoogleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



Route::post('auth/login', [AuthorizationController::class, 'login']);
Route::post('auth/google/app', [GoogleController::class, 'googleLogin']);
Route::post('/send-otp', [EmailOtpController::class, 'send_OTP']);
Route::post('/verify-otp', [EmailOtpController::class, 'verify_OTP']);
