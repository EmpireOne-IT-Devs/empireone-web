<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Snapshot the required day count at join time (so editing a challenge
     * later never changes the target for employees already participating),
     * and track an incrementing counter of approved days. Keeping a running
     * counter means completion checks are a single indexed comparison
     * (completed_days >= required_days) instead of a COUNT() over logs.
     */
    public function up(): void
    {
        if (Schema::hasColumn('engagement_reward_challenge_participants', 'required_days')) {
            return;
        }

        Schema::table('engagement_reward_challenge_participants', function (Blueprint $table) {
            $table->unsignedSmallInteger('required_days')->nullable()->after('points_awarded');
            $table->unsignedSmallInteger('completed_days')->default(0)->after('required_days');
        });
    }

    public function down(): void
    {
        Schema::table('engagement_reward_challenge_participants', function (Blueprint $table) {
            $table->dropColumn(['required_days', 'completed_days']);
        });
    }
};
