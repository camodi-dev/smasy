<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'employee_id', 'first_name', 'last_name',
        'phone', 'specialization', 'profile_photo',
        'hire_date', 'status',
    ];

    protected $casts = [
        'hire_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'course_teachers')
                    ->withPivot('academic_year')
                    ->withTimestamps();
    }

    public function timetableSlots()
    {
        return $this->hasMany(TimetableSlot::class);
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }
}