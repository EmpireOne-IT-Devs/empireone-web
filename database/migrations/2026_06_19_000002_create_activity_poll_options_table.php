<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_poll_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_post_id')
                ->constrained('activity_posts')
                ->cascadeOnDelete();
            $table->string('label');
            $table->unsignedTinyInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_poll_options');
    }
};
