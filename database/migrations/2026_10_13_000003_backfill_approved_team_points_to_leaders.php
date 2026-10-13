<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const BACKFILL_TABLE = 'engagement_reward_challenge_team_point_backfills';

    public function up(): void
    {
        if (! Schema::hasTable(self::BACKFILL_TABLE)) {
            Schema::create(self::BACKFILL_TABLE, function (Blueprint $table) {
                $table->foreignId('team_submission_id')
                    ->primary()
                    ->constrained(
                        'engagement_reward_challenge_team_submissions',
                        'id',
                        'erc_team_points_backfill_submission_fk',
                    )
                    ->cascadeOnDelete();
                $table->unsignedInteger('original_team_points_awarded');
                $table->unsignedInteger('backfilled_team_points_awarded');
                $table->timestamps();
            });
        }

        $submissionsByLeaderAndChallenge = DB::table('engagement_reward_challenge_team_submissions as submissions')
            ->join('engagement_reward_challenges as challenges', 'challenges.id', '=', 'submissions.reward_challenge_id')
            ->where('submissions.status', 'approved')
            ->where('submissions.team_points_awarded', 0)
            ->select([
                'submissions.id',
                'submissions.reward_challenge_id',
                'submissions.leader_id',
                'submissions.log_date',
                'challenges.points',
                'challenges.duration_days',
            ])
            ->orderByDesc('submissions.log_date')
            ->orderByDesc('submissions.submitted_at')
            ->orderByDesc('submissions.id')
            ->get()
            ->groupBy(fn ($submission) => $submission->reward_challenge_id.':'.$submission->leader_id);

        foreach ($submissionsByLeaderAndChallenge as $submissions) {
            $first = $submissions->first();
            $alreadyAwarded = DB::table('engagement_reward_challenge_team_submissions')
                ->where('reward_challenge_id', $first->reward_challenge_id)
                ->where('leader_id', $first->leader_id)
                ->where('team_points_awarded', '>', 0)
                ->exists();

            if ($alreadyAwarded) {
                continue;
            }

            foreach ($submissions as $submission) {
                $isDailyChallenge = (int) $submission->duration_days > 1;
                if ($isDailyChallenge) {
                    $memberCount = DB::table('engagement_reward_challenge_team_submission_members')
                        ->where('team_submission_id', $submission->id)
                        ->count();
                    $hasIncompleteMember = DB::table('engagement_reward_challenge_team_submission_members as members')
                        ->join(
                            'engagement_reward_challenge_participants as participants',
                            'participants.id',
                            '=',
                            'members.participant_id',
                        )
                        ->where('members.team_submission_id', $submission->id)
                        ->where(function ($query) {
                            $query->whereNull('participants.required_days')
                                ->orWhere('participants.required_days', '<=', 0)
                                ->orWhereColumn(
                                    'participants.completed_days',
                                    '<',
                                    'participants.required_days',
                                );
                        })
                        ->exists();

                    if ($memberCount === 0 || $hasIncompleteMember) {
                        continue;
                    }
                }

                DB::transaction(function () use ($submission) {
                    $lockedSubmission = DB::table('engagement_reward_challenge_team_submissions')
                        ->where('id', $submission->id)
                        ->lockForUpdate()
                        ->first();

                    if (! $lockedSubmission || (int) $lockedSubmission->team_points_awarded !== 0) {
                        return;
                    }

                    $points = (int) $submission->points;
                    DB::table(self::BACKFILL_TABLE)->insertOrIgnore([
                        'team_submission_id' => $submission->id,
                        'original_team_points_awarded' => (int) $lockedSubmission->team_points_awarded,
                        'backfilled_team_points_awarded' => $points,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                    DB::table('engagement_reward_challenge_team_submissions')
                        ->where('id', $submission->id)
                        ->where('team_points_awarded', 0)
                        ->update(['team_points_awarded' => $points]);
                });

                if (DB::table('engagement_reward_challenge_team_submissions')
                    ->where('id', $submission->id)
                    ->where('team_points_awarded', '>', 0)
                    ->exists()) {
                    break;
                }
            }
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable(self::BACKFILL_TABLE)) {
            return;
        }

        DB::transaction(function () {
            $backfills = DB::table(self::BACKFILL_TABLE)->get();

            foreach ($backfills as $backfill) {
                DB::table('engagement_reward_challenge_team_submissions')
                    ->where('id', $backfill->team_submission_id)
                    ->where('team_points_awarded', $backfill->backfilled_team_points_awarded)
                    ->update(['team_points_awarded' => $backfill->original_team_points_awarded]);
            }
        });

        Schema::dropIfExists(self::BACKFILL_TABLE);
    }
};
