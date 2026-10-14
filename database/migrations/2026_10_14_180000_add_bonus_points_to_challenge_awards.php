<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('engagement_reward_challenge_participants', 'bonus_points')) {
            Schema::table('engagement_reward_challenge_participants', function (Blueprint $table) {
                $table->unsignedInteger('bonus_points')->default(0);
            });
        }

        if (! Schema::hasColumn('engagement_reward_challenge_daily_logs', 'bonus_points')) {
            Schema::table('engagement_reward_challenge_daily_logs', function (Blueprint $table) {
                $table->unsignedInteger('bonus_points')->default(0);
            });
        }

        if (! Schema::hasColumn('engagement_reward_challenge_team_submissions', 'base_points_awarded')) {
            Schema::table('engagement_reward_challenge_team_submissions', function (Blueprint $table) {
                $table->unsignedInteger('base_points_awarded')->default(0);
            });
        }

        if (! Schema::hasColumn('engagement_reward_challenge_team_submissions', 'bonus_points_awarded')) {
            Schema::table('engagement_reward_challenge_team_submissions', function (Blueprint $table) {
                $table->unsignedInteger('bonus_points_awarded')->default(0);
            });
        }

        DB::table('engagement_reward_challenge_team_submissions')
            ->where('team_points_awarded', '>', 0)
            ->where('base_points_awarded', 0)
            ->update(['base_points_awarded' => DB::raw('team_points_awarded')]);
    }

    public function down(): void
    {
        Schema::table('engagement_reward_challenge_team_submissions', function (Blueprint $table) {
            $table->dropColumn(['base_points_awarded', 'bonus_points_awarded']);
        });
        Schema::table('engagement_reward_challenge_daily_logs', function (Blueprint $table) {
            $table->dropColumn('bonus_points');
        });
        Schema::table('engagement_reward_challenge_participants', function (Blueprint $table) {
            $table->dropColumn('bonus_points');
        });
    }
};
