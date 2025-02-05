<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/forgotpassword', action: [AuthController::class, 'forgotPassword']);
    Route::post('/checktokenforgotpassword', action: [AuthController::class, 'checkTokenForgotPassword']);
    Route::post('/resetpassword', action: [AuthController::class, 'resetPassword']);
});
