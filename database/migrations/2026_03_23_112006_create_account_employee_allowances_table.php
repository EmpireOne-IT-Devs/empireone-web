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
        Schema::create('account_employee_allowances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->foreignId('job_offer_id')
                ->nullable()
                ->constrained('job_offers')
                ->nullOnDelete();
            $table->string('allowance')->nullable();
            $table->string('allowance_type')->nullable();
            $table->enum('status', [
                'Pending',
                'Accepted',
                'Re-Offered',
                'Declined',
            ])->default('Pending');
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('account_employee_allowances');
    }
};
