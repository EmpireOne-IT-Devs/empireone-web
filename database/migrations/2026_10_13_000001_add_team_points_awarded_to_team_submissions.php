<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('engagement_reward_challenge_team_submissions', 'team_points_awarded')) {
            Schema::table('engagement_reward_challenge_team_submissions', function (Blueprint $table) {
                $table->unsignedInteger('team_points_awarded')->default(0)->after('status');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('engagement_reward_challenge_team_submissions', 'team_points_awarded')) {
            Schema::table('engagement_reward_challenge_team_submissions', function (Blueprint $table) {
                $table->dropColumn('team_points_awarded');
            });
        }
    }
};
