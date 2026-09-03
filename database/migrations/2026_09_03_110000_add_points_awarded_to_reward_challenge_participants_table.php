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
        Schema::table('reward_challenge_participants', function (Blueprint $table) {
            $table->unsignedInteger('points_awarded')->nullable()->after('review_note');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reward_challenge_participants', function (Blueprint $table) {
            $table->dropColumn('points_awarded');
        });
    }
};
