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
            $table->foreignId('department_id')
                ->constrained('departments')
                ->nullOnDelete();
            $table->foreignId('location_id')
                ->constrained('locations')
                ->nullOnDelete();
            $table->foreignId('account_id')
                ->nullable()
                ->constrained('accounts')
                ->nullOnDelete();
            $table->foreignId('user_id')
                ->constrained('users')
                ->nullOnDelete();
            $table->foreignId('site_id')
                ->constrained('sites')
                ->nullOnDelete();
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
                'Urgent'
            ])->default('Low');
            $table->string('salary_range')->nullable();
            $table->date('target_start_date')->nullable();
            $table->string('interviewer')->nullable();
            $table->string('sub_interviewer')->nullable();
            $table->date('interview_date')->nullable();
            $table->text('interview_time')->nullable();
            $table->text('justification_for_position')->nullable();
            $table->text('qualifications')->nullable();
            $table->text('responsibilities')->nullable();
            $table->enum('status', [
                'Pending',
                'In Progress',
                'Approved',
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
