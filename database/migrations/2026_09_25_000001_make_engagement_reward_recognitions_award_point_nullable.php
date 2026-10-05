<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Some environments' create-table migration predates `award_point`
        // being added to that file, so the column may not exist yet here.
        if (! Schema::hasColumn('engagement_reward_recognitions', 'award_point')) {
            Schema::table('engagement_reward_recognitions', function (Blueprint $table) {
                $table->string('award_point')->nullable();
            });

            return;
        }

        DB::statement(
            'ALTER TABLE engagement_reward_recognitions MODIFY award_point VARCHAR(255) NULL'
        );
    }

    public function down(): void
    {
        DB::statement(
            'ALTER TABLE engagement_reward_recognitions MODIFY award_point VARCHAR(255) NOT NULL'
        );
    }
};