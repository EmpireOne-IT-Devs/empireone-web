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
        Schema::create('job_requisitions', function (Blueprint $table) {
            $table->id();

            $table->string('requisition_id')->unique()->nullable();
            $table->string('position_type');
            $table->string('position_title');
            $table->string('department');
            $table->string('location');
            $table->string('employment_type');
            $table->integer('number_of_positions');
            $table->string('priority');
            $table->string('salary_range');
            $table->date('target_start_date');
            $table->string('justification_for_position');
            $table->string('required_qualifications');
            $table->string('key_responsibilities');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_requisitions');
    }
};