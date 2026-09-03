<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Reverts the account_employees.points column added in
     * 2026_09_03_100100 — employee reward points are tracked entirely
     * within the Engagement module (reward_challenge_participants.points_awarded)
     * to avoid touching the HR/Account module's schema.
     */
    public function up(): void
    {
        Schema::table('account_employees', function (Blueprint $table) {
            $table->dropColumn('points');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('account_employees', function (Blueprint $table) {
            $table->unsignedInteger('points')->default(0)->after('basic_pay');
        });
    }
};
