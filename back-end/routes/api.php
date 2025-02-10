<?php

use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\WfaWfhScheduleController;
use Illuminate\Http\Request;
use App\Http\Middleware\isHR;
use App\Http\Middleware\isBOD;
use App\Http\Middleware\isAdmin;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BodController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AbsenController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\HrController;
use App\Http\Controllers\OfficeController;

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
    Route::prefix('admin')->group(function() {
        Route::middleware(isAdmin::class)->group(function () {
            Route::get('/bods', [AdminController::class, 'getBods']);
            Route::resource('employees', AdminController::class);
        });
    });
    Route::prefix('hr')->group(function() {
        Route::middleware(isHR::class)->group(function () {
            Route::get('/permit/today', [HrController::class, 'getTodayPermits']);
            Route::get('/employees', [HrController::class, 'getEmployees']);
            Route::get('/employees/{id}', [HrController::class, 'getEmployee']);
            Route::get('/attendances', [HrController::class, 'getAttendances']);
            Route::post('/report', [HrController::class, 'makeReport']);
            Route::resource('offices', OfficeController::class);
            Route::resource('schedules', ScheduleController::class);
            Route::resource('announcements', AnnouncementController::class);
            Route::resource('wfawfhschedules', WfaWfhScheduleController::class);
        });
    });
    Route::prefix('bod')->group(function() {
        Route::middleware(isBOD::class)->group(function () {
            Route::get('/permit', [BodController::class, 'getPermits']);
            Route::post('/permit/approve/{id}', [BodController::class, 'approvePermit']);
            Route::post('/permit/deny/{id}', [BodController::class, 'denyPermit']);
        });
    });

    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::post('/checklocation', [AbsenController::class, 'checkLocation']);
    Route::post('/absent', [AbsenController::class, 'absent']);
    Route::post('/permit', [AbsenController::class, 'storePermit']);
    Route::post('/permit/cancel/{id}', [AbsenController::class, 'cancelPermit']);
    Route::post('/leave', [AbsenController::class, 'leave']);
    Route::get('/presences', [AbsenController::class, 'getPresences']);
    Route::get('/presence', [AbsenController::class, 'getPresence']);
    Route::get('/attendance', [AbsenController::class, 'getAttendance']);
    Route::get('/permit', [AbsenController::class, 'getPermits']);

    Route::post('/addphoto', [UserController::class, 'addPhotoProfile']);
    Route::get('/me', [UserController::class, 'me']);
});
