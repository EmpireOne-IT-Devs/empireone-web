<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('coe_requests', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('employee_id')->nullable();
            $table->string('purpose');
            $table->timestamp('requested_at')->index();
            $table->timestamps();

            $table->index(['user_id', 'requested_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coe_requests');
    }
};
