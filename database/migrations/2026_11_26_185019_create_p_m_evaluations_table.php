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
        Schema::create('p_m_evaluations', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('employee_id')->nullable();
            $table->bigInteger('evaluator_id')->nullable();
            $table->string('position')->nullable();
            $table->string('evaluation_type')->nullable();
            $table->json('scores')->nullable();
            $table->decimal('average_score', 4, 2)->default(0.00);

            $table->enum('decision', [
                'Regularize',
                'Non-Regularize',
                'Extend',
            ])->nullable();

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

            $table->boolean('is_supervisor_approved')->default(0);
            $table->boolean('is_manager_approved')->default(0);
            $table->boolean('is_hr_approved')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('p_m_evaluations');
    }
};
