<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FeePayment;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeePaymentController extends Controller
{
    public function index(Request $request)
    {
        $fees = FeePayment::with('student:id,first_name,last_name,matricule')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Fees', [
            'fees' => $fees,
            'students' => Student::orderBy('first_name')->get(['id', 'first_name', 'last_name', 'matricule']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'academic_year' => 'required|string|max:50',
            'semester' => 'required|string|max:50',
            'amount' => 'required|numeric|min:0',
            'paid' => 'required|numeric|min:0',
            'status' => 'required|in:pending,partial,paid,overdue',
            'due_date' => 'nullable|date',
            'paid_date' => 'nullable|date',
        ]);

        $validated['balance'] = max((float) $validated['amount'] - (float) $validated['paid'], 0);

        FeePayment::create($validated);

        return back()->with('success', 'Fee payment record created successfully.');
    }

    public function update(Request $request, FeePayment $fee)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'academic_year' => 'required|string|max:50',
            'semester' => 'required|string|max:50',
            'amount' => 'required|numeric|min:0',
            'paid' => 'required|numeric|min:0',
            'status' => 'required|in:pending,partial,paid,overdue',
            'due_date' => 'nullable|date',
            'paid_date' => 'nullable|date',
        ]);

        $validated['balance'] = max((float) $validated['amount'] - (float) $validated['paid'], 0);

        $fee->update($validated);

        return back()->with('success', 'Fee payment record updated successfully.');
    }

    public function destroy(FeePayment $fee)
    {
        $fee->delete();

        return back()->with('success', 'Fee payment record deleted successfully.');
    }
}
