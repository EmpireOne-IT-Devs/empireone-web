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
        Schema::create('job_requisition_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_requisitions_id')
                ->constrained('job_requisitions')
                ->nullOnDelete();
            $table->foreignId('user_id')
                ->constrained('users')
                ->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_requisition_logs');
    }
};
