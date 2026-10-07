<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Adds optional multi-day support to challenges. When `duration_days` is
     * null or 1, a challenge behaves exactly as before (single proof photo).
     * When greater than 1, employees may submit one proof per calendar day
     * for that many days (see engagement_reward_challenge_daily_logs).
     */
    public function up(): void
    {
        if (Schema::hasColumn('engagement_reward_challenges', 'duration_days')) {
            return;
        }

        Schema::table('engagement_reward_challenges', function (Blueprint $table) {
            $table->unsignedSmallInteger('duration_days')->nullable()->after('points');
        });
    }

    public function down(): void
    {
        Schema::table('engagement_reward_challenges', function (Blueprint $table) {
            $table->dropColumn('duration_days');
        });
    }
};
