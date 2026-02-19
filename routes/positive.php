<?php

use App\Http\Controllers\PositiveLogsheet\PositiveChecklistItemController;
use App\Http\Controllers\PositiveLogsheet\PositiveChecklistController;
use App\Http\Middleware\AuthMiddleware;
use Illuminate\Support\Facades\Route;

$app_name = env('APP_NAME', '');

Route::prefix($app_name)
  ->middleware(AuthMiddleware::class)
  ->group(function () {


    // Positive Checklist Routes fillable items
    Route::get("/positive-checklist", [PositiveChecklistItemController::class, 'index'])
      ->name('positive.checklist.index');

    // Correct: use Route facade
    Route::post("/positive-checklist-store", [PositiveChecklistItemController::class, 'store'])
      ->name('positive.checklist.store');

    Route::put("/positive-checklist-edit/{id}", [PositiveChecklistItemController::class, 'update'])
      ->name('positive.checklist.edit');

    Route::delete('/positive-checklist-delete/{id}', [PositiveChecklistItemController::class, 'destroy'])
      ->name('positive.checklist.delete');


    // Fetch positive checklist items
    Route::get('/positive-checklist-items', [PositiveChecklistController::class, 'index'])
      ->name('positive.checklist.items');

    // Save answers from PositiveChecklist
    Route::post('/positive-checklist-store}', [PositiveChecklistController::class, 'store'])
      ->name('positive.checklist.store');
  });
