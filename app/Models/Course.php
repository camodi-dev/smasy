<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'department_id', 'name', 'code',
        'credits', 'semester', 'level',
        'description', 'status',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function teachers()
    {
        return $this->belongsToMany(Teacher::class, 'course_teachers')
                    ->withPivot('academic_year')
                    ->withTimestamps();
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'enrollments')
                    ->withPivot('academic_year', 'semester', 'status')
                    ->withTimestamps();
    }

    public function timetableSlots()
    {
        return $this->hasMany(TimetableSlot::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function exams()
    {
        return $this->hasMany(Exam::class);
    }
}