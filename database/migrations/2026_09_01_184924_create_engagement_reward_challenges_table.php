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
        if (Schema::hasTable('engagement_reward_challenges')) {
            return;
        }

        Schema::create('engagement_reward_challenges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->string('title');
            $table->text('description');
            $table->string('type', 30);
            $table->string('category', 50);
            $table->unsignedInteger('points');
            $table->string('banner_path')->nullable();
            $table->boolean('all_employees')->default(true);
            $table->unsignedInteger('max_participants')->nullable();
            $table->date('start_date');
            $table->date('deadline');
            $table->string('card_color', 7)->default('#F59E0B');
            $table->string('status', 30)->default('published');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'start_date', 'deadline']);
        });

        Schema::create('engagement_account_reward_challenge', function (Blueprint $table) {
            $table->foreignId('account_id')
                ->constrained('accounts')
                ->cascadeOnDelete();
            $table->foreignId('reward_challenge_id')
                ->constrained('engagement_reward_challenges', 'id', 'earc_reward_challenge_id_foreign')
                ->cascadeOnDelete();
            $table->timestamps();

            $table->primary(['account_id', 'reward_challenge_id']);
        });

        Schema::create('engagement_department_reward_challenge', function (Blueprint $table) {
            $table->foreignId('department_id')
                ->constrained('departments')
                ->cascadeOnDelete();
            $table->foreignId('reward_challenge_id')
                ->constrained('engagement_reward_challenges', 'id', 'edrc_reward_challenge_id_foreign')
                ->cascadeOnDelete();
            $table->timestamps();

            $table->primary(['department_id', 'reward_challenge_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('engagement_department_reward_challenge');
        Schema::dropIfExists('engagement_account_reward_challenge');
        Schema::dropIfExists('engagement_reward_challenges');
    }
};
