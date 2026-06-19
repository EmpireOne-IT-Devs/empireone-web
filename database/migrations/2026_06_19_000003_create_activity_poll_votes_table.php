<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_poll_votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_post_id')
                ->constrained('activity_posts')
                ->cascadeOnDelete();
            $table->foreignId('activity_poll_option_id')
                ->constrained('activity_poll_options')
                ->cascadeOnDelete();
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->timestamps();

            // One vote per user per poll — enforced at DB level.
            $table->unique(['activity_post_id', 'user_id'], 'unique_vote_per_user');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_poll_votes');
    }
};
