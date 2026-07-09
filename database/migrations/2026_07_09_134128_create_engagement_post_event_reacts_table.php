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
        Schema::create('engagement_post_event_reacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('engagement_post_event_id')
                ->nullable()
                ->constrained('engagement_post_events')
                ->nullOnDelete();
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->enum('react', [
                'Like',
                'Heart',
                'Sad',
                'Angry',
                'Happy',
                'Care',
            ])->default(null);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('engagement_post_event_reacts');
    }
};
