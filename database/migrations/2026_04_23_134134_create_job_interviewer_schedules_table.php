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
        Schema::create('job_interviewer_schedules', function (Blueprint $table) {
            $table->id();
             $table->foreignId('interviewer_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->integer('day_of_week_from');
            $table->integer('day_of_week_to');
            $table->time('start_time');
            $table->time('end_time');
            $table->time('break_time_start');
            $table->time('break_time_end');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_interviewer_schedules');
    }
};
