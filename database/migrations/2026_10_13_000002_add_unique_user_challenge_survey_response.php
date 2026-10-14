<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const INDEX = 'epe_response_survey_user_unique';

    public function up(): void
    {
        if (Schema::hasIndex('engagement_post_event_survey_responses', self::INDEX)) {
            return;
        }

        $hasDuplicateResponses = DB::table('engagement_post_event_survey_responses')
            ->select('engagement_post_event_survey_id', 'user_id')
            ->whereNotNull('engagement_post_event_survey_id')
            ->whereNotNull('user_id')
            ->groupBy('engagement_post_event_survey_id', 'user_id')
            ->havingRaw('COUNT(*) > 1')
            ->exists();

        if ($hasDuplicateResponses) {
            throw new RuntimeException(
                'Duplicate survey responses already exist for the same user and survey. Resolve them before applying this migration.',
            );
        }

        Schema::table('engagement_post_event_survey_responses', function (Blueprint $table) {
            $table->unique(
                ['engagement_post_event_survey_id', 'user_id'],
                self::INDEX,
            );
        });
    }

    public function down(): void
    {
        if (Schema::hasIndex('engagement_post_event_survey_responses', self::INDEX)) {
            Schema::table('engagement_post_event_survey_responses', function (Blueprint $table) {
                $table->dropUnique(self::INDEX);
            });
        }
    }
};
