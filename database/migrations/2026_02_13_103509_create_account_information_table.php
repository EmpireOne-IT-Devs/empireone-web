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
        Schema::create('account_information', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            // employee information
            $table->string('work_type')->default('Full Time');
            $table->string('eogs_email')->nullable();
            $table->string('employee_id')->nullable();
            // personal information
            $table->string('first_name')->nullable();
            $table->string('middle_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('suffix')->nullable();
            $table->string('gender')->nullable();
            $table->string('date_of_birth')->nullable();
            $table->string('birth_place')->nullable();
            $table->string('nationality')->nullable();
            $table->string('marital_status')->nullable();
            // address
            $table->string('province')->nullable();
            $table->string('city')->nullable();
            $table->string('barangay')->nullable();
            $table->string('street')->nullable();
            $table->string('zip_code')->nullable();
            // government information
            $table->string('government_id_type')->nullable();
            $table->string('id_number')->nullable();
            $table->string('sss')->nullable();
            $table->string('tin')->nullable();
            $table->string('philhealth')->nullable();
            $table->string('pagibig')->nullable();
            // education background
            $table->string('highest_level_of_education')->nullable();
            $table->string('school_name')->nullable();
            $table->string('course')->nullable();
            $table->string('year_graduated')->nullable();
            $table->string('awards')->nullable();
            $table->string('status')->nullable();
            // contact information
            $table->string('phone_number1')->nullable();
            $table->string('phone_number2')->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_number')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('account_information');
    }
};
