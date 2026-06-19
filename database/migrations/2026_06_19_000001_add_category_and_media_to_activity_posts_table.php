<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('activity_posts', function (Blueprint $table) {
            $table->string('category')->default('General')->after('type');
            $table->string('media_path')->nullable()->after('message');
            $table->string('media_type')->nullable()->after('media_path'); // 'photo' | 'video'
        });
    }

    public function down(): void
    {
        Schema::table('activity_posts', function (Blueprint $table) {
            $table->dropColumn(['category', 'media_path', 'media_type']);
        });
    }
};
