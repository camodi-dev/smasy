<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeePayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id', 'academic_year', 'semester',
        'amount', 'paid', 'balance',
        'status', 'due_date', 'paid_date',
    ];

    protected $casts = [
        'due_date'  => 'date',
        'paid_date' => 'date',
        'amount'    => 'decimal:2',
        'paid'      => 'decimal:2',
        'balance'   => 'decimal:2',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}