<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const TABLE = 'engagement_reward_challenge_daily_logs';

    private const ORIGINAL_INDEX = 'erc_daily_logs_participant_date_unique';

    private const INDIVIDUAL_INDEX = 'erc_daily_individual_date_unique';

    private const TEAM_INDEX = 'erc_daily_team_date_unique';

    public function up(): void
    {
        if (! Schema::hasTable(self::TABLE) || ! Schema::hasColumn(self::TABLE, 'team_submission_id')) {
            return;
        }

        if (Schema::hasIndex(self::TABLE, self::ORIGINAL_INDEX)) {
            Schema::table(self::TABLE, fn (Blueprint $table) => $table->dropUnique(self::ORIGINAL_INDEX));
        }

        $missingColumns = array_values(array_filter(
            ['individual_log_date', 'team_log_date'],
            fn ($column) => ! Schema::hasColumn(self::TABLE, $column),
        ));

        if ($missingColumns !== []) {
            Schema::table(self::TABLE, function (Blueprint $table) use ($missingColumns) {
                if (in_array('individual_log_date', $missingColumns, true)) {
                    $table->date('individual_log_date')
                        ->virtualAs('CASE WHEN team_submission_id IS NULL THEN log_date ELSE NULL END');
                }

                if (in_array('team_log_date', $missingColumns, true)) {
                    $table->date('team_log_date')
                        ->virtualAs('CASE WHEN team_submission_id IS NOT NULL THEN log_date ELSE NULL END');
                }
            });
        }

        if (! Schema::hasIndex(self::TABLE, self::INDIVIDUAL_INDEX)) {
            Schema::table(self::TABLE, fn (Blueprint $table) => $table->unique(
                ['reward_challenge_participant_id', 'individual_log_date'],
                self::INDIVIDUAL_INDEX,
            ));
        }

        if (! Schema::hasIndex(self::TABLE, self::TEAM_INDEX)) {
            Schema::table(self::TABLE, fn (Blueprint $table) => $table->unique(
                ['reward_challenge_participant_id', 'team_log_date'],
                self::TEAM_INDEX,
            ));
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable(self::TABLE)) {
            return;
        }

        $hasIndividualLogDate = Schema::hasColumn(self::TABLE, 'individual_log_date');
        $hasTeamLogDate = Schema::hasColumn(self::TABLE, 'team_log_date');
        if (! $hasIndividualLogDate && ! $hasTeamLogDate) {
            return;
        }

        $duplicateParticipantDates = DB::table(self::TABLE)
            ->select('reward_challenge_participant_id', 'log_date')
            ->groupBy('reward_challenge_participant_id', 'log_date')
            ->havingRaw('COUNT(*) > 1')
            ->exists();

        if ($duplicateParticipantDates) {
            throw new RuntimeException(
                'Cannot restore the shared daily-log uniqueness index while team and individual logs share a date.',
            );
        }

        foreach ([self::INDIVIDUAL_INDEX, self::TEAM_INDEX] as $index) {
            if (Schema::hasIndex(self::TABLE, $index)) {
                Schema::table(self::TABLE, fn (Blueprint $table) => $table->dropUnique($index));
            }
        }

        $columnsToDrop = array_values(array_filter(
            ['individual_log_date', 'team_log_date'],
            fn ($column) => Schema::hasColumn(self::TABLE, $column),
        ));
        Schema::table(self::TABLE, fn (Blueprint $table) => $table->dropColumn($columnsToDrop));

        if (! Schema::hasIndex(self::TABLE, self::ORIGINAL_INDEX)) {
            Schema::table(self::TABLE, fn (Blueprint $table) => $table->unique(
                ['reward_challenge_participant_id', 'log_date'],
                self::ORIGINAL_INDEX,
            ));
        }
    }
};
