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
        Schema::table('engagement_reward_recognitions', function (Blueprint $table) {
            $table->dropColumn('engagement_post_event_reacts_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('engagement_reward_recognitions', function (Blueprint $table) {
            $table->unsignedBigInteger('engagement_post_event_reacts_id')->nullable();
        });
    }
};
