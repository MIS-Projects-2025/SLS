<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DemoController;
use App\Http\Middleware\AuthMiddleware;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

$app_name = env('APP_NAME', '');

// Authentication routes
require __DIR__ . '/auth.php';

// General routes
require __DIR__ . '/general.php';

// Setup routes
require __DIR__ . '/setup.php';

// Positive routes
require __DIR__ . '/positive.php';

// QAPE routes
require __DIR__ . '/qape.php';

require __DIR__ . '/gongovision.php';

require __DIR__ . '/visioncorelation.php';

require __DIR__ . '/matrix.php';

Route::prefix($app_name)->middleware(AuthMiddleware::class)->group(function () {
    Route::get("/", [DashboardController::class, 'index'])->name('dashboard');
});

// Route::fallback(function () {
//     return Inertia::render('404');
// })->name('404');

Route::fallback(function () {
    // For Inertia requests, just redirect back to the same URL
    return redirect()->to(request()->fullUrl());
})->name('404');

Route::get('/maintenance', function () {
    return Inertia::render('Maintenance');
})->name('maintenance');
