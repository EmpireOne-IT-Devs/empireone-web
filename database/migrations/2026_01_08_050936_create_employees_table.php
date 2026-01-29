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
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('app_id')
                ->nullable()
                ->constrained('personal_infos')
                ->nullOnDelete();
            $table->foreignId('employee_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->string('position')->nullable();
            $table->string('department')->nullable();
            $table->string('account')->nullable();
            $table->string('supervisor')->nullable();
            $table->string('hired_date')->nullable();
            $table->string('eogs_email')->nullable();
            $table->string('status')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
