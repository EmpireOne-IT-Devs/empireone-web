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
        Schema::create('p_m_corrective_actions', function (Blueprint $table) {
            $table->id();
            // Employee Info
            $table->unsignedBigInteger('user_id')->nullable()->index();
            $table->string('employee_id')->index();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('eogs_email')->nullable()->index();
            $table->boolean('is_employee_acknowledge')->default(0);
            $table->date('nte_received_at')->nullable();

            $table->unsignedBigInteger('department_id')->nullable()->index();

            $table->unsignedBigInteger('hr_user_id')->nullable()->index();
            $table->string('hr_id')->nullable()->index();
            $table->string('hr_first_name')->nullable();
            $table->string('hr_last_name')->nullable();
            $table->string('hr_email')->nullable();
            $table->boolean('is_hr_acknowledge')->default(0);
            // Immediate Supervisor Info
            $table->unsignedBigInteger('supervisor_user_id')->nullable()->index();
            $table->string('supervisor_id')->nullable()->index();
            $table->string('supervisor_first_name')->nullable();
            $table->string('supervisor_last_name')->nullable();
            $table->string('supervisor_email')->nullable();
            $table->boolean('is_supervisor_acknowledge')->default(0);

            // Next Level Manager Info
            $table->unsignedBigInteger('manager_user_id')->nullable()->index();
            $table->string('manager_id')->nullable()->index();
            $table->string('manager_first_name')->nullable();
            $table->string('manager_last_name')->nullable();
            $table->string('manager_email')->nullable();
            $table->boolean('is_manager_acknowledge')->default(0);


            
            $table->boolean('is_hr_sanction_acknowledge')->default(0);
            $table->boolean('is_supervisor_sanction_acknowledge')->default(0);
            $table->boolean('is_manager_sanction_acknowledge')->default(0);
            // ----------------------------------------------------
            // 2. INFRACTION DETAILS
            // ----------------------------------------------------
            $table->text('category')->nullable();
            $table->json('code_of_discipline_section')->nullable(); // e.g., 1.1, 1.2
            $table->date('date_of_occurrence')->nullable();
            $table->text('description_of_infraction')->nullable();

            // ----------------------------------------------------
            // 3. SUPPORTING DOCUMENTS / EVIDENCE
            // ----------------------------------------------------
            $table->text('evidence_drive_url')->nullable();

            // ----------------------------------------------------
            // 4. STATUS & WORKFLOW TRACKING
            // ----------------------------------------------------
            $table->enum('status', [
                'PENDING',
                'PENDING EMPLOYEE EXPLANATION',
                'PENDING FINAL SANCTION',
                'PENDING EMPLOYEE COMMITMENT',
                'COMPLETED',
            ])->default('PENDING');

            $table->date('date_issued')->nullable();
            $table->text('employee_explanation')->nullable();
            $table->date('employee_explanation_at')->nullable();
            $table->text('final_sanction')->nullable();
            $table->text('employee_commitment')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('p_m_corrective_actions');
    }
};
