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
        Schema::create('engagement_post_events', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->text('content')->nullable();
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->string('type')->nullable();
            $table->string('headline')->nullable();
            $table->text('message')->nullable();
            $table->string('media_path')->nullable();
            $table->string('media_type')->nullable();
            $table->string('month')->nullable();
            $table->integer('year')->nullable();
            $table->string('publish_to')->nullable();
            $table->dateTime('scheduled_at')->nullable();
            $table->dateTime('published_at')->nullable();
            $table->dateTime('closed_at')->nullable();
            $table->string('drive_link', 1000)->nullable();
            $table->enum('category', [ 
                'Event',
                'News',
                'Milestone',
                'Announcement',
            ])->nullable()->default(null);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('engagement_post_events');
    }
};
