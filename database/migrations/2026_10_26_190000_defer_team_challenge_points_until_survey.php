<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('engagement_reward_challenge_team_submissions')) {
            return;
        }

        $addedColumns = [];
        foreach (['pending_base_points', 'pending_bonus_points'] as $column) {
            if (! Schema::hasColumn('engagement_reward_challenge_team_submissions', $column)) {
                $addedColumns[] = $column;
            }
        }

        if ($addedColumns !== []) {
            Schema::table('engagement_reward_challenge_team_submissions', function (Blueprint $table) use ($addedColumns) {
                foreach ($addedColumns as $column) {
                    $table->unsignedInteger($column)->default(0);
                }
            });
        } else {
            return;
        }

        $unansweredApprovedSubmissions = DB::table('engagement_reward_challenge_team_submissions as submissions')
            ->join('engagement_reward_challenges as challenges', 'challenges.id', '=', 'submissions.reward_challenge_id')
            ->where('challenges.survey_required', true)
            ->where('submissions.status', 'approved')
            ->where('submissions.team_points_awarded', '>', 0)
            ->whereNotExists(function ($query) {
                $query->selectRaw('1')
                    ->from('engagement_post_event_surveys as surveys')
                    ->join(
                        'engagement_post_event_survey_responses as responses',
                        'responses.engagement_post_event_survey_id',
                        '=',
                        'surveys.id',
                    )
                    ->whereColumn('surveys.reward_challenge_id', 'submissions.reward_challenge_id')
                    ->whereColumn('responses.user_id', 'submissions.leader_id')
                    ->whereNotNull('responses.submitted_at');
            })
            ->select([
                'submissions.id',
                'submissions.base_points_awarded',
                'submissions.bonus_points_awarded',
            ])
            ->get();

        foreach ($unansweredApprovedSubmissions as $submission) {
            DB::table('engagement_reward_challenge_team_submissions')
                ->where('id', $submission->id)
                ->update([
                    'pending_base_points' => $submission->base_points_awarded,
                    'pending_bonus_points' => $submission->bonus_points_awarded,
                    'base_points_awarded' => 0,
                    'bonus_points_awarded' => 0,
                    'team_points_awarded' => 0,
                ]);
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('engagement_reward_challenge_team_submissions')) {
            return;
        }

        $hasPendingBasePoints = Schema::hasColumn('engagement_reward_challenge_team_submissions', 'pending_base_points');
        $hasPendingBonusPoints = Schema::hasColumn('engagement_reward_challenge_team_submissions', 'pending_bonus_points');
        if (! $hasPendingBasePoints && ! $hasPendingBonusPoints) {
            return;
        }

        DB::table('engagement_reward_challenge_team_submissions')
            ->when($hasPendingBasePoints, fn ($query) => $query->where('pending_base_points', '>', 0))
            ->orWhere(fn ($query) => $hasPendingBonusPoints
                ? $query->where('pending_bonus_points', '>', 0)
                : $query->whereRaw('1 = 0'))
            ->update([
                'base_points_awarded' => DB::raw('base_points_awarded + '.($hasPendingBasePoints ? 'pending_base_points' : '0')),
                'bonus_points_awarded' => DB::raw('bonus_points_awarded + '.($hasPendingBonusPoints ? 'pending_bonus_points' : '0')),
                'team_points_awarded' => DB::raw('team_points_awarded + '
                    .($hasPendingBasePoints ? 'pending_base_points' : '0')
                    .' + '.($hasPendingBonusPoints ? 'pending_bonus_points' : '0')),
            ]);

        $columnsToDrop = array_values(array_filter(
            ['pending_base_points', 'pending_bonus_points'],
            fn ($column) => Schema::hasColumn('engagement_reward_challenge_team_submissions', $column),
        ));
        Schema::table('engagement_reward_challenge_team_submissions', function (Blueprint $table) use ($columnsToDrop) {
            $table->dropColumn($columnsToDrop);
        });
    }
};
