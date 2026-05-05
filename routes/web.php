<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SocialAuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\GradeController;
use App\Http\Controllers\Admin\CourseController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\TeacherController;
use App\Http\Controllers\Admin\TimetableController;
use App\Http\Controllers\Admin\AttendanceController;
use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\FeePaymentController;
use App\Http\Controllers\Admin\FacultyController;
use App\Http\Controllers\Admin\AnnouncementController;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Root
Route::get('/', function () {
    return redirect()->route('dashboard');
});

// Test
Route::get('/test', fn() => Inertia::render('Test'));

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
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/students', [StudentController::class, 'index'])->name('students');
        Route::post('/students', [StudentController::class, 'store'])->name('students.store');
        Route::put('/students/{student}', [StudentController::class, 'update'])->name('students.update');
        Route::delete('/students/{student}', [StudentController::class, 'destroy'])->name('students.destroy');

        Route::get('/teachers', [TeacherController::class, 'index'])->name('teachers');
        Route::post('/teachers', [TeacherController::class, 'store'])->name('teachers.store');
        Route::put('/teachers/{teacher}', [TeacherController::class, 'update'])->name('teachers.update');
        Route::delete('/teachers/{teacher}', [TeacherController::class, 'destroy'])->name('teachers.destroy');

        Route::get('/departments', [DepartmentController::class, 'index'])->name('departments');
        Route::post('/departments', [DepartmentController::class, 'store'])->name('departments.store');
        Route::put('/departments/{department}', [DepartmentController::class, 'update'])->name('departments.update');
        Route::delete('/departments/{department}', [DepartmentController::class, 'destroy'])->name('departments.destroy');
        Route::get('/courses', [CourseController::class, 'index'])->name('courses');
        Route::post('/courses', [CourseController::class, 'store'])->name('courses.store');
        Route::put('/courses/{course}', [CourseController::class, 'update'])->name('courses.update');
        Route::delete('/courses/{course}', [CourseController::class, 'destroy'])->name('courses.destroy');

        Route::get('/timetable', [TimetableController::class, 'index'])->name('timetable');
        Route::post('/timetable', [TimetableController::class, 'store'])->name('timetable.store');
        Route::put('/timetable/{timetable}', [TimetableController::class, 'update'])->name('timetable.update');
        Route::delete('/timetable/{timetable}', [TimetableController::class, 'destroy'])->name('timetable.destroy');

        Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance');
        Route::post('/attendance', [AttendanceController::class, 'store'])->name('attendance.store');
        Route::put('/attendance/{attendance}', [AttendanceController::class, 'update'])->name('attendance.update');
        Route::delete('/attendance/{attendance}', [AttendanceController::class, 'destroy'])->name('attendance.destroy');

        Route::get('/grades', [GradeController::class, 'index'])->name('grades');
        Route::post('/grades', [GradeController::class, 'store'])->name('grades.store');
        Route::put('/grades/{grade}', [GradeController::class, 'update'])->name('grades.update');
        Route::delete('/grades/{grade}', [GradeController::class, 'destroy'])->name('grades.destroy');

        Route::get('/fees', [FeePaymentController::class, 'index'])->name('fees');
        Route::post('/fees', [FeePaymentController::class, 'store'])->name('fees.store');
        Route::put('/fees/{fee}', [FeePaymentController::class, 'update'])->name('fees.update');
        Route::delete('/fees/{fee}', [FeePaymentController::class, 'destroy'])->name('fees.destroy');

        Route::get('/announcements', [AnnouncementController::class, 'index'])->name('announcements');
        Route::post('/announcements', [AnnouncementController::class, 'store'])->name('announcements.store');
        Route::put('/announcements/{announcement}', [AnnouncementController::class, 'update'])->name('announcements.update');
        Route::delete('/announcements/{announcement}', [AnnouncementController::class, 'destroy'])->name('announcements.destroy');

        Route::get('/settings', [ProfileController::class, 'edit'])->name('settings');
        Route::get('/faculties',             [FacultyController::class, 'index'])->name('faculties');
        Route::post('/faculties',            [FacultyController::class, 'store'])->name('faculties.store');
        Route::put('/faculties/{faculty}',   [FacultyController::class, 'update'])->name('faculties.update');
        Route::delete('/faculties/{faculty}',[FacultyController::class, 'destroy'])->name('faculties.destroy');
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/notifications/{announcement}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read_all');

    // Teacher Routes
    Route::middleware('role:teacher')->prefix('teacher')->name('teacher.')->group(function () {
        Route::get('/courses', fn() => Inertia::render('Shared/ModulePage', [
            'title' => 'My Courses',
            'description' => 'View and manage your assigned courses.',
        ]))->name('courses');
        Route::get('/students', fn() => Inertia::render('Shared/ModulePage', [
            'title' => 'My Students',
            'description' => 'Track student progress in your classes.',
        ]))->name('students');
        Route::get('/timetable', fn() => Inertia::render('Shared/ModulePage', [
            'title' => 'Timetable',
            'description' => 'Review your class schedule for the week.',
        ]))->name('timetable');
        Route::get('/attendance', fn() => Inertia::render('Shared/ModulePage', [
            'title' => 'Attendance',
            'description' => 'Mark and monitor attendance records.',
        ]))->name('attendance');
        Route::get('/grades', fn() => Inertia::render('Shared/ModulePage', [
            'title' => 'Grades',
            'description' => 'Enter, update, and analyze student grades.',
        ]))->name('grades');
        Route::get('/exams', fn() => Inertia::render('Shared/ModulePage', [
            'title' => 'Exams',
            'description' => 'Manage exam plans and assessment timelines.',
        ]))->name('exams');
        Route::get('/announcements', fn() => Inertia::render('Shared/ModulePage', [
            'title' => 'Announcements',
            'description' => 'Share updates with your students.',
        ]))->name('announcements');
    });

    // Student Routes
    Route::middleware('role:student')->prefix('student')->name('student.')->group(function () {
        Route::get('/courses', fn() => Inertia::render('Shared/ModulePage', [
            'title' => 'My Courses',
            'description' => 'View your current enrollment and course details.',
        ]))->name('courses');
        Route::get('/timetable', fn() => Inertia::render('Shared/ModulePage', [
            'title' => 'Timetable',
            'description' => 'Check your class schedule and time slots.',
        ]))->name('timetable');
        Route::get('/attendance', fn() => Inertia::render('Shared/ModulePage', [
            'title' => 'Attendance',
            'description' => 'Track your attendance performance.',
        ]))->name('attendance');
        Route::get('/grades', fn() => Inertia::render('Shared/ModulePage', [
            'title' => 'Grades',
            'description' => 'Review your latest grades and report summary.',
        ]))->name('grades');
        Route::get('/exams', fn() => Inertia::render('Shared/ModulePage', [
            'title' => 'Exams',
            'description' => 'See upcoming exam schedules and details.',
        ]))->name('exams');
        Route::get('/fees', fn() => Inertia::render('Shared/ModulePage', [
            'title' => 'Fees',
            'description' => 'View tuition balances and payment history.',
        ]))->name('fees');
        Route::get('/announcements', fn() => Inertia::render('Shared/ModulePage', [
            'title' => 'Announcements',
            'description' => 'Read official school updates and notices.',
        ]))->name('announcements');
    });

    // Error test routes (remove after testing)
    Route::get('/test-404', fn() => abort(404));
    Route::get('/test-403', fn() => abort(403));
    Route::get('/test-500', fn() => abort(500));

});