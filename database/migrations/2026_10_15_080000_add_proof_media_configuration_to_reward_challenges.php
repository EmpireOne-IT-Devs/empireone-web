<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('engagement_reward_challenges')
            && ! Schema::hasColumn('engagement_reward_challenges', 'proof_type')) {
            Schema::table('engagement_reward_challenges', function (Blueprint $table) {
                $table->string('proof_type', 30)->default('photo_only');
            });
        }

        foreach ([
            'engagement_reward_challenge_participants',
            'engagement_reward_challenge_daily_logs',
            'engagement_reward_challenge_team_submissions',
        ] as $tableName) {
            if (Schema::hasTable($tableName) && ! Schema::hasColumn($tableName, 'submission_media')) {
                Schema::table($tableName, function (Blueprint $table) {
                    $table->json('submission_media')->nullable();
                });
            }
        }
    }

    public function down(): void
    {
        foreach ([
            'engagement_reward_challenge_participants',
            'engagement_reward_challenge_daily_logs',
            'engagement_reward_challenge_team_submissions',
        ] as $tableName) {
            if (Schema::hasTable($tableName) && Schema::hasColumn($tableName, 'submission_media')) {
                Schema::table($tableName, function (Blueprint $table) {
                    $table->dropColumn('submission_media');
                });
            }
        }

        if (Schema::hasTable('engagement_reward_challenges')
            && Schema::hasColumn('engagement_reward_challenges', 'proof_type')) {
            Schema::table('engagement_reward_challenges', function (Blueprint $table) {
                $table->dropColumn('proof_type');
            });
        }
    }
};
