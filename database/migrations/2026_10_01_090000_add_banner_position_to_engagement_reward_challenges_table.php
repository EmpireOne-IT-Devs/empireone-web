
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (
            Schema::hasColumn(
                'engagement_reward_challenges',
                'banner_position_x'
            ) &&
            Schema::hasColumn(
                'engagement_reward_challenges',
                'banner_position_y'
            )
        ) {
            return;
        }

        Schema::table('engagement_reward_challenges', function (Blueprint $table) {
            if (!Schema::hasColumn('engagement_reward_challenges', 'banner_position_x')) {
                $table->unsignedTinyInteger('banner_position_x')
                    ->default(50)
                    ->after('banner_path');
            }

            if (!Schema::hasColumn('engagement_reward_challenges', 'banner_position_y')) {
                $table->unsignedTinyInteger('banner_position_y')
                    ->default(50)
                    ->after('banner_position_x');
            }
        });
    }

    public function down(): void
    {
        Schema::table('engagement_reward_challenges', function (Blueprint $table) {
            $table->dropColumn([
                'banner_position_x',
                'banner_position_y',
            ]);
        });
    }
};
