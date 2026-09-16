<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('engagement_post_event_reacts', function (Blueprint $table) {
            $table->foreignId('engagement_reward_recognition_id')
                ->nullable()
                ->after('engagement_post_event_id')
                ->constrained('engagement_reward_recognitions')
                ->nullOnDelete()
                ->name('reacts_reward_recognition_id_foreign');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('engagement_post_event_reacts', function (Blueprint $table) {
            $table->dropForeign('reacts_reward_recognition_id_foreign');
            $table->dropColumn('engagement_reward_recognition_id');
        });
    }
};
