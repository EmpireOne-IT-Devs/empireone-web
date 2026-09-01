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
        Schema::create('e_r_exit_interviews', function (Blueprint $table) {
            $table->id();

            // Foreign Key Link to Attrition Record
            $table->foreignId('e_r_employee_attrition_id')
                ->nullable()
                ->constrained('e_r_employee_attritions')
                ->nullOnDelete();

            // Page 1 Essay Answers & Checklist
            $table->text('main_reason_for_leaving')->nullable(); // Question 1
            $table->json('factors_leaving')->nullable();         // Question 2 (JSON array e.g. ["pay", "supervisor"])
            $table->text('wish_had_known')->nullable();          // Question 3
            $table->text('suggestions_for_management')->nullable(); // Question 4
            $table->text('appropriate_support')->nullable();     // Question 5
            $table->json('ratings')->nullable();
            $table->longText('employee_signature')->nullable();
            $table->string('conducted_by')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('e_r_exit_interviews');
    }
};
