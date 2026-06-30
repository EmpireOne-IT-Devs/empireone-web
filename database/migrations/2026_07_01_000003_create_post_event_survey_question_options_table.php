<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('post_event_survey_question_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_event_survey_question_id')
                ->constrained('post_event_survey_questions', 'id', 'fk_pes_q_options_question')
                ->cascadeOnDelete();
            $table->string('option_text');
            $table->unsignedTinyInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_event_survey_question_options');
    }
};
