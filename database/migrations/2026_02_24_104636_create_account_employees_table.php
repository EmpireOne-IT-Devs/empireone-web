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
        Schema::create('account_employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->foreignId('department_id')
                ->nullable()
                ->constrained('departments')
                ->nullOnDelete();
            $table->foreignId('account_id')
                ->nullable()
                ->constrained('accounts')
                ->nullOnDelete();
            $table->foreignId('site_id')
                ->nullable()
                ->constrained('sites')
                ->nullOnDelete();
            $table->foreignId('location_id')
                ->nullable()
                ->constrained('locations')
                ->nullOnDelete();
            $table->string('work_type')->default('Full Time');
            $table->string('eogs_email')->nullable();
            $table->string('employee_id')->nullable();
            $table->string('with_bpo')->nullable();
            $table->string('source')->nullable();
            $table->string('position')->nullable();
            $table->longText('signature')->nullable();
            $table->enum('status', [
                'Probationary',
                'Regualr',
                'AWOL',
                'Contractual',
                'End of Contract',
                'EOPE',
                'Extended Probationary',
                'Resigned',
                'Terminated',
                'Trainee Fallout',
            ])->default('Probationary');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('account_employees');
    }
};
