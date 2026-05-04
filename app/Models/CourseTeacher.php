<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class CourseTeacher extends Pivot
{
    protected $table = 'course_teachers';

    protected $fillable = ['course_id', 'teacher_id', 'academic_year'];
}