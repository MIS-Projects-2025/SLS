<?php

use App\Http\Controllers\QAPE\QaGoVisionController;
use App\Http\Controllers\QAPE\SetupLogsheetController;
use App\Http\Middleware\AuthMiddleware;
use Illuminate\Support\Facades\Route;

$app_name = env('APP_NAME', '');

Route::prefix($app_name)
  ->middleware(AuthMiddleware::class)
  ->group(function () {


    //Checklist Items Routes
    Route::get("/setup-logsheet-qape-index", [SetupLogsheetController::class, 'index'])
      ->name('setup.logsheet.qape.index');

    Route::put("/logsheet-qape-verify/passed/{setup_log_id}", [SetupLogsheetController::class, 'verify'])
      ->name('logsheet.qape.verify.passed');

    Route::put("/logsheet-qape-modify/{setup_log_id}", [SetupLogsheetController::class, 'modify'])
      ->name('logsheet.qape.modify');

    Route::get("/qa-go-no-go-vision-index", [QaGoVisionController::class, 'index'])
      ->name('qa-go.vision.index');
  });
