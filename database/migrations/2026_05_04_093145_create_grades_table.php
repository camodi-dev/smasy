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
    Schema::create('grades', function (Blueprint $table) {
        $table->id();
        $table->foreignId('student_id')->constrained()->onDelete('cascade');
        $table->foreignId('enrollment_id')->constrained()->onDelete('cascade');
        $table->foreignId('exam_id')->constrained()->onDelete('cascade');
        $table->decimal('score', 5, 2)->default(0);
        $table->decimal('max_score', 5, 2)->default(100);
        $table->string('grade_letter')->nullable();
        $table->string('remarks')->nullable();
        $table->unique(['student_id', 'exam_id']);
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};
