<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('engagement_post_event_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('engagement_post_event_question_id')
                ->nullable()
                ->constrained(
                    table: 'engagement_post_event_questions',
                    indexName: 'epe_answers_epe_question_id_foreign' // Custom, shorter name
                )
                ->nullOnDelete();
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->text('answer')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('engagement_post_event_answers');
    }
};
