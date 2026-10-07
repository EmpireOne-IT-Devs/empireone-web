<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Store the full punch date+time (not just time-of-day) so shifts that
     * cross midnight (24/7 operations) keep the correct calendar date.
     */
    public function up(): void
    {
        // The follow-up migration (split_attendance_datetime_columns) later
        // drops these columns entirely, so skip if that's already happened.
        if (! Schema::hasColumn('attendances', 'clock_in')) {
            return;
        }

        DB::statement('ALTER TABLE attendances MODIFY clock_in DATETIME NULL');
        DB::statement('ALTER TABLE attendances MODIFY break_start DATETIME NULL');
        DB::statement('ALTER TABLE attendances MODIFY break_end DATETIME NULL');
        DB::statement('ALTER TABLE attendances MODIFY clock_out DATETIME NULL');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE attendances MODIFY clock_in TIME NULL');
        DB::statement('ALTER TABLE attendances MODIFY break_start TIME NULL');
        DB::statement('ALTER TABLE attendances MODIFY break_end TIME NULL');
        DB::statement('ALTER TABLE attendances MODIFY clock_out TIME NULL');
    }
};
