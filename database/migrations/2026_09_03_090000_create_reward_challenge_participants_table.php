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
        Schema::create('engagement_reward_challenge_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reward_challenge_id')
                ->constrained('engagement_reward_challenges', 'id', 'erc_participants_reward_challenge_id_foreign')
                ->cascadeOnDelete();
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->string('status', 30)->default('joined');
            $table->timestamp('joined_at')->nullable();
            $table->timestamps();

            $table->unique(['reward_challenge_id', 'user_id'], 'erc_participants_challenge_user_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('engagement_reward_challenge_participants');
    }
};
