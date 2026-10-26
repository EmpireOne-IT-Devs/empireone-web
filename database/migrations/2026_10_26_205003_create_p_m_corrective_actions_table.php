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
            $table->string('name')->nullable();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('eogs_email')->nullable()->index();
            $table->unsignedBigInteger('department_id')->nullable()->index();

            // Immediate Supervisor Info
            $table->unsignedBigInteger('supervisor_user_id')->nullable()->index();
            $table->string('supervisor_id')->nullable()->index();
            $table->string('supervisor_first_name')->nullable();
            $table->string('supervisor_last_name')->nullable();
            $table->string('supervisor_email')->nullable();

            // Next Level Manager Info
            $table->unsignedBigInteger('manager_user_id')->nullable()->index();
            $table->string('manager_id')->nullable()->index();
            $table->string('manager_first_name')->nullable();
            $table->string('manager_last_name')->nullable();
            $table->string('manager_email')->nullable();

            // ----------------------------------------------------
            // 2. INFRACTION DETAILS
            // ----------------------------------------------------
            $table->text('category')->nullable();
            $table->string('code_of_discipline_section'); // e.g., 1.1, 1.2
            $table->date('date_of_occurrence');
            $table->text('description_of_infraction');

            // ----------------------------------------------------
            // 3. SUPPORTING DOCUMENTS / EVIDENCE
            // ----------------------------------------------------
            $table->text('evidence_drive_url')->nullable();

            // ----------------------------------------------------
            // 4. STATUS & WORKFLOW TRACKING
            // ----------------------------------------------------
            $table->enum('status', [
                'PENDING',
                'PENDING EMPLOYEE EXPLAINATION',
                'PENDING FINAL SANCTION',
                'PENDING EMPLOYEE COMMITTMENT',
                'COMPLETED',
            ])->default('PENDING');

            $table->date('date_issued')->nullable();
            $table->text('employee_explanation')->nullable();
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
