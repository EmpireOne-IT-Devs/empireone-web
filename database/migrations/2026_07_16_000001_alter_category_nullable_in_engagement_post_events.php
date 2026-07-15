<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('engagement_post_events', function (Blueprint $table) {
            $table->enum('category', [
                'Event',
                'News',
                'Milestone',
                'Announcement',
            ])->nullable()->default(null)->change();
        });
    }

    public function down(): void
    {
        Schema::table('engagement_post_events', function (Blueprint $table) {
            $table->enum('category', [
                'Event',
                'News',
                'Milestone',
                'Announcement',
            ])->nullable(false)->default('Event')->change();
        });
    }
};
