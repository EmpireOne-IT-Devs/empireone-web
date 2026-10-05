<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('overtime_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->dateTime('start_at');
            $table->dateTime('end_at');
            $table->integer('overtime_minutes')->default(0);
            $table->text('remark')->nullable();
            // pending -> endorsed -> approved, or declined at either stage
            $table->string('status')->default('pending');
            $table->foreignId('endorsed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->dateTime('endorsed_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->dateTime('approved_at')->nullable();
            $table->foreignId('declined_by')->nullable()->constrained('users')->nullOnDelete();
            $table->dateTime('declined_at')->nullable();
            $table->text('supervisor_note')->nullable();
            $table->text('accounting_note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('overtime_requests');
    }
};
