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
        $tableName = 'engagement_reward_challenge_participants';
        $missing = fn (string $column) => ! Schema::hasColumn($tableName, $column);

        Schema::table($tableName, function (Blueprint $table) use ($missing) {
            if ($missing('submission_path')) {
                $table->string('submission_path')->nullable()->after('status');
            }
            if ($missing('challenge_description')) {
                $table->text('challenge_description')->nullable();
            }
            if ($missing('submitted_at')) {
                $table->timestamp('submitted_at')->nullable();
            }
            if ($missing('reviewed_at')) {
                $table->timestamp('reviewed_at')->nullable();
            }
            if ($missing('reviewed_by')) {
                $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            }
            if ($missing('review_note')) {
                $table->text('review_note')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('engagement_reward_challenge_participants', function (Blueprint $table) {
            $table->dropConstrainedForeignId('reviewed_by');
            $table->dropColumn(['submission_path', 'challenge_description', 'submitted_at', 'reviewed_at', 'review_note']);
        });
    }
};
