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
        Schema::create('e_r_performance_evaluation_section2s', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('e_r_performance_evaluation_form_id')->nullable();
            $table->foreign('e_r_performance_evaluation_form_id', 'fk_sec1_form_id')
                ->references('id')
                ->on('e_r_performance_evaluation_forms')
                ->nullOnDelete();
            $table->text('requirements')->nullable();
            $table->text('description')->nullable();
            $table->decimal('rating', 5, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('e_r_performance_evaluation_section2s');
    }
};
