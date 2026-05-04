<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'department_id', 'matricule',
        'first_name', 'last_name', 'phone',
        'date_of_birth', 'gender', 'address', 'nationality',
        'profile_photo', 'guardian_name', 'guardian_phone',
        'guardian_email', 'level', 'year',
        'enrollment_date', 'status',
    ];

    protected $casts = [
        'date_of_birth'   => 'date',
        'enrollment_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function grades()
    {
        return $this->hasMany(Grade::class);
    }

    public function feePayments()
    {
        return $this->hasMany(FeePayment::class);
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'enrollments')
                    ->withPivot('academic_year', 'semester', 'status')
                    ->withTimestamps();
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }
}