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
        Schema::create('job_offers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->foreignId('job_application_id')
                ->nullable()
                ->constrained('job_applications')
                ->nullOnDelete();
            $table->string('salary')->nullable();
            $table->string('role')->nullable();
            $table->longText('declined_reason')->nullable();
            $table->enum('status', [
                'Pending',
                'Accepted',
                'Declined',
                'Re-Offered'
            ])->default('Pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_offers');
    }
};
