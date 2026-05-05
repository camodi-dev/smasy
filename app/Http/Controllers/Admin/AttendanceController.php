<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Student;
use App\Models\TimetableSlot;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $attendances = Attendance::with([
            'student:id,first_name,last_name,matricule',
            'timetableSlot:id,course_id,day_of_week,start_time,end_time',
            'timetableSlot.course:id,name,code',
        ])
            ->orderByDesc('date')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Attendance', [
            'attendances' => $attendances,
            'students' => Student::orderBy('first_name')->get(['id', 'first_name', 'last_name', 'matricule']),
            'slots' => TimetableSlot::with('course:id,name,code')->orderBy('day_of_week')->get(['id', 'course_id', 'day_of_week', 'start_time', 'end_time']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'timetable_slot_id' => 'required|exists:timetable_slots,id',
            'date' => 'required|date',
            'status' => 'required|in:present,absent,late,excused',
            'note' => 'nullable|string|max:255',
        ]);

        Attendance::updateOrCreate(
            [
                'student_id' => $validated['student_id'],
                'timetable_slot_id' => $validated['timetable_slot_id'],
                'date' => $validated['date'],
            ],
            $validated
        );

        return back()->with('success', 'Attendance saved successfully.');
    }

    public function update(Request $request, Attendance $attendance)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'timetable_slot_id' => 'required|exists:timetable_slots,id',
            'date' => 'required|date',
            'status' => 'required|in:present,absent,late,excused',
            'note' => 'nullable|string|max:255',
        ]);

        $attendance->update($validated);

        return back()->with('success', 'Attendance updated successfully.');
    }

    public function destroy(Attendance $attendance)
    {
        $attendance->delete();

        return back()->with('success', 'Attendance deleted successfully.');
    }
}
