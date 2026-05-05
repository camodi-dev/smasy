<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faculty;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FacultyController extends Controller
{
    public function index(Request $request)
    {
        $faculties = Faculty::withCount('departments')
            ->when($request->search, fn($q) =>
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('code', 'like', "%{$request->search}%")
            )
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Faculties', [
            'faculties' => $faculties,
            'filters'   => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:255|unique:faculties,name',
            'code'        => 'required|string|max:20|unique:faculties,code',
            'description' => 'nullable|string',
        ]);

        Faculty::create($request->only('name', 'code', 'description'));

        return back()->with('success', 'Faculty created successfully.');
    }

    public function update(Request $request, Faculty $faculty)
    {
        $request->validate([
            'name'        => "required|string|max:255|unique:faculties,name,{$faculty->id}",
            'code'        => "required|string|max:20|unique:faculties,code,{$faculty->id}",
            'description' => 'nullable|string',
        ]);

        $faculty->update($request->only('name', 'code', 'description'));

        return back()->with('success', 'Faculty updated successfully.');
    }

    public function destroy(Faculty $faculty)
    {
        if ($faculty->departments()->count() > 0) {
            return back()->with('error', 'Cannot delete faculty with departments.');
        }

        $faculty->delete();

        return back()->with('success', 'Faculty deleted successfully.');
    }
}