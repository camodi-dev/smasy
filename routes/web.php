<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SocialAuthController;
use App\Http\Controllers\AuthController;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Root
Route::get('/', function () {
    return redirect()->route('login');
});

// Test
Route::get('/test', fn() => Inertia::render('Test'));

// Debug (remove after fixing)
Route::get('/check-auth', function () {
    return response()->json([
        'logged_in' => auth()->check(),
        'user'      => auth()->user(),
        'session'   => session()->all(),
    ]);
});

// Auth Routes (guests only)
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.post');
});

// Firebase Social Login
Route::post('/auth/social/callback', [SocialAuthController::class, 'handle'])->name('social.login');

// Logout
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Protected Routes (authenticated only)
Route::middleware('auth')->group(function () {

    // Dashboard (shared for all roles)
    Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->name('dashboard');

    // Admin Routes
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/students', fn() => Inertia::render('Admin/Students'))->name('students');
        Route::get('/teachers', fn() => Inertia::render('Admin/Teachers'))->name('teachers');
        Route::get('/courses', fn() => Inertia::render('Admin/Courses'))->name('courses');
        Route::get('/timetable', fn() => Inertia::render('Admin/Timetable'))->name('timetable');
        Route::get('/attendance', fn() => Inertia::render('Admin/Attendance'))->name('attendance');
        Route::get('/grades', fn() => Inertia::render('Admin/Grades'))->name('grades');
        Route::get('/fees', fn() => Inertia::render('Admin/Fees'))->name('fees');
        Route::get('/announcements', fn() => Inertia::render('Admin/Announcements'))->name('announcements');
        Route::get('/settings', fn() => Inertia::render('Admin/Settings'))->name('settings');
    });

    // Teacher Routes
    Route::prefix('teacher')->name('teacher.')->group(function () {
        Route::get('/courses', fn() => Inertia::render('Teacher/Courses'))->name('courses');
        Route::get('/students', fn() => Inertia::render('Teacher/Students'))->name('students');
        Route::get('/timetable', fn() => Inertia::render('Teacher/Timetable'))->name('timetable');
        Route::get('/attendance', fn() => Inertia::render('Teacher/Attendance'))->name('attendance');
        Route::get('/grades', fn() => Inertia::render('Teacher/Grades'))->name('grades');
        Route::get('/exams', fn() => Inertia::render('Teacher/Exams'))->name('exams');
        Route::get('/announcements', fn() => Inertia::render('Teacher/Announcements'))->name('announcements');
    });

    // Student Routes
    Route::prefix('student')->name('student.')->group(function () {
        Route::get('/courses', fn() => Inertia::render('Student/Courses'))->name('courses');
        Route::get('/timetable', fn() => Inertia::render('Student/Timetable'))->name('timetable');
        Route::get('/attendance', fn() => Inertia::render('Student/Attendance'))->name('attendance');
        Route::get('/grades', fn() => Inertia::render('Student/Grades'))->name('grades');
        Route::get('/exams', fn() => Inertia::render('Student/Exams'))->name('exams');
        Route::get('/fees', fn() => Inertia::render('Student/Fees'))->name('fees');
        Route::get('/announcements', fn() => Inertia::render('Student/Announcements'))->name('announcements');
    });

});