<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Split each punch's combined datetime into separate date/time columns.
     */
    public function up(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->date('clock_in_date')->nullable()->after('clock_in');
            $table->time('clock_in_time')->nullable()->after('clock_in_date');
            $table->date('break_start_date')->nullable()->after('break_start');
            $table->time('break_start_time')->nullable()->after('break_start_date');
            $table->date('break_end_date')->nullable()->after('break_end');
            $table->time('break_end_time')->nullable()->after('break_end_date');
            $table->date('clock_out_date')->nullable()->after('clock_out');
            $table->time('clock_out_time')->nullable()->after('clock_out_date');
        });

        DB::statement('UPDATE attendances SET clock_in_date = DATE(clock_in), clock_in_time = TIME(clock_in) WHERE clock_in IS NOT NULL');
        DB::statement('UPDATE attendances SET break_start_date = DATE(break_start), break_start_time = TIME(break_start) WHERE break_start IS NOT NULL');
        DB::statement('UPDATE attendances SET break_end_date = DATE(break_end), break_end_time = TIME(break_end) WHERE break_end IS NOT NULL');
        DB::statement('UPDATE attendances SET clock_out_date = DATE(clock_out), clock_out_time = TIME(clock_out) WHERE clock_out IS NOT NULL');

        Schema::table('attendances', function (Blueprint $table) {
            $table->dropColumn(['clock_in', 'break_start', 'break_end', 'clock_out']);
        });
    }

    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dateTime('clock_in')->nullable();
            $table->dateTime('break_start')->nullable();
            $table->dateTime('break_end')->nullable();
            $table->dateTime('clock_out')->nullable();
        });

        DB::statement('UPDATE attendances SET clock_in = TIMESTAMP(clock_in_date, clock_in_time) WHERE clock_in_date IS NOT NULL');
        DB::statement('UPDATE attendances SET break_start = TIMESTAMP(break_start_date, break_start_time) WHERE break_start_date IS NOT NULL');
        DB::statement('UPDATE attendances SET break_end = TIMESTAMP(break_end_date, break_end_time) WHERE break_end_date IS NOT NULL');
        DB::statement('UPDATE attendances SET clock_out = TIMESTAMP(clock_out_date, clock_out_time) WHERE clock_out_date IS NOT NULL');

        Schema::table('attendances', function (Blueprint $table) {
            $table->dropColumn([
                'clock_in_date', 'clock_in_time',
                'break_start_date', 'break_start_time',
                'break_end_date', 'break_end_time',
                'clock_out_date', 'clock_out_time',
            ]);
        });
    }
};
