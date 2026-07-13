<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('engagement_post_event_files', function (Blueprint $table) {
            $table->dropColumn('file');
            $table->string('name')->nullable()->after('engagement_post_event_id');
            $table->string('url')->nullable()->after('name');
        });
    }

    public function down(): void
    {
        Schema::table('engagement_post_event_files', function (Blueprint $table) {
            $table->dropColumn(['name', 'url']);
            $table->text('file')->nullable();
        });
    }
};
