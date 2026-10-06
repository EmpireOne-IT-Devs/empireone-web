<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * One row per day a participant submits proof for a multi-day challenge.
     * The unique index guarantees (at the database level, not just in app
     * code) that a participant can never have two submissions for the same
     * calendar day, which is what makes "missed day 2? just move on to day 3"
     * safe without any race-condition risk.
     */
    public function up(): void
    {
        if (Schema::hasTable('engagement_reward_challenge_daily_logs')) {
            return;
        }

        Schema::create('engagement_reward_challenge_daily_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reward_challenge_participant_id')
                ->constrained('engagement_reward_challenge_participants', 'id', 'erc_daily_logs_participant_id_foreign')
                ->cascadeOnDelete();
            $table->date('log_date');
            $table->string('submission_path');
            $table->text('challenge_description')->nullable();
            $table->string('status', 30)->default('submitted');
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('review_note')->nullable();
            $table->timestamps();

            $table->unique(
                ['reward_challenge_participant_id', 'log_date'],
                'erc_daily_logs_participant_date_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('engagement_reward_challenge_daily_logs');
    }
};
