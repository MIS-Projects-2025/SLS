<?php

use App\Http\Controllers\VisionCorelation\VisionCorelationController;
use App\Http\Middleware\AuthMiddleware;
use Illuminate\Support\Facades\Route;

$app_name = env('APP_NAME', '');

Route::prefix($app_name)
  ->middleware(AuthMiddleware::class)
  ->group(function () {


    //Checklist Items Routes
    Route::get("/vision-corelation-index", [VisionCorelationController::class, 'index'])
      ->name('vision.corelation.index');

    Route::post('/vision-corelation-store', [VisionCorelationController::class, 'store'])
      ->name('vision.corelation.store');
  });
