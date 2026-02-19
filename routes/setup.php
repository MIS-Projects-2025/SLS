<?php

use App\Http\Controllers\SetupLogsheet\SetupChecklistController;
use App\Http\Controllers\SetupLogsheet\SetupChecklistItemController;
use App\Http\Middleware\AuthMiddleware;
use Illuminate\Support\Facades\Route;

$app_name = env('APP_NAME', '');

Route::prefix($app_name)
  ->middleware(AuthMiddleware::class)
  ->group(function () {


    //Checklist Items Routes
    Route::get("/setup-checklist", [SetupChecklistItemController::class, 'index'])
      ->name('setup.checklist.index');
    Route::post("/setup-checklist-store", [SetupChecklistItemController::class, 'store'])
      ->name('setup.checklist.store');
    Route::put("/setup-checklist-edit/{id}", [SetupChecklistItemController::class, 'update'])
      ->name('setup.checklist.edit');
    Route::delete('/setup-checklist-delete/{id}', [SetupChecklistItemController::class, 'destroy'])
      ->name('setup.checklist.delete');

    //Checklist Routes fillable items
    Route::get("/setup-checklist-index", [SetupChecklistController::class, 'index'])
      ->name('setup-new.checklist.index');

    Route::post("/setup-checklist-store", [SetupChecklistController::class, 'store'])
      ->name('setup.checklist.store');

    // Fetch setup details (for PositiveChecklist)
    Route::get('/setup-checklist/{id}', [SetupChecklistController::class, 'show'])
      ->name('setup.checklist.show');

    Route::get('/setup-checklist/{setup_log_id}/positive', [SetupChecklistController::class, 'positive'])
      ->name('setup.checklist.positive');

    Route::put('/setup-checklist/qverify/{setup_log_id}', [SetupChecklistController::class, 'verify'])
      ->name('setup.checklist.verify');
  });
