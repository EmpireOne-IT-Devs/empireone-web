<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const AWARD_CATEGORIES = [
        'Reliability',
        'Excellence',
        'Adaptability',
        'Collaboration',
        'Integrity',
        'The Excellence Award',
        'The One Team Award',
        'The Empathy Award',
        'The Initiative Award',
        'The Innovation Award',
        'The Customer Champion',
        'The Integrity Award',
        'The Ownership Award',
    ];

    public function up(): void
    {
        DB::table('engagement_reward_recognitions')
            ->whereNotNull('award_category')
            ->whereNotIn('award_category', self::AWARD_CATEGORIES)
            ->update(['award_category' => null]);

        $categories = implode("','", self::AWARD_CATEGORIES);

        DB::statement(
            "ALTER TABLE engagement_reward_recognitions MODIFY award_category ENUM('{$categories}') NULL"
        );
    }

    public function down(): void
    {
        DB::statement(
            'ALTER TABLE engagement_reward_recognitions MODIFY award_category VARCHAR(255) NULL'
        );
    }
};