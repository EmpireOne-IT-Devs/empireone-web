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
        Schema::create('job_requisitions', function (Blueprint $table) {
            $table->id();

            // Foreign Keys (Must be nullable if using nullOnDelete)
            $table->foreignId('department_id')
                ->nullable()
                ->constrained('departments')
                ->nullOnDelete();
            $table->foreignId('location_id')
                ->nullable()
                ->constrained('locations')
                ->nullOnDelete();
            $table->foreignId('account_id')
                ->nullable()
                ->constrained('accounts')
                ->nullOnDelete();
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->foreignId('site_id')
                ->nullable()
                ->constrained('sites')
                ->nullOnDelete();
            $table->foreignId('recruiter_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('approver1_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('approver2_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->foreignId('approver3_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            // References an existing job requisition (for extra headcount)
            $table->unsignedBigInteger('existing_position_id')->nullable();

            // Job Details
            $table->string('type')->nullable();
            $table->string('title')->nullable();
            $table->enum('employment_type', [
                'Full-time',
                'Part-time',
                'Contract',
                'Temporary',
            ])->default('Full-time');
            $table->integer('number_of_positions')->nullable();
            $table->enum('priority', [
                'Low',
                'Medium',
                'High',
            ])->default('Low');
            $table->string('salary_range')->nullable();
            $table->date('target_start_date')->nullable();



            // Classifications & Audiences
            $table->string('erf_classification')->nullable();
            $table->string('target_audience')->nullable();

            // Interviewer Details (Mapped from frontend)
            $table->string('interviewer1')->nullable();
            $table->string('availability1')->nullable(); // Updated
            $table->string('interview_time1')->nullable(); // Updated
            $table->string('interviewer2')->nullable();
            $table->string('availability2')->nullable();
            $table->string('interview_time2')->nullable();

            // Text Areas
            $table->text('justification_for_position')->nullable();
            $table->text('qualifications')->nullable();
            $table->text('responsibilities')->nullable();

            // Status
            $table->enum('status', [
                'Pending',
                'In Progress',
                'Director Approved',
                'Final Approved',
                'Posted',
                'Declined'
            ])->default('Pending');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_requisitions');
    }
};
