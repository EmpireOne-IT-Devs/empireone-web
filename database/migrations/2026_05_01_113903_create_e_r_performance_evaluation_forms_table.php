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
        Schema::create('e_r_performance_evaluation_forms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->foreignId('supervisor_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->boolean('has_supervisor_signature')->default(false);
            $table->date('date_of_assessment')->nullable();
            $table->text('remarks')->nullable();
            $table->decimal('section1_average', 5, 2)->nullable();
            $table->decimal('section2_average', 5, 2)->nullable();
            $table->decimal('total_average', 5, 2)->nullable();
            $table->text('recommendation')->nullable();
            $table->string('evaluation_period')->nullable();
            $table->enum('status', [
                'Pending',
                'Passed',
                'Failed',
            ])->default('Pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('e_r_performance_evaluation_forms');
    }
};
