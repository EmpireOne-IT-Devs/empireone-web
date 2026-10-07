<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('engagement_post_event_files')) {
            return;
        }

        Schema::table('engagement_post_event_files', function (Blueprint $table) {
            if (! Schema::hasColumn('engagement_post_event_files', 'engagement_e_store_id')) {
                $table->foreignId('engagement_e_store_id')
                    ->nullable()
                    ->after('company_gallery_id')
                    ->constrained('engagement_e_stores')
                    ->cascadeOnDelete();
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('engagement_post_event_files')) {
            return;
        }

        Schema::table('engagement_post_event_files', function (Blueprint $table) {
            if (Schema::hasColumn('engagement_post_event_files', 'engagement_e_store_id')) {
                $table->dropConstrainedForeignId('engagement_e_store_id');
            }
        });
    }
};

