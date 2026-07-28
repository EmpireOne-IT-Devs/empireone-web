<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE engagement_post_event_questions MODIFY type VARCHAR(50) NULL");

        DB::statement("ALTER TABLE engagement_post_event_surveys MODIFY status VARCHAR(20) NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE engagement_post_event_questions MODIFY type ENUM('Paragraph','Multiple Choice','Checkbox','Rating') NULL");
        DB::statement("ALTER TABLE engagement_post_event_surveys MODIFY status ENUM('Open','Closed') NULL");
    }
};
