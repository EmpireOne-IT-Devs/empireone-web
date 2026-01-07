<?php

use App\Http\Controllers\Auth\AuthorizationController;
use App\Http\Controllers\Auth\GoogleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



Route::post('/auth/login', [AuthorizationController::class, 'login']);
Route::post('auth/google/app', [GoogleController::class, 'googleLogin']);
