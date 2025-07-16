<?php

use App\Http\Controllers\AssignmentController;
use App\Models\Assignment;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = Auth::user();
        
        // Get assignments data
        $assignments = $user->assignments()
            ->byPriority()
            ->pending()
            ->limit(5)
            ->get()
            ->makeHidden(['created_at', 'updated_at']);

        // Calculate statistics
        $stats = [
            'total' => $user->assignments()->count(),
            'pending' => $user->assignments()->pending()->count(),
            'overdue' => $user->assignments()->overdue()->count(),
            'due_soon' => $user->assignments()->dueSoon(7)->count(),
        ];

        return Inertia::render('dashboard', [
            'assignments' => ['data' => $assignments],
            'stats' => $stats,
        ]);
    })->name('dashboard');

    // Assignment routes
    Route::resource('assignments', AssignmentController::class);
    Route::patch('assignments/{assignment}/complete', [AssignmentController::class, 'complete'])->name('assignments.complete');
    Route::patch('assignments/{assignment}/status', [AssignmentController::class, 'updateStatus'])->name('assignments.status');
    Route::post('assignments/recalculate-priorities', [AssignmentController::class, 'recalculatePriorities'])->name('assignments.recalculate');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
