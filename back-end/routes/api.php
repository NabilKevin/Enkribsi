<?php

use App\Http\Controllers\ScheduleController;
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
use App\Http\Controllers\WfhScheduleController;
use App\Http\Middleware\jwtMiddleware;
use App\Http\Middleware\isNotAdmin;
use App\Http\Middleware\isWeekend;

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
        Route::get('/permits/today', [HrController::class, 'getTodayPermits']);
        Route::get('/employees', [HrController::class, 'getEmployees']);
        Route::get('/employees/{username}/attendance', [HrController::class, 'getEmployeeAttendance']);
        Route::get('/employees/attendance', [HrController::class, 'getAttendances']);
        Route::post('/report', [HrController::class, 'makeReport']);
        Route::get('/audiences', [HrController::class, 'getAudiences']);
        Route::resource('offices', OfficeController::class);
        Route::resource('schedules', ScheduleController::class);
        Route::resource('announcements', AnnouncementController::class);
        Route::resource('wfh/schedules', WfhScheduleController::class);
    });
    Route::prefix('bod')->middleware(isBOD::class)->group(function() {
        Route::post('/permit/approve/{id}', [BodController::class, 'approvePermit']);
        Route::post('/permit/deny/{id}', [BodController::class, 'denyPermit']);
        Route::get('/permit', [BodController::class, 'getPermits']);

        Route::post('/schedule/approve/{id}', [BodController::class, 'approveSchedule']);
        route::post('/schedule/deny/{id}', [BodController::class, 'denySchedule']);
        Route::get('/schedule/pendings', [BodController::class, 'getPendingSchedules']);

        Route::post('/announcement/approve/{id}', [BodController::class, 'approveAnnouncement']);
        route::post('/announcement/deny/{id}', [BodController::class, 'denyAnnouncement']);
        Route::get('/announcement/pendings', [BodController::class, 'getPendingAnnouncements']);

        Route::post('/office/approve/{id}', [BodController::class, 'approveOffice']);
        route::post('/office/deny/{id}', [BodController::class, 'denyOffice']);
        Route::get('/office/pendings', [BodController::class, 'getPendingOffices']);

        Route::get('/statistics', [BodController::class, 'getStatistics']);
    });

    Route::middleware(isNotAdmin::class)->group(function() {
        Route::middleware(isWeekend::class)->group(function() {
            Route::post('/checklocation', [AbsenController::class, 'checkLocation'] );
            Route::post('/checkschedulewfh', [AbsenController::class, 'checkScheduleWfh']);
            Route::post('/absent', [AbsenController::class, 'absent']);
            Route::post('/permit', [AbsenController::class, 'storePermit']);
            Route::post('/permit/cancel/{id}', [AbsenController::class, 'cancelPermit']);
            Route::post('/leave', [AbsenController::class, 'leave']);
            Route::get('/attendance', [AbsenController::class, 'getAttendance']);
            Route::get('/offices', [AbsenController::class, 'getOffices']);
        });

        Route::get('/permits', [AbsenController::class, 'getPermits']);
        Route::get('/presences/count', [AbsenController::class, 'getPresencesCount']);
        Route::get('/presences', [AbsenController::class, 'getPresences']);

        Route::post('/addphoto', [UserController::class, 'addPhotoProfile']);
        Route::get('/me', [UserController::class, 'me']);

        Route::get('/notifications/count', [NotificationController::class, 'getNotificationsCount']);
        Route::get('/notifications', [NotificationController::class, 'getNotifications']);
        Route::get('/notifications/{slug}', [NotificationController::class, 'getNotification']);
        Route::post('/notifications', [NotificationController::class, 'deleteNotifications']);
    });

    Route::post('/auth/logout', [AuthController::class, 'logout']);
});
