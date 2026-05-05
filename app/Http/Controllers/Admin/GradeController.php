<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Exam;
use App\Models\Grade;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GradeController extends Controller
{
    public function index(Request $request)
    {
        $grades = Grade::with([
            'student:id,first_name,last_name,matricule',
            'exam:id,title,course_id',
            'exam.course:id,name,code',
            'enrollment:id,course_id,academic_year,semester',
        ])
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Grades', [
            'grades' => $grades,
            'students' => Student::orderBy('first_name')->get(['id', 'first_name', 'last_name', 'matricule']),
            'exams' => Exam::with('course:id,name,code')->orderByDesc('exam_date')->get(['id', 'course_id', 'title']),
            'enrollments' => Enrollment::with('course:id,name,code')->orderByDesc('id')->get(['id', 'course_id', 'student_id', 'academic_year', 'semester']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'enrollment_id' => 'required|exists:enrollments,id',
            'exam_id' => 'required|exists:exams,id',
            'score' => 'required|numeric|min:0',
            'max_score' => 'required|numeric|min:1',
            'grade_letter' => 'nullable|string|max:10',
            'remarks' => 'nullable|string|max:255',
        ]);

        Grade::updateOrCreate(
            [
                'student_id' => $validated['student_id'],
                'exam_id' => $validated['exam_id'],
            ],
            $validated
        );

        return back()->with('success', 'Grade saved successfully.');
    }

    public function update(Request $request, Grade $grade)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'enrollment_id' => 'required|exists:enrollments,id',
            'exam_id' => 'required|exists:exams,id',
            'score' => 'required|numeric|min:0',
            'max_score' => 'required|numeric|min:1',
            'grade_letter' => 'nullable|string|max:10',
            'remarks' => 'nullable|string|max:255',
        ]);

        $grade->update($validated);

        return back()->with('success', 'Grade updated successfully.');
    }

    public function destroy(Grade $grade)
    {
        $grade->delete();

        return back()->with('success', 'Grade deleted successfully.');
    }
}
