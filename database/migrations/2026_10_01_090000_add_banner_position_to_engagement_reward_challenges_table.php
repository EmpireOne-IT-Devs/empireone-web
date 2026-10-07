<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
<<<<<<< HEAD
        Schema::table('reward_challenges', function (Blueprint $table) {
=======
        if (Schema::hasColumn('engagement_reward_challenges', 'banner_position_x')) {
            return;
        }

        Schema::table('engagement_reward_challenges', function (Blueprint $table) {
>>>>>>> ee74639a975809531219679036422d75324acf70
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
