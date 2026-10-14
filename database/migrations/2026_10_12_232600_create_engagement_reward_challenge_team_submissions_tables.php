<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('engagement_reward_challenge_team_submissions')) {
            Schema::create('engagement_reward_challenge_team_submissions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('reward_challenge_id')
                    ->constrained('engagement_reward_challenges', 'id', 'erc_team_sub_challenge_fk')
                    ->cascadeOnDelete();
                $table->foreignId('leader_id')
                    ->constrained('users', 'id', 'erc_team_sub_leader_fk')
                    ->cascadeOnDelete();
                $table->date('log_date');
                $table->string('submission_path');
                $table->text('challenge_description')->nullable();
                $table->string('status', 30)->default('submitted');
                $table->timestamp('submitted_at')->useCurrent();
                $table->timestamp('reviewed_at')->nullable();
                $table->foreignId('reviewed_by')
                    ->nullable()
                    ->constrained('users', 'id', 'erc_team_sub_reviewer_fk')
                    ->nullOnDelete();
                $table->text('review_note')->nullable();
                $table->timestamps();

                $table->index(
                    ['reward_challenge_id', 'status'],
                    'erc_team_sub_challenge_status_idx',
                );
                $table->index(
                    ['leader_id', 'reward_challenge_id', 'log_date'],
                    'erc_team_sub_leader_challenge_date_idx',
                );
            });
        }

        if (! Schema::hasTable('engagement_reward_challenge_team_submission_members')) {
            Schema::create('engagement_reward_challenge_team_submission_members', function (Blueprint $table) {
                $table->id();
                $table->foreignId('team_submission_id')
                    ->constrained(
                        'engagement_reward_challenge_team_submissions',
                        'id',
                        'erc_team_member_submission_fk',
                    )
                    ->cascadeOnDelete();
                $table->foreignId('participant_id')
                    ->constrained('engagement_reward_challenge_participants', 'id', 'erc_team_member_participant_fk')
                    ->cascadeOnDelete();
                $table->foreignId('user_id')
                    ->constrained('users', 'id', 'erc_team_member_user_fk')
                    ->cascadeOnDelete();
                $table->string('full_name');
                $table->string('eoid')->nullable();
                $table->unsignedBigInteger('department_id')->nullable();
                $table->string('department_name')->nullable();
                $table->unsignedBigInteger('account_id')->nullable();
                $table->string('account_name')->nullable();
                $table->unsignedBigInteger('location_id')->nullable();
                $table->timestamps();

                $table->unique(
                    ['team_submission_id', 'user_id'],
                    'erc_team_member_submission_user_unique',
                );
                $table->index('participant_id', 'erc_team_member_participant_idx');
                $table->index('location_id', 'erc_team_member_location_idx');
            });
        }

        if (
            Schema::hasTable('engagement_reward_challenge_daily_logs')
            && ! Schema::hasColumn('engagement_reward_challenge_daily_logs', 'team_submission_id')
        ) {
            Schema::table('engagement_reward_challenge_daily_logs', function (Blueprint $table) {
                $table->foreignId('team_submission_id')
                    ->nullable()
                    ->constrained(
                        'engagement_reward_challenge_team_submissions',
                        'id',
                        'erc_daily_logs_team_submission_fk',
                    )
                    ->nullOnDelete();
            });
        }
    }

    public function down(): void
    {
        if (
            Schema::hasTable('engagement_reward_challenge_daily_logs')
            && Schema::hasColumn('engagement_reward_challenge_daily_logs', 'team_submission_id')
        ) {
            Schema::table('engagement_reward_challenge_daily_logs', function (Blueprint $table) {
                if (Schema::getConnection()->getDriverName() === 'sqlite') {
                    $table->dropForeign(['team_submission_id']);
                } else {
                    $table->dropForeign('erc_daily_logs_team_submission_fk');
                }

                $table->dropColumn('team_submission_id');
            });
        }

        Schema::dropIfExists('engagement_reward_challenge_team_submission_members');
        Schema::dropIfExists('engagement_reward_challenge_team_submissions');
    }
};
