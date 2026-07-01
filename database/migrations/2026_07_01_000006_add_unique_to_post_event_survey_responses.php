<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('post_event_survey_responses', function (Blueprint $table) {
            $table->unique(
                ['post_event_survey_id', 'user_id'],
                'unique_survey_response_per_user'
            );
        });
    }

    public function down(): void
    {
        Schema::table('post_event_survey_responses', function (Blueprint $table) {
            $table->dropUnique('unique_survey_response_per_user');
        });
    }
};
