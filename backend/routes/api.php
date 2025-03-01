<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Barang\BarangController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Toko\TokoController;
use App\Http\Controllers\Kategori\KategoriController;
use App\Http\Controllers\Lelang\LelangController;
use App\Http\Controllers\Penawaran\PenawaranController;

Route::post('/register', [RegisteredUserController::class, 'store'])
    ->middleware('guest')
    ->name('register');

Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->middleware('guest')
    ->name('login');

Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
    ->middleware('guest')
    ->name('password.email');

Route::post('/reset-password', [NewPasswordController::class, 'store'])
    ->middleware('guest')
    ->name('password.store');

Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
    ->middleware(['auth', 'signed', 'throttle:6,1'])
    ->name('verification.verify');

Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
    ->middleware(['auth', 'throttle:6,1'])
    ->name('verification.send');

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

// User Management Routes
Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::post('/', [UserController::class, 'store']);
    Route::get('/{id}', [UserController::class, 'show']);
    Route::put('/{id}', [UserController::class, 'update']);
    Route::delete('/{id}', [UserController::class, 'destroy']);
});

// Store Management Routes
 Route::prefix('stores')->group(function () {
    Route::post('/', [TokoController::class, 'store']);
    Route::get('/', [TokoController::class, 'index']);
    Route::get('/my-store', [TokoController::class, 'myStore']);
    Route::get('/user/{userId}', [TokoController::class, 'getTokoByUserId']); // Add this new route
    Route::get('/{TokoId}/items', [BarangController::class, 'getBarangByToko']); // Add this new route
});

// Kategori Management Routes
Route::prefix('categories')->group(function () {
    Route::get('/', [KategoriController::class, 'index']);
    Route::post('/', [KategoriController::class, 'store']);
    Route::get('/{id}', [KategoriController::class, 'show']);
    Route::put('/{id}', [KategoriController::class, 'update']);
    Route::delete('/{id}', [KategoriController::class, 'destroy']);
});

// Barang Management Routes
Route::prefix ('barang')->group(function ()  {
    Route::get('/', [BarangController::class, 'index']);
    Route::post('/', [BarangController::class, 'store']);
    Route::get('/user/{userId}', [BarangController::class, 'getBarangByUser']);
    Route::get('/{id}', [BarangController::class, 'getBarangById']);
    Route::get('/toko/{tokoId}/user/{userId}', [BarangController::class, 'getBarangByTokoAndUser']);
    Route::put('/{id}', [BarangController::class, 'update']);
    Route::delete('/{id}', [BarangController::class, 'destroy']);
});

// Lelang Management Routes
Route::prefix('lelang')->group(function () {
    Route::get('/', [LelangController::class, 'index'])->name('lelang.index');
    Route::post('/', [LelangController::class, 'store'])->name('lelang.store');
    Route::get('/{id}', [LelangController::class, 'show'])->name('lelang.show');
    Route::put('/{id}', [LelangController::class, 'update'])->name('lelang.update');
    Route::delete('/{id}', [LelangController::class, 'destroy'])->name('lelang.destroy');
    Route::post('/{id}/bid', [PenawaranController::class, 'store'])->name('lelang.bid.store');
    Route::get('/{id}/bids', [PenawaranController::class, 'getByLelang'])->name('lelang.bids');
});

