<?php

use App\Http\Controllers\AssignmentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Assignment routes
    Route::resource('assignments', AssignmentController::class);
    Route::patch('assignments/{assignment}/complete', [AssignmentController::class, 'complete'])->name('assignments.complete');
    Route::patch('assignments/{assignment}/status', [AssignmentController::class, 'updateStatus'])->name('assignments.status');
    Route::post('assignments/recalculate-priorities', [AssignmentController::class, 'recalculatePriorities'])->name('assignments.recalculate');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
