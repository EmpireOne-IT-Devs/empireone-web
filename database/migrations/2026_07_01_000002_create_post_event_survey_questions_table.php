<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('post_event_survey_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_event_survey_id')
                ->constrained('post_event_surveys')
                ->cascadeOnDelete();
            $table->text('question_text');
            $table->enum('question_type', [
                'short_answer',
                'paragraph',
                'multiple_choice',
                'checkboxes',
                'dropdown',
                'rating',
            ])->default('short_answer');
            $table->boolean('is_required')->default(false);
            $table->unsignedTinyInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_event_survey_questions');
    }
};
