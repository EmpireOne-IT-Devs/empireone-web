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
        if (Schema::hasTable('p_m_reaches')) {
            return;
        }

        Schema::create('p_m_reaches', function (Blueprint $table) {
            $table->id();
            // Employee Information
            $table->unsignedBigInteger('supervisor_user_id')->nullable();
            $table->bigInteger('created_by')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('employee_id')->nullable();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('employee_email')->nullable();

            // Supervisor Information
            $table->unsignedBigInteger('supervisor_id')->nullable();
            $table->string('supervisor_first_name')->nullable();
            $table->string('supervisor_last_name')->nullable();
            $table->string('supervisor_email')->nullable();

            // Session General Details
            $table->foreignId('account_id')->constrained('accounts')->cascadeOnDelete();
            $table->date('date_of_session')->nullable();

            // Recognition & Opportunity
            $table->text('recognition_statement_1')->nullable();
            $table->text('recognition_statement_2')->nullable();
            $table->text('recognition_statement_3')->nullable();
            $table->text('area_of_opportunity')->nullable();

            // Performance Evaluation
            $table->string('kpi')->nullable();
            $table->string('actual_metric')->nullable();
            $table->string('goal_target')->nullable();
            $table->text('biggest_rock')->nullable();
            $table->text('behavioral_root_cause')->nullable();

            // Action Plan
            $table->text('smart_goal')->nullable();
            $table->string('task_name')->nullable();
            $table->text('task_description')->nullable();
            $table->date('due_date')->nullable();
            $table->string('frequency')->nullable(); // e.g., 'Daily', 'Weekly'

            // Commitment
            $table->text('employee_commitment')->nullable();
            $table->text('leader_commitment')->nullable();

            // Handoff & Follow-up
            $table->date('next_follow_up_date')->nullable();
            $table->text('follow_up_notes')->nullable();

            // Status tracking
            $table->enum('status', ['PENDING', 'ACKNOWLEDGED'])->default('PENDING')->nullable();

            // Indexes for faster lookups & analytics
            $table->index('employee_id')->nullable();
            $table->index('supervisor_id')->nullable();
            $table->index('date_of_session')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('p_m_reaches');
    }
};
