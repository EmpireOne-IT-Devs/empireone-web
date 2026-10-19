<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('engagement_reward_challenges', 'survey_required')) {
            Schema::table('engagement_reward_challenges', function (Blueprint $table) {
                $table->boolean('survey_required')->default(false);
            });
        }

        if (! Schema::hasColumn('engagement_post_event_surveys', 'reward_challenge_id')) {
            Schema::table('engagement_post_event_surveys', function (Blueprint $table) {
                $table->foreignId('reward_challenge_id')->nullable()
                    ->constrained('engagement_reward_challenges', indexName: 'epe_survey_challenge_fk')
                    ->cascadeOnDelete();
                $table->unique('reward_challenge_id', 'epe_survey_challenge_unique');
            });
        }

        Schema::table('engagement_reward_challenge_participants', function (Blueprint $table) {
            if (! Schema::hasColumn('engagement_reward_challenge_participants', 'proof_approved_at')) {
                $table->timestamp('proof_approved_at')->nullable();
            }
            if (! Schema::hasColumn('engagement_reward_challenge_participants', 'survey_points_awarded')) {
                $table->unsignedInteger('survey_points_awarded')->default(0);
            }
            if (! Schema::hasColumn('engagement_reward_challenge_participants', 'survey_rewarded_at')) {
                $table->timestamp('survey_rewarded_at')->nullable();
            }
        });

        if (! Schema::hasColumn('engagement_post_event_survey_responses', 'reward_challenge_participant_id')) {
            Schema::table('engagement_post_event_survey_responses', function (Blueprint $table) {
                $table->foreignId('reward_challenge_participant_id')->nullable()
                    ->constrained('engagement_reward_challenge_participants', indexName: 'epe_response_participant_fk')
                    ->cascadeOnDelete();
                $table->unique('reward_challenge_participant_id', 'epe_response_participant_unique');
            });
        }
    }

    public function down(): void
    {
        // Remove challenge-only surveys before dropping the discriminator used by event routes.
        DB::table('engagement_post_event_surveys')->whereNotNull('reward_challenge_id')->delete();

        Schema::table('engagement_post_event_survey_responses', function (Blueprint $table) {
            $table->dropUnique('epe_response_participant_unique');
            $table->dropForeign(['reward_challenge_participant_id'])->index('epe_response_participant_fk');
            $table->dropColumn('reward_challenge_participant_id');
        });

        Schema::table('engagement_reward_challenge_participants', function (Blueprint $table) {
            $table->dropColumn(['proof_approved_at', 'survey_points_awarded', 'survey_rewarded_at']);
        });

        Schema::table('engagement_post_event_surveys', function (Blueprint $table) {
            $table->dropUnique('epe_survey_challenge_unique');
            $table->dropForeign(['reward_challenge_id'])->index('epe_survey_challenge_fk');
            $table->dropColumn('reward_challenge_id');
        });

        Schema::table('engagement_reward_challenges', function (Blueprint $table) {
            $table->dropColumn('survey_required');
        });
    }
};
