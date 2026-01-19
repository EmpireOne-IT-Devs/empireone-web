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
        Schema::create('job_postings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('department');
            $table->string('location');
            $table->enum('employment_type', ['full-time', 'part-time', 'contract', 'temporary', 'internship']);
            $table->decimal('salary', 10, 2)->nullable();
            $table->string('status');
            $table->date('application_deadline')->nullable();
            $table->text('description');
            $table->text('requirements')->nullable();
            $table->string('experience_required')->nullable();
            $table->string('education_required')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_postings');
    }
};
