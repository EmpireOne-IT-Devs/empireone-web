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
        Schema::create('ticketings', function (Blueprint $table) {
            $table->id();
            $table->string('ticketing_id')->unique();
            $table->foreignId('ticket_category_id')->constrained('ticketing_categories')->cascadeOnDelete();
            $table->foreignId('location_id')->constrained('locations')->cascadeOnDelete();
            $table->foreignId('site_id')->constrained('sites')->cascadeOnDelete();
            $table->foreignId('department_id')->constrained('departments')->cascadeOnDelete();
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->text('details');
            $table->string('assigned_to')->nullable();
            $table->enum('status', [
                'pending',
                'inprogress',
                'resolved',
                'closed'
            ])->default('pending');

            $table->enum('urgent_type', [
                'Low Priority',
                'Medium Priority',
                'High Priority',
                'Critical Priority'
            ])->default('Low Priority');

            $table->timestamp('start_at')->nullable();
            $table->timestamp('end_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ticketings');
    }
};
