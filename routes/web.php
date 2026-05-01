<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SocialAuthController;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test', fn() => Inertia::render('Test'));

Route::get('/login', fn() => view('auth.login'))->name('login');

Route::post('/auth/social/callback', [SocialAuthController::class, 'handle'])->name('social.login');
