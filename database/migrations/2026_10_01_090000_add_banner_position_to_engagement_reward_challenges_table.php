<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
<<<<<<< HEAD
        if (Schema::hasColumn('engagement_reward_challenges', 'banner_position_x')) {
            return;
        }

        Schema::table('engagement_reward_challenges', function (Blueprint $table) {
=======
        Schema::table('reward_challenges', function (Blueprint $table) {
>>>>>>> 1cf99bb73e23fbc2e602b1f571bb8159a728e723
            $table->unsignedTinyInteger('banner_position_x')->default(50)->after('banner_path');
            $table->unsignedTinyInteger('banner_position_y')->default(50)->after('banner_position_x');
        });
    }

    public function down(): void
    {
        Schema::table('reward_challenges', function (Blueprint $table) {
            $table->dropColumn(['banner_position_x', 'banner_position_y']);
        });
    }
};
