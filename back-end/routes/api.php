<?php

use Illuminate\Http\Request;
use App\Http\Middleware\isHR;
use App\Http\Middleware\isBOD;
use App\Http\Middleware\isAdmin;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BodController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AbsenController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::middleware('guest')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/forgotpassword', action: [AuthController::class, 'forgotPassword']);
        Route::post('/forgotpasswordtoken', action: [AuthController::class, 'checkTokenForgotPassword']);
        Route::post('/resetpassword', action: [AuthController::class, 'resetPassword']);
    });
});



Route::middleware('auth:sanctum')->group(function () {
    Route::middleware(isAdmin::class)->group(function () {

    });
    Route::middleware(isHR::class)->group(function () {

    });
    Route::middleware(isBOD::class)->group(function () {
        Route::post('/accpermit/{id}', [BodController::class, 'approvePermit']);
        Route::post('/denypermit/{id}', [BodController::class, 'denyPermit']);
    });

    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/checklocation', [AbsenController::class, 'checkLocation']);
    Route::post('/absent', [AbsenController::class, 'absent']);
    Route::post('/permit', [AbsenController::class, 'storePermit']);
    Route::post('/leave', [AbsenController::class, 'leave']);
    Route::get('/presences', [AbsenController::class, 'getPresences']);
    Route::get('/presence', [AbsenController::class, 'getPresence']);
    Route::post('/addphoto', [UserController::class, 'addPhotoProfile']);
});
