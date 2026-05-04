<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id', 'enrollment_id', 'exam_id',
        'score', 'max_score', 'grade_letter', 'remarks',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class);
    }

    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    public function getPercentageAttribute(): float
    {
        return $this->max_score > 0
            ? round(($this->score / $this->max_score) * 100, 2)
            : 0;
    }
}