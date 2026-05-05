<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        $teachers = Teacher::with('user:id,name,email')
            ->when($request->search, function ($query) use ($request) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('employee_id', 'like', "%{$search}%");
                });
            })
            ->orderBy('first_name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Teachers', [
            'teachers' => $teachers,
            'users' => User::where('role', 'teacher')->orderBy('name')->get(['id', 'name', 'email']),
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id|unique:teachers,user_id',
            'employee_id' => 'required|string|max:255|unique:teachers,employee_id',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'specialization' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive,on_leave',
        ]);

        Teacher::create($validated);

        return back()->with('success', 'Teacher created successfully.');
    }

    public function update(Request $request, Teacher $teacher)
    {
        $validated = $request->validate([
            'user_id' => "required|exists:users,id|unique:teachers,user_id,{$teacher->id}",
            'employee_id' => "required|string|max:255|unique:teachers,employee_id,{$teacher->id}",
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'specialization' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive,on_leave',
        ]);

        $teacher->update($validated);

        return back()->with('success', 'Teacher updated successfully.');
    }

    public function destroy(Teacher $teacher)
    {
        $teacher->delete();

        return back()->with('success', 'Teacher deleted successfully.');
    }
}
