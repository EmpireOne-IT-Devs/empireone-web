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
        Schema::create('reward_challenge_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reward_challenge_id')
                ->constrained('reward_challenges')
                ->cascadeOnDelete();
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->string('status', 30)->default('joined');
            $table->timestamp('joined_at')->nullable();
            $table->timestamps();

            $table->unique(['reward_challenge_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reward_challenge_participants');
    }
};
