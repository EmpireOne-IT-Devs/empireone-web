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
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->foreignId('job_posting_id')
                ->nullable()
                ->constrained('job_postings')
                ->nullOnDelete();
            $table->enum('screening_status', [
                'New',
                'Conducted',
                'Screened Passed',
                'Screened Failed',
                'No Response',
            ])->default('New');
            $table->enum('interview_status', [
                'Scheduled',
                'Not Scheduled',
                'Passed',
                'Failed',
                'No Show',
            ]);
            $table->enum('final_status', [
                'Passed',
                'Failed',
                'Withdrawn',
                'Pooled',
                'Accepted Job Offer',
                'Hired',
                'Rejected',
                'No Show',
            ]);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};
