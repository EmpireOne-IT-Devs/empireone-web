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
        Schema::create('p_m_pips', function (Blueprint $table) {
            $table->id();

            // Employee Details
            $table->bigInteger('created_by')->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete(); // The user who created the PIP
            $table->string('employee_id')->nullable()->index();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('position')->nullable();
            $table->string('employee_email')->nullable();
            $table->string('account')->nullable();

            // Leadership Details
            $table->string('supervisor_id')->nullable();
            $table->string('supervisor_user_id')->nullable();
            $table->string('supervisor_name')->nullable();
            $table->string('supervisor_email')->nullable();

            $table->string('manager_id')->nullable();
            $table->string('manager_user_id')->nullable();
            $table->string('manager_name')->nullable();
            $table->string('manager_email')->nullable();

            $table->string('hr_user_id')->nullable();
            $table->string('hr_id')->nullable();
            $table->string('hr_first_name')->nullable();
            $table->string('hr_last_name')->nullable();
            $table->string('hr_email')->nullable();

            $table->boolean('is_hr_approved')->nullable();
            $table->boolean('is_manager_approved')->nullable();
            $table->boolean('is_supervisor_approved')->nullable();
            $table->boolean('is_employee_acknowledged')->nullable();


            $table->boolean('is_passed')->nullable();
            $table->string('sanction')->nullable();

            
            $table->boolean('is_hr_final_approved')->nullable();
            $table->boolean('is_manager_final_approved')->nullable();
            $table->boolean('is_supervisor_final_approved')->nullable();
            $table->boolean('is_employee_final_acknowledged')->nullable();

            $table->longText('action_notes')->nullable();

            // PIP Cycle & Dates
            $table->date('pip_start_date')->nullable();
            $table->date('pip_end_date')->nullable();
            $table->string('pip_cycle')->nullable(); // e.g., 'PIP 1', 'PIP 2', 'PIP 3'

            // 1. Employee Performance History
            $table->string('history_kpi')->nullable();
            $table->string('history_target')->nullable();
            $table->string('history_actual')->nullable();

            // 2. Reasons for Performance Challenges (Root Cause Analysis)
            $table->text('root_cause_analysis')->nullable();

            // 3. Action Plan (S.M.A.R.T.)
            $table->string('action_kpi_goal')->nullable();
            $table->string('action_target_action')->nullable();
            $table->date('action_date')->nullable();

            // Optional metadata for system tracking
            $table->string('status')->default('Pending')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('p_m_pips');
    }
};
