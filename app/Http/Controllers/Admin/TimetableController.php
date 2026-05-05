<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Teacher;
use App\Models\TimetableSlot;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TimetableController extends Controller
{
    public function index(Request $request)
    {
        $slots = TimetableSlot::with(['course:id,name,code', 'teacher:id,first_name,last_name'])
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Timetable', [
            'slots' => $slots,
            'courses' => Course::orderBy('name')->get(['id', 'name', 'code']),
            'teachers' => Teacher::orderBy('first_name')->get(['id', 'first_name', 'last_name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'teacher_id' => 'required|exists:teachers,id',
            'day_of_week' => 'required|in:monday,tuesday,wednesday,thursday,friday,saturday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'room' => 'nullable|string|max:255',
            'academic_year' => 'required|string|max:50',
        ]);

        TimetableSlot::create($validated);

        return back()->with('success', 'Timetable slot created successfully.');
    }

    public function update(Request $request, TimetableSlot $timetable)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'teacher_id' => 'required|exists:teachers,id',
            'day_of_week' => 'required|in:monday,tuesday,wednesday,thursday,friday,saturday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'room' => 'nullable|string|max:255',
            'academic_year' => 'required|string|max:50',
        ]);

        $timetable->update($validated);

        return back()->with('success', 'Timetable slot updated successfully.');
    }

    public function destroy(TimetableSlot $timetable)
    {
        $timetable->delete();

        return back()->with('success', 'Timetable slot deleted successfully.');
    }
}
