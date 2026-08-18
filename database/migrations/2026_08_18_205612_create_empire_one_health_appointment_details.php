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
        Schema::create('empire_one_health_appointment_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('appointment_id')->nullable();
            $table->string('company_name')->nullable();
            $table->string('source')->nullable();
            $table->string('looking_for')->nullable();
            $table->string('privacy_policy_agreed')->default('false');
            $table->foreign('appointment_id')->references('id')->on('empire_one_health_bookings')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('empire_one_health_appointment_details');
    }
};
