<?php

use App\Http\Controllers\Matrix\ControlLogMatrixController;
use App\Http\Middleware\AuthMiddleware;
use Illuminate\Support\Facades\Route;

$app_name = env('APP_NAME', '');

Route::prefix($app_name)
  ->middleware(AuthMiddleware::class)
  ->group(function () {


    //Checklist Items Routes
    Route::get("/matrix-controllog-index", [ControlLogMatrixController::class, 'index'])
      ->name('matrix.controllog.index');

    Route::post('/matrix-controllog-store', [ControlLogMatrixController::class, 'store'])
      ->name('matrix.controllog.store');

    Route::put('/matrix-controllog-update/{id}', [ControlLogMatrixController::class, 'update'])
      ->name('matrix.controllog.update');

    Route::delete('/matrix-controllog-destroy/{id}', [ControlLogMatrixController::class, 'destroy'])
      ->name('matrix.controllog.destroy');
  });
