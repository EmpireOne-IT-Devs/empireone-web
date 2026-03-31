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
        Schema::create('account_contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->string('employee_name')->nullable();
            $table->string('employer_name')->nullable();
            $table->string('contract_signed_at')->nullable();
            $table->string('residence')->nullable();
            $table->string('province')->nullable();
            $table->text('full_address')->nullable();
            $table->string('position')->nullable();
            $table->string('started_at')->nullable();
            $table->string('ended_at')->nullable();
            $table->decimal('salary', 15, 2)->default(0.00);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('account_contracts');
    }
};
