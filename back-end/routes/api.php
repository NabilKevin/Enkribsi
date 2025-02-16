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
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OfficeController;
use App\Http\Middleware\jwtMiddleware;

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



Route::middleware(jwtMiddleware::class)->group(function () {
    Route::prefix('admin')->middleware(isAdmin::class)->group(function() {
        Route::get('/bods', [AdminController::class, 'getBods']);
        Route::resource('employees', AdminController::class);
    });
    Route::prefix('hr')->middleware(isHR::class)->group(function() {
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
    Route::prefix('bod')->middleware(isBOD::class)->group(function() {
        Route::post('/permit/approve/{id}', [BodController::class, 'approvePermit']);
        Route::post('/permit/deny/{id}', [BodController::class, 'denyPermit']);
        Route::get('/permit', [BodController::class, 'getPermits']);

        Route::post('/schedule/approve/{id}', [BodController::class, 'approveSchedule']);
        route::post('/schedule/deny/{id}', [BodController::class, 'denySchedule']);
        Route::get('/schedule/pendings', [BodController::class, 'getPendingSchedules']);
        route::delete('/schedule/delete/{id}', [BodController::class, 'destroySchedule']);

        Route::post('/announcement/approve/{id}', [BodController::class, 'approveAnnouncement']);
        route::post('/announcement/deny/{id}', [BodController::class, 'denyAnnouncement']);
        Route::get('/announcement/pendings', [BodController::class, 'getPendingAnnouncements']);
        route::delete('/announcement/delete/{id}', [BodController::class, 'destroyAnnouncement']);

        Route::post('/office/approve/{id}', [BodController::class, 'approveOffice']);
        route::post('/office/deny/{id}', [BodController::class, 'denyOffice']);
        Route::get('/office/pendings', [BodController::class, 'getPendingOffices']);
        route::delete('/office/delete/{id}', [BodController::class, 'destroyOffice']);

        Route::post('/wfah/approve/{id}', [BodController::class, 'approveWFH']);
        route::post('/wfah/deny/{id}', [BodController::class, 'denyWFH']);
        Route::get('/wfah/pendings', [BodController::class, 'getPendingWFHs']);
        route::delete('/wfah/delete/{id}', [BodController::class, 'destroyWFH']);

        Route::get('/statistics', [BodController::class, 'getStatistics']);
    });

    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::post('/checklocation', [AbsenController::class, 'checkLocation']);
    Route::post('/checkschedulewfah', [AbsenController::class, 'checkScheduleWfah']);
    Route::post('/absent', [AbsenController::class, 'absent']);
    Route::post('/permit', [AbsenController::class, 'storePermit']);
    Route::post('/permit/cancel/{id}', [AbsenController::class, 'cancelPermit']);
    Route::post('/leave', [AbsenController::class, 'leave']);
    Route::get('/presences', [AbsenController::class, 'getPresences']);
    Route::get('/presence', [AbsenController::class, 'getPresence']);
    Route::get('/attendance', [AbsenController::class, 'getAttendance']);
    Route::get('/permits', [AbsenController::class, 'getPermits']);
    Route::get('/offices', [AbsenController::class, 'getOffices']);

    Route::post('/addphoto', [UserController::class, 'addPhotoProfile']);
    Route::get('/me', [UserController::class, 'me']);

    Route::get('/notifications/count', [NotificationController::class, 'getNotificationsCount']);
    Route::get('/notifications', [NotificationController::class, 'getNotifications']);
    Route::get('/notifications/{id}', [NotificationController::class, 'getNotification']);
    Route::delete('/notifications', [NotificationController::class, 'deleteNotifications']);
});
