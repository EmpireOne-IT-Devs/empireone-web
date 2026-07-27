<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('company_galleries') && !Schema::hasTable('engagement_company_galleries')) {
            Schema::create('engagement_company_galleries', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('title');
                $table->text('description')->nullable();
                $table->string('drive_link', 1000)->nullable();
                $table->timestamps();
            });
        }

        if (Schema::hasTable('engagement_post_event_files')) {
            Schema::table('engagement_post_event_files', function (Blueprint $table) {
                if (!Schema::hasColumn('engagement_post_event_files', 'company_gallery_id')) {
                    $table->foreignId('company_gallery_id')->nullable()->after('engagement_post_event_id')->constrained('engagement_company_galleries')->nullOnDelete();
                }
            });

            if (Schema::hasColumn('engagement_post_event_files', 'engagement_post_event_id')) {
                DB::statement('ALTER TABLE engagement_post_event_files MODIFY engagement_post_event_id BIGINT UNSIGNED NULL');
            }
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('engagement_post_event_files')) {
            Schema::table('engagement_post_event_files', function (Blueprint $table) {
                if (Schema::hasColumn('engagement_post_event_files', 'company_gallery_id')) {
                    $table->dropForeign(['company_gallery_id']);
                    $table->dropColumn('company_gallery_id');
                }
            });

            if (Schema::hasColumn('engagement_post_event_files', 'engagement_post_event_id')) {
                DB::statement('ALTER TABLE engagement_post_event_files MODIFY engagement_post_event_id BIGINT UNSIGNED NOT NULL');
            }
        }

        if (Schema::hasTable('engagement_company_galleries')) {
            Schema::dropIfExists('engagement_company_galleries');
        }
    }
};
