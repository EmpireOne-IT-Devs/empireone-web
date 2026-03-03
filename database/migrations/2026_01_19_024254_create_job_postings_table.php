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
        Schema::create('job_postings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_requisition_id')
                ->nullable()
                ->constrained('job_requisitions')
                ->nullOnDelete();
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->enum('status', [
                'Active',
                'Closed',
                'Draft',
            ])->default('Active');
            $table->date('application_deadline')->nullable();
            $table->string('experience_required')->nullable();
            $table->string('education_required')->nullable();
            $table->enum('target_audience', [
                'Both',
                'Internal',
                'External',
            ])->default('Both');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_postings');
    }
};
