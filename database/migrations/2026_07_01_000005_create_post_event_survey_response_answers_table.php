<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('post_event_survey_response_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_event_survey_response_id')
                ->constrained('post_event_survey_responses', 'id', 'fk_pesra_response')
                ->cascadeOnDelete();
            $table->foreignId('post_event_survey_question_id')
                ->constrained('post_event_survey_questions', 'id', 'fk_pesra_question')
                ->cascadeOnDelete();
            $table->text('answer_text')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_event_survey_response_answers');
    }
};
