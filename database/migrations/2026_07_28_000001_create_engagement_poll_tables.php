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
        if (! Schema::hasTable('engagement_poll_options')) {
            Schema::create('engagement_poll_options', function (Blueprint $table) {
                $table->id();
                $table->foreignId('engagement_post_event_id')
                    ->constrained('engagement_post_events')
                    ->cascadeOnDelete();
                $table->string('label');
                $table->integer('sort_order')->default(0);
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('engagement_poll_votes')) {
            Schema::create('engagement_poll_votes', function (Blueprint $table) {
                $table->id();
                $table->foreignId('engagement_post_event_id')
                    ->constrained('engagement_post_events')
                    ->cascadeOnDelete();
                $table->foreignId('engagement_poll_option_id')
                    ->constrained('engagement_poll_options')
                    ->cascadeOnDelete();
                $table->foreignId('user_id')
                    ->nullable()
                    ->constrained('users')
                    ->nullOnDelete();
                $table->timestamps();

                $table->unique(['engagement_post_event_id', 'user_id']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('engagement_poll_votes');
        Schema::dropIfExists('engagement_poll_options');
    }
};
