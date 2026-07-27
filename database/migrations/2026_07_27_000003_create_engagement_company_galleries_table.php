<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('engagement_company_galleries')) {
            Schema::create('engagement_company_galleries', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('title');
                $table->text('description')->nullable();
                $table->string('drive_link', 1000)->nullable();
                $table->timestamps();
            });
        }

        if (Schema::hasTable('engagement_post_event_files') && Schema::hasColumn('engagement_post_event_files', 'company_gallery_id')) {
            try {
                Schema::table('engagement_post_event_files', function (Blueprint $table) {
                    try {
                        $table->dropForeign(['company_gallery_id']);
                    } catch (\Throwable $e) {
                        // ignore
                    }

                    $table->foreign('company_gallery_id')
                        ->nullable()
                        ->references('id')
                        ->on('engagement_company_galleries')
                        ->nullOnDelete();
                });
            } catch (\Throwable $e) {
                // ignore
            }
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('engagement_post_event_files') && Schema::hasColumn('engagement_post_event_files', 'company_gallery_id')) {
            try {
                Schema::table('engagement_post_event_files', function (Blueprint $table) {
                    try {
                        $table->dropForeign(['company_gallery_id']);
                    } catch (\Throwable $e) {
                        // ignore
                    }

                    $table->foreign('company_gallery_id')
                        ->nullable()
                        ->references('id')
                        ->on('company_galleries')
                        ->nullOnDelete();
                });
            } catch (\Throwable $e) {
                // ignore
            }
        }

        Schema::dropIfExists('engagement_company_galleries');
    }
};
