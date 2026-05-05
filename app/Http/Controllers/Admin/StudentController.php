<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $students = Student::with(['department:id,name,code', 'user:id,name,email'])
            ->when($request->search, function ($query) use ($request) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('matricule', 'like', "%{$search}%");
                });
            })
            ->orderBy('first_name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Students', [
            'students' => $students,
            'departments' => Department::orderBy('name')->get(['id', 'name', 'code']),
            'users' => User::where('role', 'student')->orderBy('name')->get(['id', 'name', 'email']),
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id|unique:students,user_id',
            'department_id' => 'nullable|exists:departments,id',
            'matricule' => 'nullable|string|max:255|unique:students,matricule',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'level' => 'nullable|string|max:50',
            'year' => 'nullable|string|max:50',
            'status' => 'required|in:active,inactive,suspended,graduated',
        ]);

        Student::create($validated);

        return back()->with('success', 'Student created successfully.');
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'user_id' => "nullable|exists:users,id|unique:students,user_id,{$student->id}",
            'department_id' => 'nullable|exists:departments,id',
            'matricule' => "nullable|string|max:255|unique:students,matricule,{$student->id}",
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'level' => 'nullable|string|max:50',
            'year' => 'nullable|string|max:50',
            'status' => 'required|in:active,inactive,suspended,graduated',
        ]);

        $student->update($validated);

        return back()->with('success', 'Student updated successfully.');
    }

    public function destroy(Student $student)
    {
        $student->delete();

        return back()->with('success', 'Student deleted successfully.');
    }
}
