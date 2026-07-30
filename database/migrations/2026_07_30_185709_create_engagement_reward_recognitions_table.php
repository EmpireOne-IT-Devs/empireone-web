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
        Schema::create('engagement_reward_recognitions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('employee_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->enum('award_category', [
                'Employee of the Month',
                'Innovation Award',
                'Rising Star Award',
                'Team Excellence Award',
                'Customer Champion Award',
                'Mentor of the Quarter',
            ])->nullable();

            $table->enum('company_value', [
                'Innovation',
                'Teamwork',
                'Excellence',
                'Leadership',
                'Customer Focus',
                'Integrity',
                'Resilience',
                'Creativity',
            ])->nullable();

            $table->text('message')->nullable();

            $table->unsignedBigInteger('engagement_post_event_reacts_id')->nullable();

            $table->enum('status', [
                'draft',
                'published',
                'archived',
            ])->default('published');

            $table->timestamp('published_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('engagement_reward_recognitions');
    }
};
