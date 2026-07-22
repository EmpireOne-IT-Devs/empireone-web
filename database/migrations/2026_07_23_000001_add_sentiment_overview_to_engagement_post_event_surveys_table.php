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
        Schema::table('engagement_post_event_surveys', function (Blueprint $table) {
            if (!Schema::hasColumn('engagement_post_event_surveys', 'sentiment_overview')) {
                $table->json('sentiment_overview')->nullable()->after('status');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('engagement_post_event_surveys', function (Blueprint $table) {
            if (Schema::hasColumn('engagement_post_event_surveys', 'sentiment_overview')) {
                $table->dropColumn('sentiment_overview');
            }
        });
    }
};
