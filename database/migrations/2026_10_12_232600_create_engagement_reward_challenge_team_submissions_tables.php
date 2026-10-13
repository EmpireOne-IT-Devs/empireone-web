<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('engagement_reward_challenge_team_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reward_challenge_id')
                ->constrained('engagement_reward_challenges', 'id', 'erc_tsub_challenge_fk')
                ->cascadeOnDelete();
            $table->foreignId('leader_id')
                ->constrained('users', 'id', 'erc_tsub_leader_fk')
                ->cascadeOnDelete();
            $table->date('log_date');
            $table->string('submission_path');
            $table->text('challenge_description');
            $table->string('status', 30)->default('submitted');
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('reviewed_by')
                ->nullable()
                ->constrained('users', 'id', 'erc_tsub_reviewer_fk')
                ->nullOnDelete();
            $table->text('review_note')->nullable();
            $table->timestamps();

            $table->unique(
                ['reward_challenge_id', 'leader_id', 'log_date'],
                'erc_team_submissions_challenge_leader_date_unique'
            );
            $table->index(['status', 'submitted_at'], 'erc_team_submissions_review_index');
        });

        Schema::create('engagement_reward_challenge_team_submission_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_submission_id')
                ->constrained('engagement_reward_challenge_team_submissions', 'id', 'erc_tsm_submission_fk')
                ->cascadeOnDelete();
            $table->foreignId('participant_id')
                ->constrained('engagement_reward_challenge_participants', 'id', 'erc_tsm_participant_fk')
                ->cascadeOnDelete();
            $table->foreignId('user_id')
                ->constrained('users', 'id', 'erc_tsm_user_fk')
                ->cascadeOnDelete();
            $table->string('full_name');
            $table->string('eoid')->nullable();
            $table->foreignId('department_id')
                ->nullable()
                ->constrained('departments', 'id', 'erc_tsm_department_fk')
                ->nullOnDelete();
            $table->string('department_name')->nullable();
            $table->foreignId('account_id')
                ->nullable()
                ->constrained('accounts', 'id', 'erc_tsm_account_fk')
                ->nullOnDelete();
            $table->string('account_name')->nullable();
            $table->foreignId('location_id')
                ->nullable()
                ->constrained('locations', 'id', 'erc_tsm_location_fk')
                ->nullOnDelete();
            $table->timestamps();

            $table->unique(
                ['team_submission_id', 'user_id'],
                'erc_team_submission_members_unique'
            );
            $table->index(['location_id', 'team_submission_id'], 'erc_team_submission_members_location_index');
        });

        Schema::table('engagement_reward_challenge_daily_logs', function (Blueprint $table) {
            $table->foreignId('team_submission_id')
                ->nullable()
                ->after('reward_challenge_participant_id')
                ->constrained('engagement_reward_challenge_team_submissions', 'id', 'erc_dlog_team_submission_fk')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('engagement_reward_challenge_daily_logs', function (Blueprint $table) {
            if (Schema::getConnection()->getDriverName() === 'sqlite') {
                $table->dropForeign(['team_submission_id']);
            } else {
                $table->dropForeign('erc_dlog_team_submission_fk');
            }

            $table->dropColumn('team_submission_id');
        });

        Schema::dropIfExists('engagement_reward_challenge_team_submission_members');
        Schema::dropIfExists('engagement_reward_challenge_team_submissions');
    }
};
