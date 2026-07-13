<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Relax the question type from a fixed enum to a string so it can hold
        // all survey question types (short_answer, paragraph, multiple_choice,
        // checkboxes, dropdown, rating) migrated from the activities module.
        DB::statement("ALTER TABLE engagement_post_event_questions MODIFY type VARCHAR(50) NULL");

        // Survey status likewise needs to hold published/closed.
        DB::statement("ALTER TABLE engagement_post_event_surveys MODIFY status VARCHAR(20) NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE engagement_post_event_questions MODIFY type ENUM('Paragraph','Multiple Choice','Checkbox','Rating') NULL");
        DB::statement("ALTER TABLE engagement_post_event_surveys MODIFY status ENUM('Open','Closed') NULL");
    }
};
