<?php

use App\Http\Controllers\GalleryController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BoothController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';

// Booth Routes - Strict flow: Select → Capture
Route::middleware(['auth', 'verified'])->group(function () {
    // Entry point - redirects to select
    Route::get('/booth', function () {
        return redirect()->route('booth.select');
    })->name('booth');

    // Step 1: Layout Selection (Entry Point)
    Route::get('/booth/select', [BoothController::class, 'selectLayout'])->name('booth.select');

    // Step 2: Capture Session
    Route::get('/booth/capture', [BoothController::class, 'capture'])->name('booth.capture');

    // Save captured photo
    Route::post('/booth/save', [BoothController::class, 'store'])->name('booth.store');
});

// Gallery routes
Route::get('/gallery', [GalleryController::class, 'index'])->name('gallery.index');
Route::delete('/gallery/{id}', [GalleryController::class, 'destroy'])->name('gallery.destroy');