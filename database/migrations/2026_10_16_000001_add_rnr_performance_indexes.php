<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const INDEXES = [
        'engagement_reward_challenge_participants' => [
            'erc_participants_status_submitted_idx' => ['status', 'submitted_at'],
        ],
        'engagement_reward_challenge_daily_logs' => [
            'erc_daily_logs_status_date_idx' => ['status', 'log_date'],
        ],
        'engagement_reward_challenge_team_submissions' => [
            'erc_team_sub_status_submitted_idx' => ['status', 'submitted_at'],
        ],
    ];

    public function up(): void
    {
        foreach (self::INDEXES as $tableName => $indexes) {
            if (! Schema::hasTable($tableName)) {
                continue;
            }

            foreach ($indexes as $name => $columns) {
                if (Schema::hasIndex($tableName, $name) || ! Schema::hasColumns($tableName, $columns)) {
                    continue;
                }

                Schema::table($tableName, fn (Blueprint $table) => $table->index($columns, $name));
            }
        }
    }

    public function down(): void
    {
        foreach (self::INDEXES as $tableName => $indexes) {
            if (! Schema::hasTable($tableName)) {
                continue;
            }

            foreach (array_keys($indexes) as $name) {
                if (Schema::hasIndex($tableName, $name)) {
                    Schema::table($tableName, fn (Blueprint $table) => $table->dropIndex($name));
                }
            }
        }
    }
};
