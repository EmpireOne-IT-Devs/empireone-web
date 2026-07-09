<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_post_reactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_post_id')
                ->constrained('activity_posts')
                ->cascadeOnDelete();
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->string('type')->default('heart'); // extensible for future types
            $table->timestamps();

            $table->unique(['activity_post_id', 'user_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_post_reactions');
    }
};
