<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('department_id')->nullable()->constrained()->onDelete('set null');
            $table->string('matricule')->nullable()->unique();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('phone')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->string('address')->nullable();
            $table->string('nationality')->nullable();
            $table->string('profile_photo')->nullable();
            $table->string('guardian_name')->nullable();
            $table->string('guardian_phone')->nullable();
            $table->string('guardian_email')->nullable();
            $table->string('level')->nullable();
            $table->string('year')->nullable();
            $table->date('enrollment_date')->nullable();
            $table->enum('status', ['active', 'inactive', 'suspended', 'graduated'])->default('active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['department_id']);
            $table->dropColumn([
                'user_id',
                'department_id',
                'matricule',
                'first_name',
                'last_name',
                'phone',
                'date_of_birth',
                'gender',
                'address',
                'nationality',
                'profile_photo',
                'guardian_name',
                'guardian_phone',
                'guardian_email',
                'level',
                'year',
                'enrollment_date',
                'status',
            ]);
        });
    }
};
