<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('attendance_corrections')) {
            return;
        }

        Schema::create('attendance_corrections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('date');

            // Shift 1 corrections
            $table->dateTime('time_in_correction')->nullable();
            $table->dateTime('time_out_correction')->nullable();
            $table->dateTime('clock_in_correction')->nullable();
            $table->dateTime('clock_out_correction')->nullable();
            $table->dateTime('break_start_correction')->nullable();
            $table->dateTime('break_end_correction')->nullable();

            // Manually added break times (Shift 1)
            $table->dateTime('break1_start')->nullable();
            $table->dateTime('break1_end')->nullable();
            $table->dateTime('break2_start')->nullable();
            $table->dateTime('break2_end')->nullable();
            $table->dateTime('break3_start')->nullable();
            $table->dateTime('break3_end')->nullable();

            // Shift 2 corrections
            $table->dateTime('time_in_2_correction')->nullable();
            $table->dateTime('time_out_2_correction')->nullable();
            $table->dateTime('clock_in_2_correction')->nullable();
            $table->dateTime('clock_out_2_correction')->nullable();
            $table->dateTime('shift2_break1_start')->nullable();
            $table->dateTime('shift2_break1_end')->nullable();
            $table->dateTime('shift2_break2_start')->nullable();
            $table->dateTime('shift2_break2_end')->nullable();
            $table->dateTime('shift2_break3_start')->nullable();
            $table->dateTime('shift2_break3_end')->nullable();

            $table->text('reason')->nullable();

            // pending -> endorsed -> granted, or declined at either stage
            $table->string('status')->default('pending');
            $table->foreignId('endorsed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->dateTime('endorsed_at')->nullable();
            $table->foreignId('granted_by')->nullable()->constrained('users')->nullOnDelete();
            $table->dateTime('granted_at')->nullable();
            $table->foreignId('declined_by')->nullable()->constrained('users')->nullOnDelete();
            $table->dateTime('declined_at')->nullable();
            $table->text('supervisor_note')->nullable();
            $table->text('accounting_note')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_corrections');
    }
};
