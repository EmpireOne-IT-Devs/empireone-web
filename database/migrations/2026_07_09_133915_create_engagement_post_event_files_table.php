<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Files table structure
        Schema::create('engagement_post_event_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('engagement_post_event_id')
                ->constrained('engagement_post_events')
                ->cascadeOnDelete();
            $table->string('name'); // Original file name (e.g. "team_photo.jpg")
            $table->string('url', 2048); // S3 URL to access the photo
            $table->timestamps();
        });

       
    }

    public function down(): void
    {
        Schema::dropIfExists('engagement_post_event_files');
        
    }
};