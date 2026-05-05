<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $courses = Course::with('department:id,name,code')
            ->when($request->search, function ($query) use ($request) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Courses', [
            'courses' => $courses,
            'departments' => Department::orderBy('name')->get(['id', 'name', 'code']),
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'department_id' => 'required|exists:departments,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:courses,code',
            'credits' => 'required|integer|min:1|max:30',
            'semester' => 'nullable|string|max:50',
            'level' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        Course::create($validated);

        return back()->with('success', 'Course created successfully.');
    }

    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'department_id' => 'required|exists:departments,id',
            'name' => 'required|string|max:255',
            'code' => "required|string|max:255|unique:courses,code,{$course->id}",
            'credits' => 'required|integer|min:1|max:30',
            'semester' => 'nullable|string|max:50',
            'level' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        $course->update($validated);

        return back()->with('success', 'Course updated successfully.');
    }

    public function destroy(Course $course)
    {
        $course->delete();

        return back()->with('success', 'Course deleted successfully.');
    }
}
