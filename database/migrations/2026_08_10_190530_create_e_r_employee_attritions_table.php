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
        Schema::create('e_r_employee_attritions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->foreignId('employee_id')
                ->nullable()
                ->constrained('account_employees')
                ->nullOnDelete();
            $table->string('position')->nullable();
            $table->string('department')->nullable();
            $table->string('account')->nullable();
            $table->string('eogs_email')->nullable();
            $table->string('started_at')->nullable();
            $table->date('separation_date')->nullable();
            $table->enum('status', [
                'Probationary',
                'Regular',
                'Contractual',
            ])->nullable();
            $table->enum('employment_status', [
                'Terminated',
                'Resigned',
                'EOPE',
            ])->nullable();
            $table->longText('reason_for_separation')->nullable();
            $table->enum('is_rehire', [
                'Yes',
                'No',
            ])->nullable();
            $table->enum('attrition_status', [
                'Pending',
                'For Exit Interview',
                'For Exit Clearance',
                'Cleared',
                'Quit Claimed',
                'Done',
            ])->default('Pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('e_r_employee_attritions');
    }
};
