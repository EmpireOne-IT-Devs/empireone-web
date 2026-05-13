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
        Schema::create('job_a_i_interview_qnas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_a_i_interview_id')
                ->nullable()
                ->constrained('job_a_i_interviews')
                ->nullOnDelete();
            $table->text('question');
            $table->text('answer_video_url')->nullable();
            $table->text('user_answer')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_a_i_interview_qnas');
    }
};
