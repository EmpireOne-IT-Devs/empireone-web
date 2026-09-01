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
        Schema::create('e_r_exit_clearances', function (Blueprint $table) {
            $table->id();

            // Document Header Info
            $table->foreignId('e_r_employee_attrition_id')
                ->nullable()
                ->constrained('e_r_employee_attritions')
                ->nullOnDelete();
            $table->date('clearance_date')->nullable();

            // Department Sign-offs (Immediate Supervisor)
            $table->longText('supervisor_signature')->nullable();
            $table->date('supervisor_date_signed')->nullable();
            $table->decimal('supervisor_payables', 10, 2)->default(0.00)->nullable();

            // Department Sign-offs (Employee Dept. Head)
            $table->longText('dept_head_signature')->nullable();
            $table->date('dept_head_date_signed')->nullable();
            $table->decimal('dept_head_payables', 10, 2)->default(0.00)->nullable();

            // Department Sign-offs (IT Biometrics, Laptop)
            $table->longText('it_signature')->nullable();
            $table->date('it_date_signed')->nullable();
            $table->decimal('it_payables', 10, 2)->default(0.00)->nullable();

            // Department Sign-offs (HR / Admin)
            $table->longText('hr_signature')->nullable();
            $table->date('hr_date_signed')->nullable();
            $table->decimal('hr_payables', 10, 2)->default(0.00)->nullable();

            // Asset Checklists stored as JSON arrays
            $table->json('company_assets_and_retrieval')->nullable(); // e.g. ["Company ID and Badge", "Lanyard"]
            $table->json('computer_or_devices')->nullable();           // e.g. ["Camera/ Memory Stick"]
            $table->json('keys')->nullable();                          // e.g. ["Office", "Building"]
            $table->json('communications_and_equipment')->nullable();  // e.g. ["Headset", "Y-Jack"]

            // Final Confirmation
            $table->longText('employee_signature')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('e_r_exit_clearances');
    }
};
