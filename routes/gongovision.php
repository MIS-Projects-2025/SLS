<?php

use App\Http\Controllers\GoVision\GoVisionController;
use App\Http\Middleware\AuthMiddleware;
use Illuminate\Support\Facades\Route;

$app_name = env('APP_NAME', '');

Route::prefix($app_name)
  ->middleware(AuthMiddleware::class)
  ->group(function () {


    //Checklist Items Routes
    Route::get("/go-no-go-vision-index", [GoVisionController::class, 'index'])
      ->name('go.vision.index');

    Route::post('/go-no-go-vision-store', [GoVisionController::class, 'store'])
      ->name('go.vision.store');

    Route::post('/go-no-go-vision-verify/{id}', [GoVisionController::class, 'verify'])
      ->name('go.vision.verify');
  });
