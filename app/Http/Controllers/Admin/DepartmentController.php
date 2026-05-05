<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Faculty;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function index(Request $request)
    {
        $departments = Department::with(['faculty:id,name,code'])
            ->withCount(['students', 'courses'])
            ->when($request->search, function ($query) use ($request) {
                $search = $request->search;

                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%")
                        ->orWhereHas('faculty', function ($facultyQuery) use ($search) {
                            $facultyQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('code', 'like', "%{$search}%");
                        });
                });
            })
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Departments', [
            'departments' => $departments,
            'faculties' => Faculty::orderBy('name')->get(['id', 'name', 'code']),
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'faculty_id' => 'required|exists:faculties,id',
            'name' => 'required|string|max:255|unique:departments,name',
            'code' => 'required|string|max:20|unique:departments,code',
            'description' => 'nullable|string',
        ]);

        Department::create($request->only('faculty_id', 'name', 'code', 'description'));

        return back()->with('success', 'Department created successfully.');
    }

    public function update(Request $request, Department $department)
    {
        $request->validate([
            'faculty_id' => 'required|exists:faculties,id',
            'name' => "required|string|max:255|unique:departments,name,{$department->id}",
            'code' => "required|string|max:20|unique:departments,code,{$department->id}",
            'description' => 'nullable|string',
        ]);

        $department->update($request->only('faculty_id', 'name', 'code', 'description'));

        return back()->with('success', 'Department updated successfully.');
    }

    public function destroy(Department $department)
    {
        if ($department->students()->count() > 0 || $department->courses()->count() > 0) {
            return back()->with('error', 'Cannot delete department with related records.');
        }

        $department->delete();

        return back()->with('success', 'Department deleted successfully.');
    }
}
