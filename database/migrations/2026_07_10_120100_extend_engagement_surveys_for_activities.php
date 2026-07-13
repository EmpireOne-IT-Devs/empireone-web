<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Extend surveys with title/description/publishing metadata.
        Schema::table('engagement_post_event_surveys', function (Blueprint $table) {
            if (! Schema::hasColumn('engagement_post_event_surveys', 'user_id')) {
                $table->foreignId('user_id')->nullable()->after('engagement_post_event_id')
                    ->constrained('users')->nullOnDelete();
            }
            if (! Schema::hasColumn('engagement_post_event_surveys', 'title')) {
                $table->string('title')->nullable()->after('user_id');
            }
            if (! Schema::hasColumn('engagement_post_event_surveys', 'description')) {
                $table->text('description')->nullable()->after('title');
            }
            if (! Schema::hasColumn('engagement_post_event_surveys', 'published_at')) {
                $table->dateTime('published_at')->nullable()->after('description');
            }
        });

        // Extend questions with survey link, ordering + required flag.
        Schema::table('engagement_post_event_questions', function (Blueprint $table) {
            if (! Schema::hasColumn('engagement_post_event_questions', 'engagement_post_event_survey_id')) {
                $table->foreignId('engagement_post_event_survey_id')->nullable()->after('engagement_post_event_id')
                    ->constrained('engagement_post_event_surveys', indexName: 'epe_q_survey_id_foreign')
                    ->cascadeOnDelete();
            }
            if (! Schema::hasColumn('engagement_post_event_questions', 'is_required')) {
                $table->boolean('is_required')->default(false)->after('type');
            }
            if (! Schema::hasColumn('engagement_post_event_questions', 'sort_order')) {
                $table->integer('sort_order')->default(0)->after('is_required');
            }
        });

        // Dedicated option rows for choice-type questions.
        if (! Schema::hasTable('engagement_post_event_question_options')) {
            Schema::create('engagement_post_event_question_options', function (Blueprint $table) {
                $table->id();
                $table->foreignId('engagement_post_event_question_id')->nullable()
                    ->constrained('engagement_post_event_questions', indexName: 'epe_qopt_question_id_foreign')
                    ->cascadeOnDelete();
                $table->string('option_text');
                $table->integer('sort_order')->default(0);
                $table->timestamps();
            });
        }

        // One response per user per survey (groups the answers).
        if (! Schema::hasTable('engagement_post_event_survey_responses')) {
            Schema::create('engagement_post_event_survey_responses', function (Blueprint $table) {
                $table->id();
                $table->foreignId('engagement_post_event_survey_id')->nullable()
                    ->constrained('engagement_post_event_surveys', indexName: 'epe_sresp_survey_id_foreign')
                    ->cascadeOnDelete();
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->dateTime('submitted_at')->nullable();
                $table->timestamps();
            });
        }

        // Link answers to a response.
        Schema::table('engagement_post_event_answers', function (Blueprint $table) {
            if (! Schema::hasColumn('engagement_post_event_answers', 'engagement_post_event_survey_response_id')) {
                $table->foreignId('engagement_post_event_survey_response_id')->nullable()->after('id')
                    ->constrained('engagement_post_event_survey_responses', indexName: 'epe_ans_response_id_foreign')
                    ->cascadeOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('engagement_post_event_answers', function (Blueprint $table) {
            $table->dropConstrainedForeignId('engagement_post_event_survey_response_id');
        });
        Schema::dropIfExists('engagement_post_event_survey_responses');
        Schema::dropIfExists('engagement_post_event_question_options');

        Schema::table('engagement_post_event_questions', function (Blueprint $table) {
            $table->dropConstrainedForeignId('engagement_post_event_survey_id');
            $table->dropColumn(['is_required', 'sort_order']);
        });

        Schema::table('engagement_post_event_surveys', function (Blueprint $table) {
            $table->dropConstrainedForeignId('user_id');
            $table->dropColumn(['title', 'description', 'published_at']);
        });
    }
};
