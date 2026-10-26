<?php

namespace Tests\Unit;

use App\Http\Middleware\EnsurePostEventSurvey;
use App\Http\Requests\Engagement\SubmitChallengeProofRequest;
use App\Http\Requests\Engagement\SubmitTeamChallengeRequest;
use App\Models\Account\AccountEmployee;
use App\Models\Engagement\EngagementPostEventAnswer;
use App\Models\Engagement\EngagementPostEventQuestion;
use App\Models\Engagement\EngagementPostEventSurvey;
use App\Models\Engagement\EngagementPostEventSurveyResponse;
use App\Models\Engagement\EngagementRewardChallenge;
use App\Models\Engagement\EngagementRewardChallengeDailyLog;
use App\Models\Engagement\EngagementRewardChallengeParticipant;
use App\Models\Engagement\EngagementRewardChallengeTeamSubmission;
use App\Models\Engagement\EngagementRewardChallengeTeamSubmissionMember;
use App\Models\ER\ERLeader;
use App\Models\ER\ERSubordinate;
use App\Models\User;
use App\Services\ChallengeSurveyService;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Database\QueryException;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Mockery;
use Tests\TestCase;

class ChallengeSurveyCreationTest extends TestCase
{
    private const MIGRATION = '2026_10_12_081200_link_engagement_surveys_to_reward_challenges.php';

    public function createApplication()
    {
        $app = require dirname(__DIR__, 2).'/bootstrap/app.php';
        $this->traitsUsedByTest = array_flip(class_uses_recursive(static::class));

        // Exercise real API routes without redeclaring the web route's global helper.
        RouteServiceProvider::loadRoutesUsing(function () {
            Route::middleware('api')->prefix('api')->group(base_path('routes/api.php'));
        });
        $app->make(Kernel::class)->bootstrap();

        return $app;
    }

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'database.default' => 'challenge_survey_testing',
            'database.connections.challenge_survey_testing' => [
                'driver' => 'sqlite',
                'database' => ':memory:',
                'prefix' => '',
                'foreign_key_constraints' => true,
            ],
        ]);
        $this->assertSame('sqlite', DB::connection()->getDriverName());

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->unsignedInteger('role')->default(1);
            $table->timestamps();
        });
        foreach (['accounts', 'departments'] as $name) {
            Schema::create($name, function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->timestamps();
            });
        }
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });
        Schema::create('account_employees', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('department_id')->nullable();
            $table->unsignedBigInteger('account_id')->nullable();
            $table->unsignedBigInteger('location_id')->nullable();
            $table->unsignedBigInteger('e_r_leader_id')->nullable();
            $table->string('employee_id')->nullable();
            $table->timestamps();
        });
        Schema::create('e_r_leaders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->unique();
            $table->timestamps();
        });
        Schema::create('e_r_subordinates', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('er_leader_id');
            $table->unsignedBigInteger('subordinate_id');
            $table->timestamps();
        });
        Schema::create('engagement_post_events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('headline')->nullable();
            $table->string('category')->default('Event');
            $table->dateTime('published_at')->nullable();
            $table->timestamps();
        });

        foreach ([
            '2026_07_09_131827_create_engagement_post_event_surveys_table.php',
            '2026_07_09_132728_create_engagement_post_event_questions_table.php',
            '2026_07_09_132432_create_engagement_post_event_answers_table.php',
            '2026_07_10_120100_extend_engagement_surveys_for_activities.php',
            '2026_07_23_000001_add_sentiment_overview_to_engagement_post_event_surveys_table.php',
            '2026_09_01_184924_create_engagement_reward_challenges_table.php',
            '2026_09_03_090000_create_reward_challenge_participants_table.php',
            '2026_09_03_100000_add_submission_review_columns_to_reward_challenge_participants_table.php',
            '2026_09_03_110000_add_points_awarded_to_reward_challenge_participants_table.php',
            '2026_10_08_000002_add_day_tracking_to_engagement_reward_challenge_participants_table.php',
            '2026_10_08_000003_create_engagement_reward_challenge_daily_logs_table.php',
            '2026_10_12_232600_create_engagement_reward_challenge_team_submissions_tables.php',
            '2026_10_13_000001_add_team_points_awarded_to_team_submissions.php',
            '2026_10_14_180000_add_bonus_points_to_challenge_awards.php',
            '2026_10_15_080000_add_proof_media_configuration_to_reward_challenges.php',
        ] as $file) {
            (require database_path('migrations/'.$file))->up();
        }

        // The historical column-relaxation migration uses MySQL-only SQL.
        Schema::table('engagement_post_event_surveys', function (Blueprint $table) {
            $table->string('status', 20)->nullable()->change();
        });
        Schema::table('engagement_post_event_questions', function (Blueprint $table) {
            $table->string('type', 50)->nullable()->change();
        });
        Schema::table('engagement_reward_challenges', function (Blueprint $table) {
            $table->unsignedInteger('duration_days')->nullable();
            $table->unsignedInteger('banner_position_x')->default(50);
            $table->unsignedInteger('banner_position_y')->default(50);
        });
        (require database_path('migrations/'.self::MIGRATION))->up();
        (require database_path('migrations/2026_10_13_000002_add_unique_user_challenge_survey_response.php'))->up();
        (require database_path('migrations/2026_10_26_190000_defer_team_challenge_points_until_survey.php'))->up();
        (require database_path('migrations/2026_10_26_220000_redefer_unearned_team_challenge_points.php'))->up();
        (require database_path('migrations/2026_10_26_230000_separate_team_and_individual_daily_challenge_logs.php'))->up();
        $this->actingAs(User::create(['name' => 'Survey Admin', 'email' => 'survey-admin@example.test', 'role' => 1]));
    }

    private function challengeData(): array
    {
        return [
            'title' => 'New challenge',
            'description' => 'Complete the challenge requirements.',
            'type' => 'Individual',
            'category' => 'Custom',
            'points' => 100,
            'all_employees' => true,
            'start_date' => now()->toDateString(),
            'deadline' => now()->addDays(7)->toDateString(),
            'card_color' => '#F59E0B',
        ];
    }

    private function createChallenge(): EngagementRewardChallenge
    {
        return EngagementRewardChallenge::create([
            ...$this->challengeData(),
            'created_by' => auth()->id(),
            'status' => 'published',
        ]);
    }

    private function leaderboardCacheKey(EngagementRewardChallenge $challenge): string
    {
        return "engagement.reward-challenges.{$challenge->id}.leaderboards";
    }

    private function createTeamLeaderWithReports(int $reportCount = 1): array
    {
        $leader = User::create([
            'name' => 'Team Leader',
            'email' => 'team-leader-'.uniqid().'@example.test',
            'role' => User::ROLE_EMPLOYEE,
        ]);
        $leaderRecord = ERLeader::create(['user_id' => $leader->id]);
        $reports = [];

        for ($index = 1; $index <= $reportCount; $index++) {
            $report = User::create([
                'name' => "Direct Report {$index}",
                'email' => "direct-report-{$index}-".uniqid().'@example.test',
                'role' => User::ROLE_EMPLOYEE,
            ]);
            AccountEmployee::create([
                'user_id' => $report->id,
                'employee_id' => "EOID-{$index}",
            ]);
            ERSubordinate::create([
                'er_leader_id' => $leaderRecord->id,
                'subordinate_id' => $report->id,
            ]);
            $reports[] = $report;
        }

        return [$leader, $reports];
    }

    private function createTeamChallenge(int $durationDays = 0): EngagementRewardChallenge
    {
        $challenge = $this->createChallenge();
        $challenge->update([
            'type' => 'Team',
            'duration_days' => $durationDays ?: null,
        ]);

        return $challenge->fresh();
    }

    private function surveyParticipant(bool $daily = false): EngagementRewardChallengeParticipant
    {
        $challenge = $this->createChallenge();
        if ($daily) {
            $challenge->update(['duration_days' => 2]);
        }
        (new ChallengeSurveyService)->createForChallenge($challenge);

        return EngagementRewardChallengeParticipant::create([
            'reward_challenge_id' => $challenge->id,
            'user_id' => auth()->id(),
            'status' => $daily ? 'joined' : 'submitted',
            'joined_at' => now(),
            'submitted_at' => $daily ? null : now(),
            'required_days' => $daily ? 2 : null,
            'completed_days' => 0,
        ]);
    }

    private function surveyAnswers(EngagementRewardChallengeParticipant $participant): array
    {
        return $participant->challenge->survey->questions->mapWithKeys(
            fn ($question) => [$question->id => $question->type === 'rating' ? 5 : 'Helpful feedback.']
        )->all();
    }

    public function test_duration_days_are_snapshotted_when_an_employee_joins(): void
    {
        $challenge = $this->createChallenge();
        $challenge->update(['duration_days' => 3]);

        $this->getJson("/api/engagement/reward-challenges/{$challenge->id}/participants")->assertOk();
        $this->assertTrue(Cache::has($this->leaderboardCacheKey($challenge)));
        $response = $this->postJson("/api/engagement/reward-challenges/{$challenge->id}/join");

        $response->assertOk()->assertJsonPath('data.required_days', 3);
        $this->assertFalse(Cache::has($this->leaderboardCacheKey($challenge)));
        $participant = EngagementRewardChallengeParticipant::query()->firstOrFail();
        $this->assertSame(3, $participant->required_days);
    }

    public function test_team_submission_awards_challenge_points_only_to_the_leader(): void
    {
        Storage::fake('s3');
        $challenge = $this->createTeamChallenge();
        [$leader, $reports] = $this->createTeamLeaderWithReports(2);
        $admin = User::where('email', 'survey-admin@example.test')->firstOrFail();

        $this->getJson("/api/engagement/reward-challenges/{$challenge->id}/participants")->assertOk();
        $this->assertTrue(Cache::has($this->leaderboardCacheKey($challenge)));
        $response = $this->actingAs($leader)->post(
            "/api/engagement/reward-challenges/{$challenge->id}/submit-team",
            [
                'photo' => UploadedFile::fake()->image('team-proof.png'),
                'challenge_description' => 'The team completed the activity together.',
            ],
        );

        $response->assertCreated()->assertJsonPath('data.challenge.type', 'Team');
        $this->assertFalse(Cache::has($this->leaderboardCacheKey($challenge)));
        $this->assertDatabaseCount('engagement_reward_challenge_team_submissions', 1);
        $this->assertDatabaseCount('engagement_reward_challenge_team_submission_members', 2);
        $individual = User::create([
            'name' => 'Individual Leaderboard Entry',
            'email' => 'individual-leaderboard-'.uniqid().'@example.test',
            'role' => User::ROLE_EMPLOYEE,
        ]);
        EngagementRewardChallengeParticipant::create([
            'reward_challenge_id' => $challenge->id,
            'user_id' => $individual->id,
            'status' => 'joined',
            'joined_at' => now(),
        ]);
        $this->actingAs($admin)
            ->getJson("/api/engagement/reward-challenges/{$challenge->id}/participants")
            ->assertOk()
            ->assertJsonCount(3, 'data.participants')
            ->assertJsonCount(1, 'data.individual_participants')
            ->assertJsonPath('data.individual_participants.0.name', 'Individual Leaderboard Entry')
            ->assertJsonCount(1, 'data.team_submissions')
            ->assertJsonPath('data.team_submissions.0.name', "Team: {$leader->name}")
            ->assertJsonPath('data.team_submissions.0.member_count', 2);
        $this->assertTrue(Cache::has($this->leaderboardCacheKey($challenge)));
        $this->assertDatabaseMissing('engagement_reward_challenge_participants', [
            'reward_challenge_id' => $challenge->id,
            'user_id' => $leader->id,
        ]);
        $this->actingAs($leader)
            ->getJson('/api/engagement/reward-challenges/my')
            ->assertOk()
            ->assertJsonPath('data.0.team_submission_status', 'submitted')
            ->assertJsonPath('data.0.team_submission_locked', true);

        $submissionId = $response->json('data.team_submission_id');
        $this->actingAs($leader)
            ->postJson("/api/engagement/reward-challenge-submissions/team-{$submissionId}/approve")
            ->assertForbidden();
        $this->actingAs($admin)
            ->postJson("/api/engagement/reward-challenge-submissions/team-{$submissionId}/approve", [
                'bonus_points' => 25,
            ])
            ->assertOk()
            ->assertJsonPath('data.base_points_awarded', 100)
            ->assertJsonPath('data.bonus_points_awarded', 25)
            ->assertJsonPath('data.team_points_awarded', 125);
        $this->assertFalse(Cache::has($this->leaderboardCacheKey($challenge)));
        $this->actingAs($admin)
            ->postJson("/api/engagement/reward-challenge-submissions/team-{$submissionId}/approve", [
                'bonus_points' => 25,
            ])
            ->assertUnprocessable();

        foreach ($reports as $report) {
            $participant = EngagementRewardChallengeParticipant::query()
                ->where('reward_challenge_id', $challenge->id)
                ->where('user_id', $report->id)
                ->firstOrFail();
            $this->assertSame('joined', $participant->status);
            $this->assertSame(0, (int) $participant->points_awarded);
        }

        $this->assertDatabaseHas('engagement_reward_challenge_team_submissions', [
            'id' => $submissionId,
            'team_points_awarded' => 125,
            'base_points_awarded' => 100,
            'bonus_points_awarded' => 25,
        ]);
        $this->actingAs($leader)
            ->getJson('/api/engagement/reward-challenges/profile-summary')
            ->assertOk()
            ->assertJsonPath('data.total_points', 125)
            ->assertJsonPath('data.challenge_history.0.submission_type', 'team')
            ->assertJsonPath('data.challenge_history.0.challenge_title', $challenge->title)
            ->assertJsonPath('data.challenge_history.0.team_points_awarded', 125)
            ->assertJsonPath('data.challenge_history.0.challenge_points_awarded', 100)
            ->assertJsonPath('data.challenge_history.0.bonus_points_awarded', 25);
        $this->actingAs($reports[0])
            ->getJson('/api/engagement/reward-challenges/profile-summary')
            ->assertOk()
            ->assertJsonPath('data.total_points', 0);
    }

    public function test_team_points_are_awarded_on_approval_before_the_leader_completes_the_survey(): void
    {
        Storage::fake('s3');
        $challenge = $this->createTeamChallenge();
        (new ChallengeSurveyService)->createForChallenge($challenge);
        [$leader] = $this->createTeamLeaderWithReports();
        $admin = User::where('email', 'survey-admin@example.test')->firstOrFail();

        $this->actingAs($leader)->post(
            "/api/engagement/reward-challenges/{$challenge->id}/submit-team",
            [
                'photo' => UploadedFile::fake()->image('team-proof.png'),
                'challenge_description' => 'The team completed the activity together.',
            ],
        )->assertCreated();

        $submission = EngagementRewardChallengeTeamSubmission::query()
            ->where('reward_challenge_id', $challenge->id)
            ->firstOrFail();
        $this->actingAs($admin)
            ->postJson("/api/engagement/reward-challenge-submissions/team-{$submission->id}/approve", [
                'bonus_points' => 25,
            ])
            ->assertOk()
            ->assertJsonPath('data.team_points_awarded', 0)
            ->assertJsonPath('data.pending_base_points', 100)
            ->assertJsonPath('data.pending_bonus_points', 25);

        $submission->refresh();
        $this->assertSame(100, $submission->pending_base_points);
        $this->assertSame(25, $submission->pending_bonus_points);
        $beforeSurvey = $this->actingAs($leader)
            ->getJson('/api/engagement/reward-challenges/profile-summary')
            ->assertOk()
            ->assertJsonPath('data.total_points', 0);
        $teamHistoryBeforeSurvey = collect($beforeSurvey->json('data.challenge_history'))
            ->firstWhere('id', 'team-'.$submission->id);
        $this->assertSame(0, $teamHistoryBeforeSurvey['team_points_awarded']);
        $this->assertSame(0, $teamHistoryBeforeSurvey['challenge_points_awarded']);
        $this->assertSame(0, $teamHistoryBeforeSurvey['bonus_points_awarded']);
        $this->assertSame('pending_survey', $teamHistoryBeforeSurvey['status']);
        $this->assertSame(0, $teamHistoryBeforeSurvey['survey_points_awarded']);
        $this->assertCount(1, $beforeSurvey->json('data.challenge_history'));

        $leaderParticipant = EngagementRewardChallengeParticipant::query()
            ->where('reward_challenge_id', $challenge->id)
            ->where('user_id', $leader->id)
            ->firstOrFail();
        $this->assertSame(0, (int) $leaderParticipant->points_awarded);
        foreach ($submission->members as $member) {
            $this->assertSame(0, (int) $member->participant->points_awarded);
        }
        $this->submitSurvey($leaderParticipant)
            ->assertOk()
            ->assertJsonPath('data.survey_completed', true);
        $submission->refresh();
        $this->assertSame(100, $submission->base_points_awarded);
        $this->assertSame(25, $submission->bonus_points_awarded);
        $this->assertSame(125, $submission->team_points_awarded);
        $this->assertSame(0, $submission->pending_base_points);
        $this->assertSame(0, $submission->pending_bonus_points);

        $this->submitSurvey($leaderParticipant)->assertOk();
        $this->assertSame(125, $submission->fresh()->team_points_awarded);
        $afterSurvey = $this->getJson('/api/engagement/reward-challenges/profile-summary')
            ->assertOk()
            ->assertJsonPath('data.total_points', 140);
        $teamHistoryAfterSurvey = collect($afterSurvey->json('data.challenge_history'))
            ->firstWhere('id', 'team-'.$submission->id);
        $this->assertSame(125, $teamHistoryAfterSurvey['team_points_awarded']);
        $this->assertSame(15, $teamHistoryAfterSurvey['survey_points_awarded']);
        $this->assertSame('approved', $teamHistoryAfterSurvey['status']);
        $this->assertCount(1, $afterSurvey->json('data.challenge_history'));
    }

    public function test_team_proof_does_not_block_leader_individual_submission_and_both_awards_wait_for_survey(): void
    {
        Storage::fake('s3');
        $challenge = $this->createTeamChallenge();
        (new ChallengeSurveyService)->createForChallenge($challenge);
        [$leader, $reports] = $this->createTeamLeaderWithReports();
        $admin = User::where('email', 'survey-admin@example.test')->firstOrFail();

        $teamResponse = $this->actingAs($leader)->post(
            "/api/engagement/reward-challenges/{$challenge->id}/submit-team",
            [
                'photo' => UploadedFile::fake()->image('team-proof.png'),
                'challenge_description' => 'The team completed the activity together.',
            ],
        )->assertCreated();
        $teamSubmissionId = $teamResponse->json('data.team_submission_id');

        $this->actingAs($admin)
            ->postJson("/api/engagement/reward-challenge-submissions/team-{$teamSubmissionId}/approve", [
                'bonus_points' => 25,
            ])
            ->assertOk()
            ->assertJsonPath('data.team_points_awarded', 0);
        $this->assertSame(100, EngagementRewardChallengeTeamSubmission::findOrFail($teamSubmissionId)->pending_base_points);
        $this->assertSame(25, EngagementRewardChallengeTeamSubmission::findOrFail($teamSubmissionId)->pending_bonus_points);

        $leaderParticipant = EngagementRewardChallengeParticipant::query()
            ->where('reward_challenge_id', $challenge->id)
            ->where('user_id', $leader->id)
            ->firstOrFail();
        $this->assertSame('joined', $leaderParticipant->status);
        $this->assertNull($leaderParticipant->submission_path);
        $this->assertNull($leaderParticipant->submitted_at);
        $this->assertNull($leaderParticipant->proof_approved_at);
        $teamSubmission = EngagementRewardChallengeTeamSubmission::findOrFail($teamSubmissionId);
        $leaderParticipant->update([
            'status' => 'approved',
            'submission_path' => $teamSubmission->submission_path,
            'submitted_at' => $teamSubmission->submitted_at,
            'proof_approved_at' => $teamSubmission->reviewed_at,
        ]);
        $this->assertFalse($leaderParticipant->fresh()->hasIndividualSubmission());
        $this->actingAs($leader)
            ->getJson('/api/engagement/reward-challenges/my')
            ->assertOk()
            ->assertJsonPath('data.0.participation_status', 'joined')
            ->assertJsonPath('data.0.individual_proof_submitted', false);

        $this->actingAs($leader)->post(
            "/api/engagement/reward-challenges/{$challenge->id}/submit",
            [
                'photo' => UploadedFile::fake()->image('individual-proof.png'),
                'challenge_description' => 'I completed this challenge individually.',
            ],
        )->assertOk();

        $leaderParticipant->refresh();
        $this->assertSame('submitted', $leaderParticipant->status);
        $this->getJson('/api/engagement/reward-challenges/my')
            ->assertOk()
            ->assertJsonPath('data.0.participation_status', 'submitted')
            ->assertJsonPath('data.0.individual_proof_submitted', true);
        $this->actingAs($admin)
            ->postJson("/api/engagement/reward-challenge-submissions/{$leaderParticipant->id}/approve", [
                'bonus_points' => 10,
            ])
            ->assertOk()
            ->assertJsonPath('data.participation_status', 'pending_survey')
            ->assertJsonPath('data.points_awarded', null);

        $this->actingAs($leader)
            ->getJson('/api/engagement/reward-challenges/profile-summary')
            ->assertOk()
            ->assertJsonPath('data.total_points', 0);
        $this->assertSame(0, EngagementRewardChallengeParticipant::query()
            ->where('reward_challenge_id', $challenge->id)
            ->where('user_id', $reports[0]->id)
            ->value('points_awarded') ?? 0);

        $this->actingAs($leader);
        $this->submitSurvey($leaderParticipant)->assertOk();

        $this->assertSame(110, (int) $leaderParticipant->fresh()->points_awarded);
        $this->assertSame(125, (int) EngagementRewardChallengeTeamSubmission::findOrFail($teamSubmissionId)->team_points_awarded);
        $summary = $this->getJson('/api/engagement/reward-challenges/profile-summary')
            ->assertOk()
            ->assertJsonPath('data.total_points', 250);
        $this->assertCount(2, $summary->json('data.challenge_history'));
        $this->actingAs($reports[0])
            ->getJson('/api/engagement/reward-challenges/profile-summary')
            ->assertOk()
            ->assertJsonPath('data.total_points', 0);
    }

    public function test_team_approval_after_survey_completes_leader_and_awards_points_once(): void
    {
        Storage::fake('s3');
        $challenge = $this->createTeamChallenge();
        (new ChallengeSurveyService)->createForChallenge($challenge);
        [$leader] = $this->createTeamLeaderWithReports();
        $admin = User::where('email', 'survey-admin@example.test')->firstOrFail();

        $this->actingAs($leader)->post(
            "/api/engagement/reward-challenges/{$challenge->id}/submit-team",
            [
                'photo' => UploadedFile::fake()->image('team-proof.png'),
                'challenge_description' => 'The team completed the activity together.',
            ],
        )->assertCreated();

        $leaderParticipant = EngagementRewardChallengeParticipant::query()
            ->where('reward_challenge_id', $challenge->id)
            ->where('user_id', $leader->id)
            ->firstOrFail();
        $this->actingAs($leader);
        $this->submitSurvey($leaderParticipant)
            ->assertOk()
            ->assertJsonPath('data.participation_status', 'joined');

        $submission = EngagementRewardChallengeTeamSubmission::query()
            ->where('reward_challenge_id', $challenge->id)
            ->firstOrFail();
        $this->actingAs($admin)
            ->postJson("/api/engagement/reward-challenge-submissions/team-{$submission->id}/approve", [
                'bonus_points' => 25,
            ])
            ->assertOk()
            ->assertJsonPath('data.team_points_awarded', 125);

        $this->assertSame('joined', $leaderParticipant->fresh()->status);
        $this->assertSame(0, (int) $leaderParticipant->fresh()->points_awarded);
        $this->assertSame(0, $submission->fresh()->pending_base_points);
        $this->assertSame(0, $submission->fresh()->pending_bonus_points);

        $summary = $this->actingAs($leader)
            ->getJson('/api/engagement/reward-challenges/profile-summary')
            ->assertOk()
            ->assertJsonPath('data.total_points', 140);
        $history = $summary->json('data.challenge_history');
        $this->assertCount(1, $history);
        $this->assertSame('approved', $history[0]['status']);
        $this->assertSame(15, $history[0]['survey_points_awarded']);
    }

    public function test_migration_defers_existing_team_points_until_survey_completion(): void
    {
        $challenge = $this->createTeamChallenge();
        (new ChallengeSurveyService)->createForChallenge($challenge);
        [$leader] = $this->createTeamLeaderWithReports();
        $submission = EngagementRewardChallengeTeamSubmission::create([
            'reward_challenge_id' => $challenge->id,
            'leader_id' => $leader->id,
            'log_date' => now()->toDateString(),
            'submission_path' => 'legacy-team-proof.png',
            'status' => 'approved',
            'team_points_awarded' => 125,
            'base_points_awarded' => 100,
            'bonus_points_awarded' => 25,
        ]);

        $migration = require database_path('migrations/2026_10_26_190000_defer_team_challenge_points_until_survey.php');
        $migration->down();
        $migration->up();

        $submission->refresh();
        $this->assertSame(0, $submission->team_points_awarded);
        $this->assertSame(0, $submission->base_points_awarded);
        $this->assertSame(0, $submission->bonus_points_awarded);
        $this->assertSame(100, $submission->pending_base_points);
        $this->assertSame(25, $submission->pending_bonus_points);

        $summary = $this->actingAs($leader)
            ->getJson('/api/engagement/reward-challenges/profile-summary')
            ->assertOk()
            ->assertJsonPath('data.total_points', 0);
        $teamHistory = collect($summary->json('data.challenge_history'))
            ->firstWhere('id', 'team-'.$submission->id);
        $this->assertSame(0, $teamHistory['team_points_awarded']);

        $migration->down();
        $this->assertFalse(Schema::hasColumn('engagement_reward_challenge_team_submissions', 'pending_base_points'));
        $this->assertFalse(Schema::hasColumn('engagement_reward_challenge_team_submissions', 'pending_bonus_points'));
        $this->assertDatabaseHas('engagement_reward_challenge_team_submissions', [
            'id' => $submission->id,
            'team_points_awarded' => 125,
            'base_points_awarded' => 100,
            'bonus_points_awarded' => 25,
        ]);
    }

    public function test_migration_redefers_previously_awarded_team_points_without_leader_survey(): void
    {
        $challenge = $this->createTeamChallenge();
        (new ChallengeSurveyService)->createForChallenge($challenge);
        [$leader] = $this->createTeamLeaderWithReports();
        $submission = EngagementRewardChallengeTeamSubmission::create([
            'reward_challenge_id' => $challenge->id,
            'leader_id' => $leader->id,
            'log_date' => now()->toDateString(),
            'submission_path' => 'team-proof-before-survey.png',
            'status' => 'approved',
            'team_points_awarded' => 125,
            'base_points_awarded' => 100,
            'bonus_points_awarded' => 25,
        ]);

        $migration = require database_path('migrations/2026_10_26_220000_redefer_unearned_team_challenge_points.php');
        $migration->up();

        $submission->refresh();
        $this->assertSame(0, $submission->team_points_awarded);
        $this->assertSame(0, $submission->base_points_awarded);
        $this->assertSame(0, $submission->bonus_points_awarded);
        $this->assertSame(100, $submission->pending_base_points);
        $this->assertSame(25, $submission->pending_bonus_points);
        $this->actingAs($leader)
            ->getJson('/api/engagement/reward-challenges/profile-summary')
            ->assertOk()
            ->assertJsonPath('data.total_points', 0);

        $migration->down();
        $this->assertSame(125, $submission->fresh()->team_points_awarded);
        $this->assertSame(100, $submission->fresh()->base_points_awarded);
        $this->assertSame(25, $submission->fresh()->bonus_points_awarded);
        $this->assertSame(0, $submission->fresh()->pending_base_points);
        $this->assertSame(0, $submission->fresh()->pending_bonus_points);
    }

    public function test_individual_and_team_daily_log_migration_is_reversible(): void
    {
        $migration = require database_path('migrations/2026_10_26_230000_separate_team_and_individual_daily_challenge_logs.php');
        $migration->up();

        $this->assertTrue(Schema::hasIndex('engagement_reward_challenge_daily_logs', 'erc_daily_individual_date_unique'));
        $this->assertTrue(Schema::hasIndex('engagement_reward_challenge_daily_logs', 'erc_daily_team_date_unique'));

        $migration->down();
        $this->assertTrue(Schema::hasIndex('engagement_reward_challenge_daily_logs', 'erc_daily_logs_participant_date_unique'));
        $this->assertFalse(Schema::hasColumn('engagement_reward_challenge_daily_logs', 'individual_log_date'));
        $this->assertFalse(Schema::hasColumn('engagement_reward_challenge_daily_logs', 'team_log_date'));

        $migration->up();
        $this->assertTrue(Schema::hasIndex('engagement_reward_challenge_daily_logs', 'erc_daily_individual_date_unique'));
        $this->assertTrue(Schema::hasIndex('engagement_reward_challenge_daily_logs', 'erc_daily_team_date_unique'));
    }

    public function test_daily_team_points_wait_for_leader_survey_after_all_days_are_approved(): void
    {
        Storage::fake('s3');
        $challenge = $this->createTeamChallenge(2);
        (new ChallengeSurveyService)->createForChallenge($challenge);
        [$leader] = $this->createTeamLeaderWithReports();
        $admin = User::where('email', 'survey-admin@example.test')->firstOrFail();
        $teamSubmissions = [];

        $firstDay = $this->actingAs($leader)->post(
            "/api/engagement/reward-challenges/{$challenge->id}/submit-team",
            [
                'photo' => UploadedFile::fake()->image('team-day-one.png'),
                'challenge_description' => 'First day team proof.',
            ],
        )->assertCreated();
        $teamSubmissions[] = $firstDay->json('data.team_submission_id');
        $this->actingAs($admin)
            ->postJson('/api/engagement/reward-challenge-submissions/team-'.$teamSubmissions[0].'/approve', [
                'bonus_points' => 5,
            ])
            ->assertOk()
            ->assertJsonPath('data.team_points_awarded', 0);

        $leaderParticipant = EngagementRewardChallengeParticipant::query()
            ->where('reward_challenge_id', $challenge->id)
            ->where('user_id', $leader->id)
            ->firstOrFail();
        $this->assertFalse($leaderParticipant->canAnswerSurvey($challenge));

        Carbon::setTestNow(now()->addDay());
        try {
            $secondDay = $this->actingAs($leader)->post(
                "/api/engagement/reward-challenges/{$challenge->id}/submit-team",
                [
                    'photo' => UploadedFile::fake()->image('team-day-two.png'),
                    'challenge_description' => 'Second day team proof.',
                ],
            )->assertCreated();
            $teamSubmissions[] = $secondDay->json('data.team_submission_id');
            $this->actingAs($admin)
                ->postJson('/api/engagement/reward-challenge-submissions/team-'.$teamSubmissions[1].'/approve', [
                    'bonus_points' => 5,
                ])
                ->assertOk()
                ->assertJsonPath('data.team_points_awarded', 0);
        } finally {
            Carbon::setTestNow();
        }

        $this->assertTrue($leaderParticipant->fresh()->canAnswerSurvey($challenge));
        foreach ($teamSubmissions as $submissionId) {
            $submission = EngagementRewardChallengeTeamSubmission::findOrFail($submissionId);
            $this->assertSame(5, $submission->pending_bonus_points);
        }
        $this->assertSame(0, EngagementRewardChallengeTeamSubmission::query()
            ->whereIn('id', $teamSubmissions)
            ->sum('team_points_awarded'));

        $this->actingAs($leader);
        $this->submitSurvey($leaderParticipant)->assertOk();

        $submissions = EngagementRewardChallengeTeamSubmission::query()
            ->whereIn('id', $teamSubmissions)
            ->orderBy('log_date')
            ->get();
        $this->assertSame(110, $submissions->sum('team_points_awarded'));
        $this->assertSame(100, $submissions->sum('base_points_awarded'));
        $this->assertSame(10, $submissions->sum('bonus_points_awarded'));
        $this->assertSame(125, $this->getJson('/api/engagement/reward-challenges/profile-summary')
            ->assertOk()
            ->json('data.total_points'));
    }

    public function test_individual_daily_proof_can_coexist_with_team_proof_on_the_same_day(): void
    {
        Storage::fake('s3');
        if (! Schema::hasTable('sites')) {
            Schema::create('sites', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('location_id')->nullable();
                $table->string('name')->nullable();
                $table->timestamps();
            });
        }
        $challenge = $this->createTeamChallenge(2);
        [$leader, $reports] = $this->createTeamLeaderWithReports();
        $report = $reports[0];

        $teamResponse = $this->actingAs($leader)->post(
            "/api/engagement/reward-challenges/{$challenge->id}/submit-team",
            [
                'photo' => UploadedFile::fake()->image('team-day-one.png'),
                'challenge_description' => 'The team completed the activity together.',
            ],
        )->assertCreated();
        $teamSubmissionId = $teamResponse->json('data.team_submission_id');
        $participant = EngagementRewardChallengeParticipant::query()
            ->where('reward_challenge_id', $challenge->id)
            ->where('user_id', $report->id)
            ->firstOrFail();

        $this->actingAs($report)->post(
            "/api/engagement/reward-challenges/{$challenge->id}/submit-daily",
            [
                'photo' => UploadedFile::fake()->image('individual-day-one.png'),
                'challenge_description' => 'I also completed the activity individually.',
            ],
        )->assertOk()
            ->assertJsonPath('data.individual_proof_submitted', true)
            ->assertJsonPath('data.submitted_today', true);

        $logs = $participant->dailyLogs()->whereDate('log_date', now()->toDateString())->get();
        $this->assertCount(2, $logs);
        $this->assertCount(1, $logs->whereNull('team_submission_id'));
        $this->assertCount(1, $logs->where('team_submission_id', $teamSubmissionId));

        $this->post(
            "/api/engagement/reward-challenges/{$challenge->id}/submit-daily",
            [
                'photo' => UploadedFile::fake()->image('duplicate-individual-day-one.png'),
                'challenge_description' => 'Duplicate individual proof.',
            ],
        )->assertUnprocessable();
        $this->assertSame(2, $participant->dailyLogs()->whereDate('log_date', now()->toDateString())->count());

        $admin = User::where('email', 'survey-admin@example.test')->firstOrFail();
        $this->actingAs($admin)
            ->postJson("/api/engagement/reward-challenge-submissions/team-{$teamSubmissionId}/approve")
            ->assertOk();
        $individualLogId = $participant->dailyLogs()
            ->whereNull('team_submission_id')
            ->value('id');
        $this->postJson("/api/engagement/reward-challenge-submissions/daily-{$individualLogId}/approve")
            ->assertOk();
        $this->assertSame(1, $participant->fresh()->dailyLogs()->whereNull('team_submission_id')->where('status', 'approved')->count());
        $this->assertSame(1, $participant->fresh()->dailyLogs()->whereNotNull('team_submission_id')->where('status', 'approved')->count());
    }

    public function test_pending_team_proof_unlocks_survey_for_leader_only(): void
    {
        Storage::fake('s3');
        $challenge = $this->createTeamChallenge();
        (new ChallengeSurveyService)->createForChallenge($challenge);
        [$leader, $reports] = $this->createTeamLeaderWithReports();

        $this->actingAs($leader)->post(
            "/api/engagement/reward-challenges/{$challenge->id}/submit-team",
            [
                'photo' => UploadedFile::fake()->image('team-proof.png'),
                'challenge_description' => 'The team completed the activity together.',
            ],
        )->assertCreated();

        $leaderParticipant = EngagementRewardChallengeParticipant::query()
            ->where('reward_challenge_id', $challenge->id)
            ->where('user_id', $leader->id)
            ->firstOrFail();

        $this->getJson('/api/engagement/reward-challenges/my')
            ->assertOk()
            ->assertJsonPath('data.0.can_complete_survey', true);
        $this->getJson("/api/engagement/reward-challenges/{$challenge->id}/survey")
            ->assertOk()
            ->assertJsonPath('data.can_submit', true);

        $member = $reports[0];
        $memberParticipant = EngagementRewardChallengeParticipant::query()
            ->where('reward_challenge_id', $challenge->id)
            ->where('user_id', $member->id)
            ->firstOrFail();
        $this->actingAs($member)
            ->getJson("/api/engagement/reward-challenges/{$challenge->id}/survey")
            ->assertOk()
            ->assertJsonPath('data.can_submit', false);
        $this->submitSurvey($memberParticipant)->assertUnprocessable();

        $this->actingAs($leader);
        $this->submitSurvey($leaderParticipant)
            ->assertOk()
            ->assertJsonPath('data.survey_completed', true);
        $this->submitSurvey($leaderParticipant)
            ->assertOk()
            ->assertJsonPath('data.survey_completed', true);
        $this->assertSame(1, EngagementPostEventSurveyResponse::where('user_id', $leader->id)->count());
        $this->assertSame(0, EngagementPostEventSurveyResponse::where('user_id', $member->id)->count());
        $this->assertSame(15, $leaderParticipant->fresh()->survey_points_awarded);
        $this->assertSame(0, $memberParticipant->fresh()->survey_points_awarded);
    }

    public function test_existing_team_proof_repairs_missing_survey_participation_for_leader(): void
    {
        Storage::fake('s3');
        $challenge = $this->createTeamChallenge();
        (new ChallengeSurveyService)->createForChallenge($challenge);
        [$leader] = $this->createTeamLeaderWithReports();

        $this->actingAs($leader)->post(
            "/api/engagement/reward-challenges/{$challenge->id}/submit-team",
            [
                'photo' => UploadedFile::fake()->image('team-proof.png'),
                'challenge_description' => 'The team completed the activity together.',
            ],
        )->assertCreated();

        EngagementRewardChallengeParticipant::query()
            ->where('reward_challenge_id', $challenge->id)
            ->where('user_id', $leader->id)
            ->delete();

        $this->getJson('/api/engagement/reward-challenges/my')
            ->assertOk()
            ->assertJsonPath('data.0.can_complete_survey', true);
        $this->assertDatabaseHas('engagement_reward_challenge_participants', [
            'reward_challenge_id' => $challenge->id,
            'user_id' => $leader->id,
            'status' => 'joined',
        ]);
        $this->getJson("/api/engagement/reward-challenges/{$challenge->id}/survey")
            ->assertOk()
            ->assertJsonPath('data.can_submit', true);
    }

    public function test_daily_team_survey_waits_for_approved_days_and_excludes_members(): void
    {
        $challenge = $this->createTeamChallenge(2);
        (new ChallengeSurveyService)->createForChallenge($challenge);
        [$leader, $reports] = $this->createTeamLeaderWithReports();
        $leaderParticipant = EngagementRewardChallengeParticipant::create([
            'reward_challenge_id' => $challenge->id,
            'user_id' => $leader->id,
            'status' => 'joined',
            'joined_at' => now(),
            'required_days' => 2,
            'completed_days' => 0,
        ]);
        $memberParticipant = EngagementRewardChallengeParticipant::create([
            'reward_challenge_id' => $challenge->id,
            'user_id' => $reports[0]->id,
            'status' => 'approved',
            'joined_at' => now(),
            'submitted_at' => now(),
            'required_days' => 2,
            'completed_days' => 2,
        ]);

        $firstDay = EngagementRewardChallengeTeamSubmission::create([
            'reward_challenge_id' => $challenge->id,
            'leader_id' => $leader->id,
            'log_date' => now()->toDateString(),
            'submission_path' => 'team-day-one.png',
            'status' => 'approved',
        ]);
        DB::table('engagement_reward_challenge_team_submission_members')->insert([
            'team_submission_id' => $firstDay->id,
            'participant_id' => $memberParticipant->id,
            'user_id' => $reports[0]->id,
            'full_name' => $reports[0]->name,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->assertFalse($leaderParticipant->canAnswerSurvey($challenge));

        EngagementRewardChallengeTeamSubmission::create([
            'reward_challenge_id' => $challenge->id,
            'leader_id' => $leader->id,
            'log_date' => now()->addDay()->toDateString(),
            'submission_path' => 'team-day-two.png',
            'status' => 'approved',
        ]);

        $this->assertTrue($leaderParticipant->fresh()->canAnswerSurvey($challenge));
        $this->assertFalse($memberParticipant->canAnswerSurvey($challenge));
    }

    public function test_submission_exports_follow_the_selected_type_and_export_team_leader_once(): void
    {
        Storage::fake('s3');
        $individualChallenge = $this->createChallenge();
        $individual = User::create([
            'name' => 'Individual Export Employee',
            'email' => 'individual-export-'.uniqid().'@example.test',
            'role' => User::ROLE_EMPLOYEE,
        ]);
        EngagementRewardChallengeParticipant::create([
            'reward_challenge_id' => $individualChallenge->id,
            'user_id' => $individual->id,
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);
        $individualParticipant = EngagementRewardChallengeParticipant::query()
            ->where('reward_challenge_id', $individualChallenge->id)
            ->where('user_id', $individual->id)
            ->firstOrFail();
        $pendingIndividual = User::create([
            'name' => 'Pending Export Employee',
            'email' => 'pending-export-'.uniqid().'@example.test',
            'role' => User::ROLE_EMPLOYEE,
        ]);
        EngagementRewardChallengeParticipant::create([
            'reward_challenge_id' => $individualChallenge->id,
            'user_id' => $pendingIndividual->id,
            'status' => 'pending_survey',
            'proof_approved_at' => now(),
            'submitted_at' => now(),
            'bonus_points' => 15,
        ]);

        $teamChallenge = $this->createTeamChallenge();
        [$leader] = $this->createTeamLeaderWithReports(2);
        $this->actingAs($leader)->post(
            "/api/engagement/reward-challenges/{$teamChallenge->id}/submit-team",
            [
                'photo' => UploadedFile::fake()->image('team-export-proof.png'),
                'challenge_description' => 'Team export proof.',
            ],
        )->assertCreated();

        $admin = User::where('email', 'survey-admin@example.test')->firstOrFail();
        $this->actingAs($admin)
            ->postJson("/api/engagement/reward-challenge-submissions/{$individualParticipant->id}/approve", [
                'bonus_points' => 25,
            ])
            ->assertOk();
        $teamSubmission = EngagementRewardChallengeTeamSubmission::query()
            ->where('reward_challenge_id', $teamChallenge->id)
            ->firstOrFail();
        $this->actingAs($admin)
            ->postJson("/api/engagement/reward-challenge-submissions/team-{$teamSubmission->id}/approve", [
                'bonus_points' => 40,
            ])
            ->assertOk();

        $individualExport = $this->actingAs($admin)
            ->get('/api/engagement/reward-challenge-submissions/export?submission_type=individual')
            ->assertOk();
        $individualRows = array_map(
            fn (string $row) => str_getcsv($row, "\t"),
            explode("\n", trim($individualExport->streamedContent())),
        );
        $this->assertSame(
            ['EOID', 'Fullname', 'Email', 'Challenge Title', 'Department', 'Account', 'Base Points', 'Bonus Points', 'Total Points'],
            $individualRows[0],
        );
        $this->assertCount(3, $individualRows);
        $approvedIndividualRow = collect($individualRows)->firstWhere(1, 'Individual Export Employee');
        $this->assertSame($individual->email, $approvedIndividualRow[2]);
        $this->assertSame($individualChallenge->title, $approvedIndividualRow[3]);
        $this->assertSame('100', $approvedIndividualRow[6]);
        $this->assertSame('25', $approvedIndividualRow[7]);
        $this->assertSame('125', $approvedIndividualRow[8]);
        $pendingIndividualRow = collect($individualRows)->firstWhere(1, 'Pending Export Employee');
        $this->assertSame('0', $pendingIndividualRow[6]);
        $this->assertSame('0', $pendingIndividualRow[7]);
        $this->assertSame('0', $pendingIndividualRow[8]);

        $teamExport = $this->actingAs($admin)
            ->get('/api/engagement/reward-challenge-submissions/export?submission_type=team')
            ->assertOk();
        $teamRows = array_map(
            fn (string $row) => str_getcsv($row, "\t"),
            explode("\n", trim($teamExport->streamedContent())),
        );
        $this->assertCount(2, $teamRows);
        $this->assertSame($leader->name, $teamRows[1][1]);
        $this->assertSame($leader->email, $teamRows[1][2]);
        $this->assertSame($teamChallenge->title, $teamRows[1][3]);
        $this->assertSame('100', $teamRows[1][6]);
        $this->assertSame('40', $teamRows[1][7]);
        $this->assertSame('140', $teamRows[1][8]);

        $this->getJson('/api/engagement/reward-challenge-submissions/export?submission_type=unknown')
            ->assertUnprocessable();
    }

    public function test_challenge_leaderboards_rank_approved_points_separately_and_mark_tied_winners(): void
    {
        $challenge = $this->createTeamChallenge(2);
        $otherChallenge = $this->createChallenge();
        $makeUser = fn (string $name) => User::create([
            'name' => $name,
            'email' => strtolower(str_replace(' ', '-', $name)).'-'.uniqid().'@example.test',
            'role' => User::ROLE_EMPLOYEE,
        ]);
        $firstWinner = $makeUser('A Individual Winner');
        $secondWinner = $makeUser('B Individual Winner');
        $pendingEmployee = $makeUser('Pending Individual');
        $declinedEmployee = $makeUser('Declined Individual');
        $teamMember = $makeUser('Team Member');

        foreach ([
            [$firstWinner, 'approved', 150, 50],
            [$secondWinner, 'approved', 150, 50],
            [$pendingEmployee, 'submitted', 900, 400],
            [$declinedEmployee, 'declined', 800, 300],
        ] as [$user, $status, $points, $bonusPoints]) {
            EngagementRewardChallengeParticipant::create([
                'reward_challenge_id' => $challenge->id,
                'user_id' => $user->id,
                'status' => $status,
                'joined_at' => now(),
                'submitted_at' => now(),
                'points_awarded' => $points,
                'bonus_points' => $bonusPoints,
            ]);
        }

        EngagementRewardChallengeParticipant::create([
            'reward_challenge_id' => $otherChallenge->id,
            'user_id' => $makeUser('Other Challenge Winner')->id,
            'status' => 'approved',
            'joined_at' => now(),
            'submitted_at' => now(),
            'points_awarded' => 10000,
        ]);

        $leader = $makeUser('Team Leader');
        $lowerScoringLeader = $makeUser('Lower Scoring Leader');
        $teamMemberParticipant = EngagementRewardChallengeParticipant::create([
            'reward_challenge_id' => $challenge->id,
            'user_id' => $teamMember->id,
            'status' => 'approved',
            'joined_at' => now(),
            'points_awarded' => 0,
        ]);

        $createTeamSubmission = function (
            User $submissionLeader,
            string $status,
            int $basePoints,
            int $bonusPoints,
            string $day,
        ) use ($challenge, $teamMember, $teamMemberParticipant) {
            $submission = EngagementRewardChallengeTeamSubmission::create([
                'reward_challenge_id' => $challenge->id,
                'leader_id' => $submissionLeader->id,
                'log_date' => $day,
                'submission_path' => 'challenge-proof.png',
                'status' => $status,
                'base_points_awarded' => $basePoints,
                'bonus_points_awarded' => $bonusPoints,
                'team_points_awarded' => $basePoints + $bonusPoints,
                'submitted_at' => now(),
                'reviewed_at' => $status === 'approved' ? now() : null,
            ]);

            EngagementRewardChallengeTeamSubmissionMember::create([
                'team_submission_id' => $submission->id,
                'participant_id' => $teamMemberParticipant->id,
                'user_id' => $teamMember->id,
                'full_name' => $teamMember->name,
            ]);
        };

        $createTeamSubmission($leader, 'approved', 0, 10, now()->toDateString());
        $createTeamSubmission($leader, 'approved', 100, 50, now()->addDay()->toDateString());
        $createTeamSubmission($leader, 'submitted', 1000, 1000, now()->addDays(2)->toDateString());
        $createTeamSubmission($lowerScoringLeader, 'approved', 100, 20, now()->toDateString());

        $departmentId = DB::table('departments')->insertGetId([
            'name' => 'Leaderboard Department',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        AccountEmployee::create([
            'user_id' => $firstWinner->id,
            'department_id' => $departmentId,
        ]);

        $response = $this->getJson("/api/engagement/reward-challenges/{$challenge->id}/participants")
            ->assertOk();

        $individualEntries = collect($response->json('data.individual_leaderboard'));
        $this->assertCount(4, $individualEntries);
        $this->assertSame(
            'Leaderboard Department',
            $individualEntries->firstWhere('name', 'A Individual Winner')['department'],
        );
        $this->assertSame(
            'Leaderboard Department',
            collect($response->json('data.participants'))
                ->firstWhere('name', 'A Individual Winner')['department'],
        );
        $departmentReport = $this->getJson('/api/engagement/reward-challenges/report/export?type=department_analytics')
            ->assertOk();
        $this->assertStringContainsString('Leaderboard Department', $departmentReport->streamedContent());
        $this->assertSame(
            [1, 1],
            $individualEntries
                ->where('is_winner', true)
                ->pluck('rank')
                ->all(),
        );
        $this->assertSame(
            [2, 2],
            $individualEntries
                ->where('is_winner', true)
                ->pluck('winner_count')
                ->all(),
        );
        foreach (['submitted', 'declined'] as $unapprovedStatus) {
            $unapprovedEntry = $individualEntries
                ->firstWhere('status', $unapprovedStatus);
            $this->assertSame(0, $unapprovedEntry['points_awarded']);
            $this->assertNull($unapprovedEntry['rank']);
            $this->assertFalse($unapprovedEntry['is_winner']);
        }
        $this->assertFalse($individualEntries->contains('name', 'Team Member'));
        $this->assertFalse($individualEntries->contains('name', 'Other Challenge Winner'));

        $teamEntries = collect($response->json('data.team_leaderboard'));
        $this->assertCount(2, $teamEntries);
        $this->assertSame("Team: {$leader->name}", $teamEntries[0]['name']);
        $this->assertSame(160, $teamEntries[0]['points_awarded']);
        $this->assertSame(100, $teamEntries[0]['challenge_points_awarded']);
        $this->assertSame(60, $teamEntries[0]['bonus_points_awarded']);
        $this->assertTrue($teamEntries[0]['is_winner']);
        $this->assertSame("Team: {$lowerScoringLeader->name}", $teamEntries[1]['name']);
        $this->assertSame(120, $teamEntries[1]['points_awarded']);
    }

    public function test_individual_bonus_points_are_validated_awarded_once_and_included_in_the_challenge_total(): void
    {
        $challenge = $this->createChallenge();
        $participant = EngagementRewardChallengeParticipant::create([
            'reward_challenge_id' => $challenge->id,
            'user_id' => auth()->id(),
            'status' => 'submitted',
            'joined_at' => now(),
            'submitted_at' => now(),
        ]);
        $approvalUrl = "/api/engagement/reward-challenge-submissions/{$participant->id}/approve";

        $this->getJson("/api/engagement/reward-challenges/{$challenge->id}/participants")->assertOk();
        $this->assertTrue(Cache::has($this->leaderboardCacheKey($challenge)));
        $this->postJson($approvalUrl, ['bonus_points' => -1])->assertUnprocessable();
        $this->postJson($approvalUrl, ['bonus_points' => 1.5])->assertUnprocessable();
        $this->assertSame('submitted', $participant->fresh()->status);

        $this->postJson($approvalUrl, ['bonus_points' => 25])
            ->assertOk()
            ->assertJsonPath('data.challenge_points_awarded', 100)
            ->assertJsonPath('data.bonus_points_awarded', 25)
            ->assertJsonPath('data.points_awarded', 125);
        $this->assertFalse(Cache::has($this->leaderboardCacheKey($challenge)));

        $this->postJson($approvalUrl, ['bonus_points' => 25])->assertUnprocessable();
        $this->assertSame(125, $participant->fresh()->points_awarded);
        $this->assertSame(25, $participant->fresh()->bonus_points);
        $this->getJson("/api/engagement/reward-challenges/{$challenge->id}/participants")
            ->assertOk()
            ->assertJsonPath('data.individual_leaderboard.0.points_awarded', 125)
            ->assertJsonPath('data.individual_leaderboard.0.challenge_points_awarded', 100)
            ->assertJsonPath('data.individual_leaderboard.0.bonus_points_awarded', 25)
            ->assertJsonPath('data.individual_leaderboard.0.is_winner', true);
        $this->getJson('/api/engagement/reward-challenges/profile-summary')
            ->assertOk()
            ->assertJsonPath('data.total_points', 125)
            ->assertJsonPath('data.challenge_history.0.challenge_points_awarded', 100)
            ->assertJsonPath('data.challenge_history.0.bonus_points_awarded', 25);

        $rejectedUser = User::create([
            'name' => 'Rejected Entry',
            'email' => 'rejected-entry-'.uniqid().'@example.test',
            'role' => User::ROLE_EMPLOYEE,
        ]);
        $rejectedParticipant = EngagementRewardChallengeParticipant::create([
            'reward_challenge_id' => $challenge->id,
            'user_id' => $rejectedUser->id,
            'status' => 'submitted',
            'joined_at' => now(),
            'submitted_at' => now(),
        ]);
        $this->postJson("/api/engagement/reward-challenge-submissions/{$rejectedParticipant->id}/decline")
            ->assertOk();
        $this->assertNull($rejectedParticipant->fresh()->points_awarded);
        $this->assertSame(0, $rejectedParticipant->fresh()->bonus_points);
    }

    public function test_backfill_awards_existing_approved_team_points_to_leader_only_and_rolls_back_safely(): void
    {
        Storage::fake('s3');
        $challenge = $this->createTeamChallenge();
        [$leader, $reports] = $this->createTeamLeaderWithReports(2);
        $admin = User::where('email', 'survey-admin@example.test')->firstOrFail();

        $response = $this->actingAs($leader)->post(
            "/api/engagement/reward-challenges/{$challenge->id}/submit-team",
            [
                'photo' => UploadedFile::fake()->image('historical-team-proof.png'),
                'challenge_description' => 'Approved before team points were recorded.',
            ],
        )->assertCreated();
        $submissionId = $response->json('data.team_submission_id');

        $this->actingAs($admin)
            ->postJson("/api/engagement/reward-challenge-submissions/team-{$submissionId}/approve")
            ->assertOk();

        DB::table('engagement_reward_challenge_team_submissions')
            ->where('id', $submissionId)
            ->update(['team_points_awarded' => 0]);

        $migration = require database_path('migrations/2026_10_13_000003_backfill_approved_team_points_to_leaders.php');
        $migration->up();
        $migration->up();

        $this->assertDatabaseHas('engagement_reward_challenge_team_submissions', [
            'id' => $submissionId,
            'team_points_awarded' => 100,
        ]);
        foreach ($reports as $report) {
            $participant = EngagementRewardChallengeParticipant::query()
                ->where('reward_challenge_id', $challenge->id)
                ->where('user_id', $report->id)
                ->firstOrFail();
            $this->assertSame(0, (int) $participant->points_awarded);
        }

        DB::table('engagement_reward_challenge_team_submissions')
            ->where('id', $submissionId)
            ->update(['team_points_awarded' => 125]);
        $migration->down();

        $this->assertDatabaseHas('engagement_reward_challenge_team_submissions', [
            'id' => $submissionId,
            'team_points_awarded' => 125,
        ]);
        $this->assertFalse(Schema::hasTable('engagement_reward_challenge_team_point_backfills'));
    }

    public function test_declined_team_submission_keeps_individual_member_state_and_can_be_resubmitted(): void
    {
        Storage::fake('s3');
        $challenge = $this->createTeamChallenge();
        [$leader, $reports] = $this->createTeamLeaderWithReports(2);
        $admin = User::where('email', 'survey-admin@example.test')->firstOrFail();

        $response = $this->actingAs($leader)->post(
            "/api/engagement/reward-challenges/{$challenge->id}/submit-team",
            [
                'photo' => UploadedFile::fake()->image('team-proof.png'),
                'challenge_description' => 'The team completed the activity together.',
            ],
        )->assertCreated();

        $submissionId = $response->json('data.team_submission_id');
        $this->actingAs($admin)
            ->getJson("/api/engagement/reward-challenges/{$challenge->id}/participants")
            ->assertOk();
        $this->assertTrue(Cache::has($this->leaderboardCacheKey($challenge)));
        $this->actingAs($admin)
            ->postJson("/api/engagement/reward-challenge-submissions/team-{$submissionId}/decline", [
                'review_note' => 'Please provide clearer proof.',
            ])
            ->assertOk()
            ->assertJsonPath('data.status', 'declined');
        $this->assertFalse(Cache::has($this->leaderboardCacheKey($challenge)));

        foreach ($reports as $report) {
            $participant = EngagementRewardChallengeParticipant::query()
                ->where('reward_challenge_id', $challenge->id)
                ->where('user_id', $report->id)
                ->firstOrFail();
            $this->assertSame('joined', $participant->status);
        }

        $this->getJson('/api/engagement/reward-challenge-team-submissions?status=declined')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.status', 'declined');

        $this->actingAs($leader)->post(
            "/api/engagement/reward-challenges/{$challenge->id}/submit-team",
            [
                'photo' => UploadedFile::fake()->image('team-proof-resubmitted.png'),
                'challenge_description' => 'The team submitted clearer proof.',
            ],
        )->assertCreated();
        $this->getJson('/api/engagement/reward-challenges/my')
            ->assertOk()
            ->assertJsonPath('data.0.team_submission_status', 'submitted')
            ->assertJsonPath('data.0.team_submission_locked', true);
    }

    public function test_daily_team_proof_is_shared_and_approved_for_all_direct_reports(): void
    {
        Storage::fake('s3');
        $challenge = $this->createTeamChallenge(2);
        [$leader, $reports] = $this->createTeamLeaderWithReports(2);
        $admin = User::where('email', 'survey-admin@example.test')->firstOrFail();

        $response = $this->actingAs($leader)->post(
            "/api/engagement/reward-challenges/{$challenge->id}/submit-team",
            [
                'photo' => UploadedFile::fake()->image('team-day-one.png'),
                'challenge_description' => 'Day one shared proof.',
            ],
        );
        $response->assertCreated();

        $submissionId = $response->json('data.team_submission_id');
        $this->assertDatabaseCount('engagement_reward_challenge_daily_logs', 2);
        $this->assertDatabaseHas('engagement_reward_challenge_daily_logs', [
            'team_submission_id' => $submissionId,
            'status' => 'submitted',
        ]);
        $this->actingAs(User::where('email', 'survey-admin@example.test')->firstOrFail())
            ->getJson('/api/engagement/reward-challenge-submissions')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', "team-{$submissionId}");
        $this->actingAs($admin)
            ->getJson('/api/engagement/reward-challenge-team-submissions')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonCount(2, 'data.0.employees');
        $this->actingAs($leader)->postJson("/api/engagement/reward-challenges/{$challenge->id}/submit-team", [
            'photo' => UploadedFile::fake()->image('duplicate-proof.png'),
            'challenge_description' => 'Duplicate proof.',
        ])->assertUnprocessable();

        $this->actingAs($admin)
            ->postJson("/api/engagement/reward-challenge-submissions/team-{$submissionId}/approve", [
                'bonus_points' => 5,
            ])
            ->assertOk();

        Carbon::setTestNow(now()->addDay());
        try {
            $secondDay = $this->actingAs($leader)->post(
                "/api/engagement/reward-challenges/{$challenge->id}/submit-team",
                [
                    'photo' => UploadedFile::fake()->image('team-day-two.png'),
                    'challenge_description' => 'Day two shared proof.',
                ],
            );
            $secondDay->assertCreated();
            $this->actingAs($admin)
                ->postJson('/api/engagement/reward-challenge-submissions/team-'.$secondDay->json('data.team_submission_id').'/approve', [
                    'bonus_points' => 5,
                ])
                ->assertOk();
        } finally {
            Carbon::setTestNow();
        }

        foreach ($reports as $report) {
            $participant = EngagementRewardChallengeParticipant::query()
                ->where('reward_challenge_id', $challenge->id)
                ->where('user_id', $report->id)
                ->firstOrFail();
            $this->assertSame(0, $participant->completed_days);
            $this->assertSame('joined', $participant->status);
            $this->assertSame(0, (int) $participant->points_awarded);
            $this->assertSame(2, $participant->dailyLogs()->whereNotNull('team_submission_id')->where('status', 'approved')->count());
        }
        $this->assertSame(
            [5, 105],
            EngagementRewardChallengeTeamSubmission::query()
                ->where('reward_challenge_id', $challenge->id)
                ->orderBy('log_date')
                ->pluck('team_points_awarded')
                ->all(),
        );
    }

    public function test_leader_sees_team_challenge_and_can_submit_for_eligible_reports(): void
    {
        Storage::fake('s3');
        $challenge = $this->createTeamChallenge();
        [$leader, $reports] = $this->createTeamLeaderWithReports(2);
        $leaderRecord = ERLeader::query()->where('user_id', $leader->id)->firstOrFail();
        $eligibleDepartmentId = DB::table('departments')->insertGetId([
            'name' => 'Eligible Department',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $otherDepartmentId = DB::table('departments')->insertGetId([
            'name' => 'Other Department',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        AccountEmployee::query()->where('user_id', $reports[0]->id)->update([
            'department_id' => $eligibleDepartmentId,
            'e_r_leader_id' => $leaderRecord->id,
        ]);
        AccountEmployee::query()->where('user_id', $reports[1]->id)->update([
            'department_id' => $otherDepartmentId,
            'e_r_leader_id' => $leaderRecord->id,
        ]);
        $challenge->update(['all_employees' => false]);
        $challenge->departments()->attach($eligibleDepartmentId);
        ERSubordinate::query()->where('er_leader_id', $leaderRecord->id)->delete();

        $this->actingAs($leader)
            ->getJson('/api/engagement/reward-challenges/my')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $challenge->id)
            ->assertJsonPath('data.0.type', 'Team');

        $response = $this->actingAs($leader)->post(
            "/api/engagement/reward-challenges/{$challenge->id}/submit-team",
            [
                'photo' => UploadedFile::fake()->image('eligible-team-proof.png'),
                'challenge_description' => 'The eligible team member completed the activity.',
            ],
        )->assertCreated();

        $submissionId = $response->json('data.team_submission_id');
        $this->assertDatabaseCount('engagement_reward_challenge_team_submission_members', 1);
        $this->assertDatabaseHas('engagement_reward_challenge_team_submission_members', [
            'team_submission_id' => $submissionId,
            'user_id' => $reports[0]->id,
        ]);
        $this->assertDatabaseMissing('engagement_reward_challenge_team_submission_members', [
            'team_submission_id' => $submissionId,
            'user_id' => $reports[1]->id,
        ]);
    }

    public function test_individual_then_team_proof_keeps_one_survey_and_question_set(): void
    {
        Storage::fake('s3');
        $challenge = $this->createTeamChallenge();
        (new ChallengeSurveyService)->createForChallenge($challenge);
        [$leader] = $this->createTeamLeaderWithReports();

        $this->actingAs($leader)
            ->postJson("/api/engagement/reward-challenges/{$challenge->id}/join")
            ->assertOk();
        $this->post("/api/engagement/reward-challenges/{$challenge->id}/submit", [
            'photo' => UploadedFile::fake()->image('individual-proof.png'),
            'challenge_description' => 'The leader completed the activity individually.',
        ])->assertOk();
        $this->post("/api/engagement/reward-challenges/{$challenge->id}/submit-team", [
            'photo' => UploadedFile::fake()->image('team-proof.png'),
            'challenge_description' => 'The team completed the activity together.',
        ])->assertCreated();

        $this->assertDatabaseCount('engagement_post_event_surveys', 1);
        $this->assertDatabaseCount('engagement_post_event_questions', 7);
        $this->getJson("/api/engagement/reward-challenges/{$challenge->id}/survey")
            ->assertOk()
            ->assertJsonCount(7, 'data.questions');
    }

    public function test_team_submission_migration_can_be_reversed(): void
    {
        (require database_path('migrations/2026_10_26_230000_separate_team_and_individual_daily_challenge_logs.php'))->down();
        (require database_path('migrations/2026_10_13_000001_add_team_points_awarded_to_team_submissions.php'))->down();
        $this->assertFalse(Schema::hasColumn('engagement_reward_challenge_team_submissions', 'team_points_awarded'));
        (require database_path('migrations/2026_10_12_232600_create_engagement_reward_challenge_team_submissions_tables.php'))->down();

        $this->assertFalse(Schema::hasTable('engagement_reward_challenge_team_submission_members'));
        $this->assertFalse(Schema::hasTable('engagement_reward_challenge_team_submissions'));
        $this->assertFalse(Schema::hasColumn('engagement_reward_challenge_daily_logs', 'team_submission_id'));
    }

    public function test_non_leaders_can_join_individually_but_cannot_submit_team_proofs(): void
    {
        $challenge = $this->createTeamChallenge();
        $nonLeader = User::create([
            'name' => 'Not a Leader',
            'email' => 'not-a-leader-'.uniqid().'@example.test',
            'role' => User::ROLE_EMPLOYEE,
        ]);

        $this->actingAs($nonLeader)
            ->getJson('/api/engagement/reward-challenge-team-submissions')
            ->assertForbidden();
        $this->postJson("/api/engagement/reward-challenges/{$challenge->id}/join")
            ->assertOk();
        $this->postJson("/api/engagement/reward-challenges/{$challenge->id}/submit-team", [
            'photo' => UploadedFile::fake()->image('team-proof.png'),
            'challenge_description' => 'Unauthorized proof.',
        ])->assertForbidden();
    }

    public function test_duration_challenge_accepts_one_proof_per_day_and_rejects_duplicates(): void
    {
        Storage::fake('s3');
        $challenge = $this->createChallenge();
        $challenge->update([
            'duration_days' => 3,
            'deadline' => now()->addDays(7)->toDateString(),
        ]);
        $this->postJson("/api/engagement/reward-challenges/{$challenge->id}/join")->assertOk();
        $participant = EngagementRewardChallengeParticipant::query()->firstOrFail();
        $url = "/api/engagement/reward-challenges/{$challenge->id}/submit-daily";
        $headers = ['Accept' => 'application/json'];

        $this->getJson("/api/engagement/reward-challenges/{$challenge->id}/participants")->assertOk();
        $this->assertTrue(Cache::has($this->leaderboardCacheKey($challenge)));
        $this->post($url, [
            'photo' => UploadedFile::fake()->image('proof.png'),
            'challenge_description' => 'Completed the daily activity.',
        ], $headers)->assertOk();
        $this->assertFalse(Cache::has($this->leaderboardCacheKey($challenge)));
        $this->getJson("/api/engagement/reward-challenges/{$challenge->id}/my-daily-logs")
            ->assertOk()
            ->assertJsonPath('data.required_days', 3)
            ->assertJsonPath('data.logs.0.log_date', now()->toDateString());

        $this->post($url, [
            'photo' => UploadedFile::fake()->image('duplicate.png'),
            'challenge_description' => 'Submitting a duplicate today.',
        ], $headers)->assertUnprocessable();

        $this->assertSame(1, $participant->dailyLogs()->count());
    }

    private function submitSurvey(EngagementRewardChallengeParticipant $participant, ?array $answers = null)
    {
        return $this->postJson("/api/engagement/reward-challenges/{$participant->reward_challenge_id}/survey/submit", [
            'answers' => $answers ?? $this->surveyAnswers($participant),
        ]);
    }

    public function test_single_proof_approval_waits_for_survey_and_finalizes_once(): void
    {
        $participant = $this->surveyParticipant();
        $this->postJson("/api/engagement/reward-challenge-submissions/{$participant->id}/approve", [
            'bonus_points' => 25,
        ])
            ->assertOk()
            ->assertJsonPath('data.status', 'approved')
            ->assertJsonPath('data.participation_status', 'pending_survey')
            ->assertJsonPath('data.bonus_points', 25);
        $this->assertSame('pending_survey', $participant->fresh()->status);
        $this->assertNull($participant->fresh()->points_awarded);
        $this->assertNotNull($participant->fresh()->proof_approved_at);
        $this->assertSame(25, $participant->fresh()->bonus_points);

        $this->postJson("/api/engagement/reward-challenge-submissions/{$participant->id}/approve")->assertUnprocessable();
        $this->postJson("/api/engagement/reward-challenge-submissions/{$participant->id}/decline")->assertUnprocessable();
        $this->submitSurvey($participant)->assertOk()->assertJsonPath('data.participation_status', 'approved')
            ->assertJsonPath('data.challenge_points_awarded', 100)
            ->assertJsonPath('data.bonus_points_awarded', 25)
            ->assertJsonPath('data.survey_points_awarded', 15)
            ->assertJsonPath('data.total_points_awarded', 140);
        $rewardedAt = $participant->fresh()->survey_rewarded_at;
        $this->submitSurvey($participant)->assertOk()->assertJsonPath('data.total_points_awarded', 140);
        $this->assertEquals($rewardedAt, $participant->fresh()->survey_rewarded_at);
        $this->assertSame(1, $participant->surveyResponse()->count());
        $this->assertSame(7, $participant->surveyResponse->answers()->count());
        $this->getJson('/api/engagement/reward-challenges/profile-summary')->assertOk()->assertJsonPath('data.total_points', 140);
    }

    public function test_one_user_survey_completion_is_shared_with_team_review_and_is_not_duplicated(): void
    {
        Storage::fake('s3');
        $challenge = $this->createTeamChallenge();
        (new ChallengeSurveyService)->createForChallenge($challenge);
        [$leader] = $this->createTeamLeaderWithReports();
        $participant = EngagementRewardChallengeParticipant::create([
            'reward_challenge_id' => $challenge->id,
            'user_id' => $leader->id,
            'status' => 'pending_survey',
            'joined_at' => now(),
            'submitted_at' => now(),
            'proof_approved_at' => now(),
        ]);
        $answers = $this->surveyAnswers($participant);

        $this->actingAs($leader)
            ->postJson("/api/engagement/reward-challenges/{$challenge->id}/survey/submit", ['answers' => $answers])
            ->assertOk()
            ->assertJsonPath('data.survey_completed', true);
        $this->postJson("/api/engagement/reward-challenges/{$challenge->id}/survey/submit", ['answers' => $answers])
            ->assertOk()
            ->assertJsonPath('data.survey_completed', true);

        $this->assertSame(1, DB::table('engagement_post_event_survey_responses')
            ->where('user_id', $leader->id)
            ->count());
        $this->getJson('/api/engagement/reward-challenges/my')
            ->assertOk()
            ->assertJsonPath('data.0.survey_completed', true);

        $teamSubmissionResponse = $this->post(
            "/api/engagement/reward-challenges/{$challenge->id}/submit-team",
            [
                'photo' => UploadedFile::fake()->image('team-proof.png'),
                'challenge_description' => 'The team completed the activity together.',
            ],
        )->assertCreated();

        $submissions = $this->actingAs(User::where('email', 'survey-admin@example.test')->firstOrFail())
            ->getJson('/api/engagement/reward-challenge-submissions')
            ->assertOk()
            ->json('data');
        $teamSubmission = collect($submissions)->firstWhere(
            'id',
            'team-'.$teamSubmissionResponse->json('data.team_submission_id'),
        );
        $individualSubmission = collect($submissions)->first(
            fn ($submission) => ($submission['employee']['id'] ?? null) === $leader->id
                && ! str_starts_with((string) $submission['id'], 'team-'),
        );

        $this->assertTrue($teamSubmission['employee']['survey_completed']);
        $this->assertTrue($teamSubmission['leader_survey_completed']);
        $this->assertSame(
            [false],
            collect($teamSubmission['employees'])->pluck('survey_completed')->all(),
        );
        $this->assertNull($individualSubmission);
    }

    public function test_survey_first_awards_only_fifteen_until_proof_is_approved(): void
    {
        $participant = $this->surveyParticipant();
        $this->submitSurvey($participant)->assertOk()->assertJsonPath('data.participation_status', 'submitted')
            ->assertJsonPath('data.challenge_points_awarded', 0)->assertJsonPath('data.total_points_awarded', 15);
        $this->getJson('/api/engagement/reward-challenges/profile-summary')->assertOk()
            ->assertJsonPath('data.total_points', 15)->assertJsonPath('data.challenge_history.0.survey_points_awarded', 15);
        $this->postJson("/api/engagement/reward-challenge-submissions/{$participant->id}/approve")->assertOk();
        $this->assertSame(100, $participant->fresh()->points_awarded);
        $this->assertSame(115, $participant->fresh()->total_points_awarded);
        $this->getJson("/api/engagement/reward-challenges/{$participant->reward_challenge_id}/survey")
            ->assertOk()->assertJsonPath('data.user_has_responded', true)->assertJsonPath('data.can_submit', false);
        $this->getJson('/api/engagement/reward-challenges/my')->assertOk()
            ->assertJsonPath('data.0.survey_completed', true)->assertJsonPath('data.0.total_points_awarded', 115);
    }

    public function test_challenge_survey_response_unique_index_can_be_reversed(): void
    {
        $migration = require database_path('migrations/2026_10_13_000002_add_unique_user_challenge_survey_response.php');

        $this->assertTrue(Schema::hasIndex(
            'engagement_post_event_survey_responses',
            'epe_response_survey_user_unique',
        ));
        $migration->down();
        $this->assertFalse(Schema::hasIndex(
            'engagement_post_event_survey_responses',
            'epe_response_survey_user_unique',
        ));
        $migration->up();
        $this->assertTrue(Schema::hasIndex(
            'engagement_post_event_survey_responses',
            'epe_response_survey_user_unique',
        ));
    }

    public function test_daily_approval_counts_once_and_unlocks_survey_only_at_threshold(): void
    {
        Storage::fake('s3');
        $participant = $this->surveyParticipant(true);
        $this->submitSurvey($participant)->assertUnprocessable();
        $logs = [];
        foreach ([0, 1] as $offset) {
            $logs[] = EngagementRewardChallengeDailyLog::create([
                'reward_challenge_participant_id' => $participant->id,
                'log_date' => now()->addDays($offset)->toDateString(),
                'submission_path' => "proof-$offset.png",
                'status' => 'submitted',
            ]);
        }
        $this->getJson("/api/engagement/reward-challenges/{$participant->reward_challenge_id}/participants")->assertOk();
        $this->assertTrue(Cache::has($this->leaderboardCacheKey($participant->challenge)));
        $this->postJson("/api/engagement/reward-challenge-submissions/daily-{$logs[0]->id}/approve")->assertOk();
        $this->assertFalse(Cache::has($this->leaderboardCacheKey($participant->challenge)));
        $this->assertSame(1, $participant->fresh()->completed_days);
        $this->submitSurvey($participant)->assertUnprocessable();
        $this->postJson("/api/engagement/reward-challenge-submissions/daily-{$logs[0]->id}/approve")->assertUnprocessable();
        $this->assertSame(1, $participant->fresh()->completed_days);
        $this->postJson("/api/engagement/reward-challenge-submissions/daily-{$logs[1]->id}/approve")->assertOk();
        $this->assertSame('pending_survey', $participant->fresh()->status);
        $this->assertSame(2, $participant->fresh()->completed_days);
        $this->assertNull($participant->fresh()->points_awarded);
        $this->getJson("/api/engagement/reward-challenges/{$participant->reward_challenge_id}/participants")->assertOk();
        $this->assertTrue(Cache::has($this->leaderboardCacheKey($participant->challenge)));
        $this->submitSurvey($participant)->assertOk()->assertJsonPath('data.total_points_awarded', 115);
        $this->assertFalse(Cache::has($this->leaderboardCacheKey($participant->challenge)));
        $this->postJson("/api/engagement/reward-challenge-submissions/daily-{$logs[1]->id}/approve")->assertUnprocessable();
        $this->assertSame(2, $participant->fresh()->completed_days);
    }

    public function test_invalid_answers_and_foreign_question_ids_cannot_award_points(): void
    {
        $participant = $this->surveyParticipant();
        $answers = $this->surveyAnswers($participant);
        $ratingId = array_key_first($answers);
        $paragraphId = array_key_last($answers);

        foreach ([0, 6, 1.5, 'bad', [5], null] as $rating) {
            $this->submitSurvey($participant, array_replace($answers, [$ratingId => $rating]))
                ->assertUnprocessable()->assertJsonValidationErrors("answers.$ratingId");
        }
        $this->submitSurvey($participant, array_replace($answers, [$paragraphId => ['invalid']]))->assertUnprocessable();
        unset($answers[$ratingId]);
        $this->submitSurvey($participant, $answers)->assertUnprocessable();
        $other = $this->surveyParticipant();
        $foreignId = array_key_first($this->surveyAnswers($other));
        $this->submitSurvey($participant, [$foreignId => 5] + $this->surveyAnswers($participant))
            ->assertUnprocessable()->assertJsonValidationErrors('answers');
        $this->assertSame(0, EngagementPostEventSurveyResponse::count());
        $this->assertSame(0, $participant->fresh()->survey_points_awarded);

        $ratingsOnly = $participant->challenge->survey->questions->where('type', 'rating')
            ->mapWithKeys(fn ($question) => [$question->id => 1])->all();
        $this->submitSurvey($participant, $ratingsOnly)->assertOk();
        $this->assertSame(4, $participant->surveyResponse->answers()->count());
    }

    public function test_survey_requires_authenticated_participation_and_ignores_employee_spoofing(): void
    {
        $participant = $this->surveyParticipant();
        $url = "/api/engagement/reward-challenges/{$participant->reward_challenge_id}/survey";
        $owner = auth()->user();
        $other = User::create(['name' => 'Other', 'email' => 'other@example.test', 'role' => 2]);
        $this->actingAs($other);
        $this->getJson($url)->assertForbidden();
        $this->submitSurvey($participant)->assertForbidden();
        $this->actingAs($owner);
        $this->postJson($url.'/submit', ['answers' => $this->surveyAnswers($participant), 'user_id' => $other->id])
            ->assertOk();
        $this->assertSame($owner->id, $participant->surveyResponse->user_id);
        $this->assertSame(15, $participant->fresh()->survey_points_awarded);
        $this->app['auth']->forgetGuards();
        $this->getJson($url)->assertUnauthorized();
        $this->postJson($url.'/submit', ['answers' => $this->surveyAnswers($participant)])->assertUnauthorized();
    }

    public function test_upcoming_joined_declined_closed_and_missing_surveys_do_not_finalize(): void
    {
        $participant = $this->surveyParticipant();
        $participant->update(['status' => 'joined', 'submitted_at' => null]);
        $this->submitSurvey($participant)->assertUnprocessable();
        $participant->update(['status' => 'declined', 'submitted_at' => now()]);
        $this->submitSurvey($participant)->assertUnprocessable();
        $participant->update(['status' => 'submitted']);
        $participant->challenge->update(['start_date' => now()->addDay()]);
        $this->submitSurvey($participant)->assertUnprocessable();
        $participant->challenge->update(['start_date' => now()]);
        $participant->challenge->survey->update(['status' => 'closed']);
        $this->submitSurvey($participant)->assertUnprocessable();
        $participant->challenge->survey->delete();
        $this->submitSurvey($participant)->assertNotFound();
        $this->postJson("/api/engagement/reward-challenge-submissions/{$participant->id}/approve")->assertOk();
        $this->assertSame('pending_survey', $participant->fresh()->status);
        $this->assertNull($participant->fresh()->points_awarded);
        $this->assertSame(0, $participant->fresh()->survey_points_awarded);
    }

    public function test_survey_failure_rolls_back_response_reward_and_finalization(): void
    {
        $participant = $this->surveyParticipant();
        $this->postJson("/api/engagement/reward-challenge-submissions/{$participant->id}/approve")->assertOk();
        Event::listen('eloquent.created: '.EngagementPostEventAnswer::class, function () {
            throw new \RuntimeException('Answer persistence failed.');
        });
        $this->withoutExceptionHandling();
        try {
            $this->submitSurvey($participant);
            $this->fail('Answer failure must surface.');
        } catch (\RuntimeException $exception) {
            $this->assertSame('Answer persistence failed.', $exception->getMessage());
        }
        $this->assertSame(0, EngagementPostEventSurveyResponse::count());
        $this->assertSame(0, EngagementPostEventAnswer::count());
        $this->assertSame('pending_survey', $participant->fresh()->status);
        $this->assertSame(0, $participant->fresh()->survey_points_awarded);
        $this->assertNull($participant->fresh()->survey_rewarded_at);
        $this->assertNull($participant->fresh()->points_awarded);
    }

    public function test_reward_survives_decline_and_cannot_be_reset_by_leaving(): void
    {
        $participant = $this->surveyParticipant();
        $this->submitSurvey($participant)->assertOk();
        $challenge = $participant->challenge;
        $this->getJson("/api/engagement/reward-challenges/{$challenge->id}/participants")->assertOk();
        $this->assertTrue(Cache::has($this->leaderboardCacheKey($challenge)));
        $this->postJson("/api/engagement/reward-challenge-submissions/{$participant->id}/decline")->assertOk();
        $this->assertFalse(Cache::has($this->leaderboardCacheKey($challenge)));
        $this->assertSame('declined', $participant->fresh()->status);
        $this->deleteJson("/api/engagement/reward-challenges/{$participant->reward_challenge_id}/leave")->assertUnprocessable();
        Storage::fake('s3');
        $this->getJson("/api/engagement/reward-challenges/{$challenge->id}/participants")->assertOk();
        $this->assertTrue(Cache::has($this->leaderboardCacheKey($challenge)));
        $this->post("/api/engagement/reward-challenges/{$participant->reward_challenge_id}/submit", [
            'photo' => UploadedFile::fake()->image('proof.png'),
            'challenge_description' => 'Updated proof.',
        ], ['Accept' => 'application/json'])->assertOk();
        $this->assertFalse(Cache::has($this->leaderboardCacheKey($challenge)));
        $this->submitSurvey($participant)->assertOk()->assertJsonPath('data.survey_points_awarded', 15);
        $this->postJson("/api/engagement/reward-challenge-submissions/{$participant->id}/approve")->assertOk();
        $this->assertSame(115, $participant->fresh()->total_points_awarded);
        $this->assertSame(1, $participant->surveyResponse()->count());
    }

    public function test_proof_type_persists_and_existing_challenges_default_to_photo_only(): void
    {
        $challenge = $this->createChallenge();
        $this->assertSame('photo_only', $challenge->fresh()->proof_type);

        $this->postJson('/api/engagement/reward-challenges', [
            ...$this->challengeData(),
            'proof_type' => 'video_only',
        ])->assertUnprocessable()->assertJsonValidationErrors('proof_type');

        $created = $this->postJson('/api/engagement/reward-challenges', [
            ...$this->challengeData(),
            'proof_type' => 'photo_or_video',
        ])->assertCreated()->assertJsonPath('data.proof_type', 'photo_or_video');
        $createdId = $created->json('data.id');

        $this->putJson("/api/engagement/reward-challenges/{$createdId}", [
            'duration_days' => 9,
        ])->assertUnprocessable()->assertJsonValidationErrors('duration_days');

        $this->putJson("/api/engagement/reward-challenges/{$createdId}", [
            'proof_type' => 'photo_only',
        ])->assertOk()->assertJsonPath('data.proof_type', 'photo_only');
        $this->getJson('/api/engagement/reward-challenges')
            ->assertOk()
            ->assertJsonPath('data.0.proof_type', 'photo_only');
    }

    public function test_individual_proof_accepts_at_most_three_images_and_returns_media_urls(): void
    {
        Storage::fake('s3');
        $challenge = $this->createChallenge();
        $this->postJson("/api/engagement/reward-challenges/{$challenge->id}/join")->assertOk();

        $tooMany = $this->post("/api/engagement/reward-challenges/{$challenge->id}/submit", [
            'photos' => [
                UploadedFile::fake()->image('proof-1.png'),
                UploadedFile::fake()->image('proof-2.png'),
                UploadedFile::fake()->image('proof-3.png'),
                UploadedFile::fake()->image('proof-4.png'),
            ],
            'challenge_description' => 'Completed the activity.',
        ], ['Accept' => 'application/json']);
        $tooMany->assertUnprocessable()->assertJsonValidationErrors('photos');
        $joinedParticipant = EngagementRewardChallengeParticipant::query()->firstOrFail();
        $this->assertSame('joined', $joinedParticipant->status);
        $this->assertNull($joinedParticipant->submission_path);
        $this->assertSame([], Storage::disk('s3')->allFiles());

        $response = $this->post("/api/engagement/reward-challenges/{$challenge->id}/submit", [
            'photos' => [
                UploadedFile::fake()->image('proof-1.png'),
                UploadedFile::fake()->image('proof-2.png'),
                UploadedFile::fake()->image('proof-3.png'),
            ],
            'challenge_description' => 'Completed the activity.',
        ], ['Accept' => 'application/json']);

        $response->assertOk()
            ->assertJsonCount(3, 'data.submission_media')
            ->assertJsonPath('data.submission_media.0.type', 'image');
        $participant = EngagementRewardChallengeParticipant::query()->firstOrFail();
        $this->assertCount(3, $participant->submission_media);
        $this->assertCount(3, Storage::disk('s3')->allFiles());
    }

    public function test_video_proof_requires_challenge_video_configuration(): void
    {
        Storage::fake('s3');
        $challenge = $this->createChallenge();
        $this->postJson("/api/engagement/reward-challenges/{$challenge->id}/join")->assertOk();

        $video = UploadedFile::fake()->create('proof.mp4', 100, 'video/mp4');
        $this->post("/api/engagement/reward-challenges/{$challenge->id}/submit", [
            'video' => $video,
            'challenge_description' => 'Completed the activity.',
        ], ['Accept' => 'application/json'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('video');
        $this->assertSame([], Storage::disk('s3')->allFiles());

        $challenge->update(['proof_type' => 'photo_or_video']);
        $response = $this->post("/api/engagement/reward-challenges/{$challenge->id}/submit", [
            'video' => UploadedFile::fake()->create('proof.mp4', 100, 'video/mp4'),
            'challenge_description' => 'Completed the activity.',
        ], ['Accept' => 'application/json']);
        $response->assertOk()
            ->assertJsonPath('data.submission_media.0.type', 'video');
        $this->assertSame('video', EngagementRewardChallengeParticipant::query()->firstOrFail()->submission_media[0]['type']);
    }

    public function test_individual_daily_and_team_video_validation_allows_up_to_one_gigabyte(): void
    {
        $expectedRule = 'max:1048576';

        $this->assertContains($expectedRule, (new SubmitChallengeProofRequest())->rules()['video']);
        $this->assertContains($expectedRule, (new SubmitTeamChallengeRequest())->rules()['video']);

        $phpLimits = parse_ini_file(public_path('.user.ini'));
        $this->assertSame('1024M', $phpLimits['upload_max_filesize']);
        $this->assertSame('1100M', $phpLimits['post_max_size']);
    }

    public function test_daily_and_team_submissions_reject_more_than_three_images(): void
    {
        Storage::fake('s3');
        $dailyChallenge = $this->createChallenge();
        $dailyChallenge->update(['duration_days' => 2]);
        $this->postJson("/api/engagement/reward-challenges/{$dailyChallenge->id}/join")->assertOk();
        $dailyResponse = $this->post("/api/engagement/reward-challenges/{$dailyChallenge->id}/submit-daily", [
            'photos' => [
                UploadedFile::fake()->image('daily-1.png'),
                UploadedFile::fake()->image('daily-2.png'),
                UploadedFile::fake()->image('daily-3.png'),
                UploadedFile::fake()->image('daily-4.png'),
            ],
            'challenge_description' => 'Completed the daily activity.',
        ], ['Accept' => 'application/json']);
        $dailyResponse->assertUnprocessable()->assertJsonValidationErrors('photos');
        $this->assertSame(0, EngagementRewardChallengeDailyLog::count());

        $acceptedDaily = $this->post("/api/engagement/reward-challenges/{$dailyChallenge->id}/submit-daily", [
            'photos' => [
                UploadedFile::fake()->image('daily-1.png'),
                UploadedFile::fake()->image('daily-2.png'),
                UploadedFile::fake()->image('daily-3.png'),
            ],
            'challenge_description' => 'Completed the daily activity.',
        ], ['Accept' => 'application/json']);
        $acceptedDaily->assertOk();
        $this->assertCount(3, EngagementRewardChallengeDailyLog::query()->firstOrFail()->submission_media);

        $teamChallenge = $this->createTeamChallenge();
        [$leader] = $this->createTeamLeaderWithReports();
        $teamResponse = $this->actingAs($leader)->post("/api/engagement/reward-challenges/{$teamChallenge->id}/submit-team", [
            'photos' => [
                UploadedFile::fake()->image('team-1.png'),
                UploadedFile::fake()->image('team-2.png'),
                UploadedFile::fake()->image('team-3.png'),
                UploadedFile::fake()->image('team-4.png'),
            ],
            'challenge_description' => 'Completed the team activity.',
        ], ['Accept' => 'application/json']);
        $teamResponse->assertUnprocessable()->assertJsonValidationErrors('photos');
        $this->assertSame(0, EngagementRewardChallengeTeamSubmission::count());

        $acceptedTeam = $this->actingAs($leader)->post("/api/engagement/reward-challenges/{$teamChallenge->id}/submit-team", [
            'photos' => [
                UploadedFile::fake()->image('team-1.png'),
                UploadedFile::fake()->image('team-2.png'),
                UploadedFile::fake()->image('team-3.png'),
            ],
            'challenge_description' => 'Completed the team activity.',
        ], ['Accept' => 'application/json']);
        $acceptedTeam->assertCreated();
        $this->assertCount(3, EngagementRewardChallengeTeamSubmission::query()->firstOrFail()->submission_media);
        $this->assertCount(6, Storage::disk('s3')->allFiles());

        $teamVideoChallenge = $this->createTeamChallenge();
        $teamVideoChallenge->update(['proof_type' => 'photo_or_video']);
        $teamVideoResponse = $this->actingAs($leader)->post("/api/engagement/reward-challenges/{$teamVideoChallenge->id}/submit-team", [
            'video' => UploadedFile::fake()->create('team-proof.mp4', 100, 'video/mp4'),
            'challenge_description' => 'Completed the team activity.',
        ], ['Accept' => 'application/json']);
        $teamVideoResponse->assertCreated()
            ->assertJsonPath('data.submission_media.0.type', 'video');
        $this->assertCount(7, Storage::disk('s3')->allFiles());
    }

    public function test_my_challenges_query_count_does_not_grow_with_the_number_of_challenges(): void
    {
        $countQueries = function (): int {
            DB::flushQueryLog();
            DB::enableQueryLog();
            $this->getJson('/api/engagement/reward-challenges/my')->assertOk();
            $count = count(DB::getQueryLog());
            DB::disableQueryLog();

            return $count;
        };

        $joinAndSurvey = function (): void {
            $participant = $this->surveyParticipant();
            $this->submitSurvey($participant)->assertOk();
            $daily = $this->createChallenge();
            $daily->update(['duration_days' => 3]);
            $this->postJson("/api/engagement/reward-challenges/{$daily->id}/join")->assertOk();
        };

        $joinAndSurvey();
        $baseline = $countQueries();

        for ($index = 0; $index < 5; $index++) {
            $joinAndSurvey();
        }

        $this->assertSame($baseline, $countQueries());
    }

    public function test_my_challenges_batch_loading_keeps_the_same_per_user_payload(): void
    {
        Storage::fake('s3');
        $participant = $this->surveyParticipant();
        $this->submitSurvey($participant)->assertOk();
        $daily = $this->createChallenge();
        $daily->update(['duration_days' => 3]);
        $this->postJson("/api/engagement/reward-challenges/{$daily->id}/join")->assertOk();
        $this->post("/api/engagement/reward-challenges/{$daily->id}/submit-daily", [
            'photos' => [UploadedFile::fake()->image('day-1.png')],
            'challenge_description' => 'Day one.',
        ], ['Accept' => 'application/json'])->assertOk();
        $notJoined = $this->createChallenge();

        $cards = collect($this->getJson('/api/engagement/reward-challenges/my')->assertOk()->json('data'))
            ->keyBy('id');

        $this->assertTrue($cards[$participant->reward_challenge_id]['is_joined']);
        $this->assertTrue($cards[$participant->reward_challenge_id]['survey_completed']);
        $this->assertTrue($cards[$daily->id]['is_joined']);
        $this->assertTrue($cards[$daily->id]['submitted_today']);
        $this->assertCount(1, $cards[$daily->id]['submission_media']);
        $this->assertFalse($cards[$daily->id]['survey_completed']);
        $this->assertFalse($cards[$notJoined->id]['is_joined']);
        $this->assertNull($cards[$notJoined->id]['participation_status']);
        $this->assertSame(1, $cards[$daily->id]['participants_count']);
    }

    public function test_join_enforces_the_participant_limit_and_rejects_double_joins_cleanly(): void
    {
        $challenge = $this->createChallenge();
        $challenge->update(['max_participants' => 1]);

        $this->postJson("/api/engagement/reward-challenges/{$challenge->id}/join")->assertOk();
        $this->postJson("/api/engagement/reward-challenges/{$challenge->id}/join")
            ->assertUnprocessable()
            ->assertJsonPath('message', 'You already joined this challenge.');

        $this->actingAs(User::create(['name' => 'Late Joiner', 'email' => 'late@example.test', 'role' => User::ROLE_EMPLOYEE]));
        $this->postJson("/api/engagement/reward-challenges/{$challenge->id}/join")
            ->assertUnprocessable()
            ->assertJsonPath('message', 'This challenge has reached its participant limit.');

        $this->assertSame(1, EngagementRewardChallengeParticipant::query()->count());
    }

    public function test_repeated_individual_submit_is_rejected_and_leaves_no_orphaned_files(): void
    {
        Storage::fake('s3');
        $challenge = $this->createChallenge();
        $this->postJson("/api/engagement/reward-challenges/{$challenge->id}/join")->assertOk();
        $submit = fn () => $this->post("/api/engagement/reward-challenges/{$challenge->id}/submit", [
            'photos' => [UploadedFile::fake()->image('proof.png')],
            'challenge_description' => 'Completed the activity.',
        ], ['Accept' => 'application/json']);

        $submit()->assertOk();
        $submit()->assertUnprocessable()
            ->assertJsonPath('message', 'A submission is already pending or approved for this challenge.');

        $this->assertCount(1, Storage::disk('s3')->allFiles());
        $this->assertSame('submitted', EngagementRewardChallengeParticipant::query()->firstOrFail()->status);
    }

    public function test_rnr_performance_index_migration_is_reversible(): void
    {
        $migration = require database_path('migrations/2026_10_16_000001_add_rnr_performance_indexes.php');

        $migration->up();
        $migration->up();
        $this->assertTrue(Schema::hasIndex('engagement_reward_challenge_participants', 'erc_participants_status_submitted_idx'));
        $this->assertTrue(Schema::hasIndex('engagement_reward_challenge_daily_logs', 'erc_daily_logs_status_date_idx'));
        $this->assertTrue(Schema::hasIndex('engagement_reward_challenge_team_submissions', 'erc_team_sub_status_submitted_idx'));

        $migration->down();
        $this->assertFalse(Schema::hasIndex('engagement_reward_challenge_participants', 'erc_participants_status_submitted_idx'));
        $this->assertFalse(Schema::hasIndex('engagement_reward_challenge_daily_logs', 'erc_daily_logs_status_date_idx'));
        $this->assertFalse(Schema::hasIndex('engagement_reward_challenge_team_submissions', 'erc_team_sub_status_submitted_idx'));
    }

    private function seedIndividualSubmissions(int $singleCount, int $dailyCount): EngagementRewardChallenge
    {
        $challenge = $this->createChallenge();
        // User::account_employee() always eager-loads site; the in-memory schema lacks it.
        if (! Schema::hasTable('sites')) {
            Schema::create('sites', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('location_id')->nullable();
                $table->string('name')->nullable();
                $table->timestamps();
            });
        }
        $location = DB::table('locations')->insertGetId(['name' => 'Manila Site']);

        for ($index = 1; $index <= $singleCount; $index++) {
            $user = User::create([
                'name' => "Single Employee {$index}",
                'email' => "single-{$index}@example.test",
                'role' => User::ROLE_EMPLOYEE,
            ]);
            AccountEmployee::create(['user_id' => $user->id, 'location_id' => $location]);
            EngagementRewardChallengeParticipant::create([
                'reward_challenge_id' => $challenge->id,
                'user_id' => $user->id,
                'status' => 'submitted',
                'joined_at' => now(),
                'submitted_at' => now()->subMinutes($index * 2),
            ]);
        }

        for ($index = 1; $index <= $dailyCount; $index++) {
            $user = User::create([
                'name' => "Daily Employee {$index}",
                'email' => "daily-{$index}@example.test",
                'role' => User::ROLE_EMPLOYEE,
            ]);
            $participant = EngagementRewardChallengeParticipant::create([
                'reward_challenge_id' => $challenge->id,
                'user_id' => $user->id,
                'status' => 'joined',
                'joined_at' => now(),
                'required_days' => 2,
                'completed_days' => 0,
            ]);
            EngagementRewardChallengeDailyLog::create([
                'reward_challenge_participant_id' => $participant->id,
                'log_date' => now()->toDateString(),
                'submission_path' => "proof/daily-{$index}.png",
                'status' => 'submitted',
                'submitted_at' => now()->subMinutes(($index * 2) - 1),
            ]);
        }

        return $challenge;
    }

    public function test_paginated_individual_submissions_merge_single_and_daily_rows_by_date(): void
    {
        $challenge = $this->seedIndividualSubmissions(12, 3);

        $first = $this->getJson('/api/engagement/reward-challenge-submissions?type=individual&per_page=10')
            ->assertOk()
            ->assertJsonCount(10, 'data')
            ->assertJsonPath('meta.current_page', 1)
            ->assertJsonPath('meta.last_page', 2)
            ->assertJsonPath('meta.total', 15)
            ->assertJsonPath('counts.individual', 15)
            ->assertJsonPath('counts.team', 0)
            ->assertJsonPath('filter_options.challenges.0.value', $challenge->id)
            ->assertJsonPath('filter_options.locations.0.label', 'Manila Site');

        // Daily logs interleave with single proofs strictly by submitted_at.
        $this->assertSame('daily-', substr((string) $first->json('data.0.id'), 0, 6));
        $dates = collect($first->json('data'))->pluck('submitted_at')->all();
        $sorted = $dates;
        rsort($sorted);
        $this->assertSame($sorted, $dates);

        $second = $this->getJson('/api/engagement/reward-challenge-submissions?type=individual&per_page=10&page=2')
            ->assertOk()
            ->assertJsonCount(5, 'data')
            ->assertJsonPath('meta.current_page', 2);

        $ids = collect($first->json('data'))->pluck('id')->merge(collect($second->json('data'))->pluck('id'));
        $this->assertCount(15, $ids->unique());
    }

    public function test_paginated_submissions_respect_filters_and_team_type(): void
    {
        $this->seedIndividualSubmissions(4, 1);
        Storage::fake('s3');
        $teamChallenge = $this->createTeamChallenge();
        [$leader] = $this->createTeamLeaderWithReports(2);
        $admin = auth()->user();
        $this->actingAs($leader)->post("/api/engagement/reward-challenges/{$teamChallenge->id}/submit-team", [
            'photo' => UploadedFile::fake()->image('team-proof.png'),
            'challenge_description' => 'Team proof.',
        ])->assertCreated();
        $this->actingAs($admin);

        $this->getJson('/api/engagement/reward-challenge-submissions?type=team')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('counts.individual', 5)
            ->assertJsonPath('counts.team', 1)
            ->assertJsonCount(2, 'data.0.employees');

        $this->getJson('/api/engagement/reward-challenge-submissions?type=individual&search=Single Employee 3')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.employee.name', 'Single Employee 3');

        $this->getJson('/api/engagement/reward-challenge-submissions?type=individual&challenge_id='.$teamChallenge->id)
            ->assertOk()
            ->assertJsonCount(0, 'data')
            ->assertJsonPath('counts.individual', 0)
            ->assertJsonPath('counts.team', 1);

        $this->getJson('/api/engagement/reward-challenge-submissions?type=individual&per_page=51')
            ->assertUnprocessable();

        // Without a type the legacy full list (used by older callers) is unchanged.
        $legacy = $this->getJson('/api/engagement/reward-challenge-submissions')
            ->assertOk()
            ->assertJsonCount(6, 'data');
        $this->assertNull($legacy->json('meta'));
    }

    public function test_reused_survey_ids_do_not_inherit_stale_event_questions(): void
    {
        $participant = $this->surveyParticipant();
        $survey = $participant->challenge->survey;
        $eventId = DB::table('engagement_post_events')->insertGetId(['title' => 'Old event', 'category' => 'Event']);

        foreach (['Old event rating', 'Old event feedback'] as $index => $text) {
            EngagementPostEventQuestion::create([
                'engagement_post_event_id' => $eventId,
                'engagement_post_event_survey_id' => $survey->id,
                'question' => $text,
                'type' => 'paragraph',
                'is_required' => true,
                'sort_order' => 20 + $index,
            ]);
        }
        $this->assertSame(9, $survey->questions()->count());

        $this->getJson("/api/engagement/reward-challenges/{$participant->reward_challenge_id}/survey")
            ->assertOk()
            ->assertJsonCount(7, 'data.questions')
            ->assertJsonMissing(['question' => 'Old event rating']);
        $this->assertSame(7, $survey->questions()->count());
        $this->assertSame(2, EngagementPostEventQuestion::where('engagement_post_event_id', $eventId)->whereNull('engagement_post_event_survey_id')->count());
    }

    public function test_deleting_an_event_survey_removes_its_questions_and_responses(): void
    {
        $eventId = DB::table('engagement_post_events')->insertGetId(['title' => 'Event', 'category' => 'Event']);
        $created = $this->postJson('/api/engagement/surveys', [
            'engagement_post_event_id' => $eventId,
            'title' => 'Event survey',
            'questions' => [
                ['question_text' => 'Rate event', 'question_type' => 'rating', 'is_required' => true],
            ],
        ])->assertCreated();
        $id = $created->json('data.id');
        $questionId = $created->json('data.questions.0.id');
        $this->postJson("/api/engagement/surveys/{$id}/submit", ['answers' => [$questionId => 5]])->assertOk();

        $this->deleteJson("/api/engagement/surveys/{$id}")->assertSuccessful();

        $this->assertSame(0, EngagementPostEventQuestion::where('engagement_post_event_survey_id', $id)->count());
        $this->assertSame(0, EngagementPostEventSurveyResponse::where('engagement_post_event_survey_id', $id)->count());
        $this->assertSame(0, EngagementPostEventAnswer::where('engagement_post_event_question_id', $questionId)->count());
    }

    public function test_legacy_challenges_still_complete_without_survey(): void
    {
        $challenge = $this->createChallenge();
        $participant = EngagementRewardChallengeParticipant::create([
            'reward_challenge_id' => $challenge->id, 'user_id' => auth()->id(),
            'status' => 'submitted', 'submitted_at' => now(),
        ]);
        $this->postJson("/api/engagement/reward-challenge-submissions/{$participant->id}/approve")->assertOk();
        $this->assertSame('approved', $participant->fresh()->status);
        $this->assertSame(100, $participant->fresh()->points_awarded);
        $this->assertSame(0, $participant->fresh()->survey_points_awarded);
        $this->getJson("/api/engagement/reward-challenges/{$challenge->id}/survey")->assertNotFound();
    }

    public function test_qualifying_survey_remains_available_after_deadline(): void
    {
        $participant = $this->surveyParticipant();
        $participant->challenge->update(['start_date' => now()->subDays(8), 'deadline' => now()->subDay()]);
        $this->postJson("/api/engagement/reward-challenge-submissions/{$participant->id}/approve")->assertOk();
        $this->getJson("/api/engagement/reward-challenges/{$participant->reward_challenge_id}/survey")
            ->assertOk()->assertJsonPath('data.can_submit', true)->assertJsonPath('data.reward_points', 15);
        $this->submitSurvey($participant)->assertOk()->assertJsonPath('data.participation_status', 'approved');
    }

    public function test_totals_reports_exports_and_profiles_include_separate_survey_reward(): void
    {
        $participant = $this->surveyParticipant();
        $this->submitSurvey($participant)->assertOk();
        $this->getJson('/api/engagement/reward-challenges/report')->assertOk()->assertJsonPath('data.quarters.0.points', '15 pts awarded');
        $this->getJson('/api/engagement/reward-challenges/employee-profiles')->assertOk()->assertJsonPath('data.employees.0.points', 15);
        $this->getJson("/api/engagement/reward-challenges/{$participant->reward_challenge_id}/participants")->assertOk()
            ->assertJsonPath('data.participants.0.survey_points_awarded', 15)->assertJsonPath('data.participants.0.total_points_awarded', 15);
        foreach (['top10_leaderboard', 'top20_leaderboard', 'full_participation', 'points_distribution', 'department_analytics'] as $type) {
            $response = $this->getJson("/api/engagement/reward-challenges/report/export?type=$type")->assertOk();
            $this->assertStringContainsString('15', $response->streamedContent());
        }
        $this->postJson("/api/engagement/reward-challenge-submissions/{$participant->id}/approve")->assertOk();
        $this->getJson('/api/engagement/reward-challenges/report')->assertOk()->assertJsonPath('data.quarters.0.points', '115 pts awarded');
        $this->getJson('/api/engagement/reward-challenges/employee-profiles')->assertOk()->assertJsonPath('data.employees.0.points', 115);
        $this->getJson('/api/engagement/reward-challenges/employee-profiles/export')->assertOk();
    }

    public function test_finalization_failure_rolls_back_survey_reward_and_answers_together(): void
    {
        $participant = $this->surveyParticipant();
        $this->postJson("/api/engagement/reward-challenge-submissions/{$participant->id}/approve")->assertOk();
        Event::listen('eloquent.updating: '.EngagementRewardChallengeParticipant::class, function ($row) {
            if ($row->isDirty('status') && $row->status === 'approved') {
                throw new \RuntimeException('Finalization failed.');
            }
        });
        $this->withoutExceptionHandling();
        try {
            $this->submitSurvey($participant);
            $this->fail('Finalization failure must surface.');
        } catch (\RuntimeException $exception) {
            $this->assertSame('Finalization failed.', $exception->getMessage());
        }
        $this->assertSame(0, EngagementPostEventSurveyResponse::count());
        $this->assertSame(0, EngagementPostEventAnswer::count());
        $this->assertSame('pending_survey', $participant->fresh()->status);
        $this->assertSame(0, $participant->fresh()->survey_points_awarded);
        $this->assertNull($participant->fresh()->survey_rewarded_at);
        $this->assertNull($participant->fresh()->points_awarded);
    }

    public function test_admin_review_filters_and_counts_preserve_approved_proof_pending_survey(): void
    {
        $participant = $this->surveyParticipant();
        $this->postJson("/api/engagement/reward-challenge-submissions/{$participant->id}/approve")->assertOk();
        $this->getJson('/api/engagement/reward-challenge-submissions?status=approved')->assertOk()
            ->assertJsonCount(1, 'data')->assertJsonPath('data.0.status', 'approved')
            ->assertJsonPath('data.0.participation_status', 'pending_survey');
        $this->getJson('/api/engagement/reward-challenge-submissions?status=submitted')->assertOk()->assertJsonCount(0, 'data');
        $this->getJson('/api/engagement/reward-challenge-submissions/stats')->assertOk()
            ->assertJsonPath('data.pending', 0)->assertJsonPath('data.approved', 1);
        $this->getJson('/api/engagement/reward-challenges/report')->assertOk()
            ->assertJsonPath('data.quarters.0.completion', 0);
        $this->submitSurvey($participant)->assertOk();
        $this->getJson('/api/engagement/reward-challenges/report')->assertOk()
            ->assertJsonPath('data.quarters.0.completion', 100);
    }

    public function test_daily_decline_does_not_increment_days_and_legacy_daily_approval_still_completes(): void
    {
        Storage::fake('s3');
        $participant = $this->surveyParticipant(true);
        $participant->challenge->update(['survey_required' => false]);
        foreach ([0, 1, 2] as $day) {
            $log = EngagementRewardChallengeDailyLog::create([
                'reward_challenge_participant_id' => $participant->id,
                'log_date' => now()->addDays($day)->toDateString(),
                'submission_path' => "daily-$day.png",
                'status' => 'submitted',
            ]);
            if ($day === 0) {
                $this->getJson("/api/engagement/reward-challenges/{$participant->reward_challenge_id}/participants")->assertOk();
                $this->assertTrue(Cache::has($this->leaderboardCacheKey($participant->challenge)));
                $this->postJson("/api/engagement/reward-challenge-submissions/daily-{$log->id}/decline", ['review_note' => 'Insufficient proof'])
                    ->assertOk()->assertJsonPath('data.status', 'declined');
                $this->assertFalse(Cache::has($this->leaderboardCacheKey($participant->challenge)));
                $this->assertSame(0, $participant->fresh()->completed_days);
            } else {
                $this->postJson("/api/engagement/reward-challenge-submissions/daily-{$log->id}/approve", [
                    'bonus_points' => 5,
                ])->assertOk();
            }
        }
        $this->assertSame('approved', $participant->fresh()->status);
        $this->assertSame(110, $participant->fresh()->points_awarded);
        $this->assertSame(10, $participant->fresh()->bonus_points);
        $this->assertSame(0, $participant->fresh()->survey_points_awarded);
    }

    public function test_empty_or_oversized_answers_and_missing_question_definitions_surface_errors(): void
    {
        $participant = $this->surveyParticipant();
        $this->submitSurvey($participant, [])->assertUnprocessable()->assertJsonValidationErrors('answers');
        $answers = $this->surveyAnswers($participant);
        $paragraphId = array_key_last($answers);
        $this->submitSurvey($participant, array_replace($answers, [$paragraphId => str_repeat('x', 5001)]))
            ->assertUnprocessable()->assertJsonValidationErrors("answers.$paragraphId");
        $this->getJson("/api/engagement/reward-challenges/{$participant->reward_challenge_id}/survey")->assertOk()
            ->assertJsonPath('data.questions.0.rating_min', 1)->assertJsonPath('data.questions.0.rating_max', 5)
            ->assertJsonPath('data.questions.4.question_type', 'paragraph');
        $participant->challenge->survey->questions()->delete();
        $this->getJson("/api/engagement/reward-challenges/{$participant->reward_challenge_id}/survey")->assertStatus(409);
        $this->submitSurvey($participant, $answers)->assertStatus(409);
        $this->assertSame(0, EngagementPostEventSurveyResponse::count());
        $this->assertSame(0, $participant->fresh()->survey_points_awarded);
    }

    public function test_challenge_api_creates_the_exact_default_survey_atomically(): void
    {
        $response = $this->postJson('/api/engagement/reward-challenges', $this->challengeData())
            ->assertCreated()
            ->assertJsonPath('data.title', 'New challenge')
            ->assertJsonPath('data.points', 100);

        $challenge = EngagementRewardChallenge::findOrFail($response->json('data.id'));
        $survey = $challenge->survey()->with('questions.options')->firstOrFail();

        $this->assertTrue($challenge->survey_required);
        $this->assertSame($challenge->id, $survey->reward_challenge_id);
        $this->assertSame($challenge->id, $survey->challenge->id);
        $this->assertNull($survey->engagement_post_event_id);
        $this->assertSame(auth()->id(), $survey->user_id);
        $this->assertSame('published', $survey->status);
        $this->assertNotNull($survey->published_at);
        $this->assertSame([
            'How satisfied were you with the event?',
            'How satisfied were you with the activities? (Schedule)',
            'How satisfied were you with the activities? (Food)',
            'How satisfied were you with the activities? (Program)',
            'What was the highlight of the event for you?',
            'What is one thing we could change to make this event even better next time?',
            'Are there any specific topics or activities you’d like to see in the future?',
        ], $survey->questions->pluck('question')->all());
        $this->assertSame(['rating', 'rating', 'rating', 'rating', 'paragraph', 'paragraph', 'paragraph'], $survey->questions->pluck('type')->all());
        $this->assertSame([true, true, true, true, false, false, false], $survey->questions->map(fn ($q) => (bool) $q->is_required)->all());
        $this->assertSame(range(0, 6), $survey->questions->pluck('sort_order')->all());
        $this->assertTrue($survey->questions->every(fn ($q) => $q->options->isEmpty() && $q->engagement_post_event_id === null));
    }

    public function test_generation_is_idempotent_and_linked_to_the_right_challenge(): void
    {
        $first = $this->createChallenge();
        $second = $this->createChallenge();
        $service = new ChallengeSurveyService;

        $survey = $service->createForChallenge($first);
        $again = $service->createForChallenge($first->fresh());
        $other = $service->createForChallenge($second);

        $this->assertSame($survey->id, $again->id);
        $this->assertNotSame($survey->id, $other->id);
        $this->assertSame($second->id, $other->reward_challenge_id);
        $this->assertSame(2, EngagementPostEventSurvey::count());
        $this->assertSame(14, EngagementPostEventQuestion::count());
    }

    public function test_survey_endpoint_removes_existing_duplicate_challenge_questions(): void
    {
        $participant = $this->surveyParticipant();
        $survey = $participant->challenge->survey;

        foreach ($survey->questions as $question) {
            $duplicate = $question->replicate();
            $duplicate->sort_order += 7;
            $duplicate->save();
        }

        $this->getJson("/api/engagement/reward-challenges/{$participant->reward_challenge_id}/survey")
            ->assertOk()
            ->assertJsonCount(7, 'data.questions');

        $this->assertSame(7, $survey->questions()->count());
    }

    public function test_duplicate_question_migration_preserves_answers_and_ignores_event_surveys(): void
    {
        $challenge = $this->createChallenge();
        $survey = (new ChallengeSurveyService)->createForChallenge($challenge);
        $participant = EngagementRewardChallengeParticipant::create([
            'reward_challenge_id' => $challenge->id,
            'user_id' => auth()->id(),
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);
        $response = EngagementPostEventSurveyResponse::create([
            'engagement_post_event_survey_id' => $survey->id,
            'reward_challenge_participant_id' => $participant->id,
            'user_id' => auth()->id(),
            'submitted_at' => now(),
        ]);

        $firstQuestion = $survey->questions()->orderBy('id')->firstOrFail();
        $duplicateQuestion = $firstQuestion->replicate();
        $duplicateQuestion->sort_order = 7;
        $duplicateQuestion->save();
        EngagementPostEventAnswer::create([
            'engagement_post_event_survey_response_id' => $response->id,
            'engagement_post_event_question_id' => $duplicateQuestion->id,
            'user_id' => auth()->id(),
            'answer' => '5',
        ]);

        $eventSurvey = EngagementPostEventSurvey::create([
            'user_id' => auth()->id(),
            'title' => 'Event survey',
            'status' => 'published',
        ]);
        $eventQuestion = EngagementPostEventQuestion::create([
            'engagement_post_event_survey_id' => $eventSurvey->id,
            'user_id' => auth()->id(),
            'question' => 'Event question',
            'type' => 'paragraph',
            'sort_order' => 0,
        ]);
        $eventQuestionCopy = $eventQuestion->replicate();
        $eventQuestionCopy->sort_order = 1;
        $eventQuestionCopy->save();

        $migration = require database_path('migrations/2026_10_14_000001_deduplicate_reward_challenge_survey_questions.php');
        $migration->up();

        $this->assertSame(7, $survey->questions()->count());
        $this->assertDatabaseHas('engagement_post_event_answers', [
            'engagement_post_event_survey_response_id' => $response->id,
            'engagement_post_event_question_id' => $firstQuestion->id,
            'answer' => '5',
        ]);
        $this->assertSame(2, $eventSurvey->questions()->count());
    }

    public function test_database_prevents_duplicate_surveys_even_outside_the_service(): void
    {
        $challenge = $this->createChallenge();
        (new ChallengeSurveyService)->createForChallenge($challenge);

        $this->expectException(QueryException::class);
        EngagementPostEventSurvey::create(['reward_challenge_id' => $challenge->id, 'status' => 'published']);
    }

    public function test_question_failure_rolls_back_the_survey_and_requirement_flag(): void
    {
        $challenge = $this->createChallenge();
        Event::listen('eloquent.creating: '.EngagementPostEventQuestion::class, function ($question) {
            if ($question->sort_order === 3) {
                throw new \RuntimeException('Question creation failed.');
            }
        });

        try {
            (new ChallengeSurveyService)->createForChallenge($challenge);
            $this->fail('Question creation failure must not be swallowed.');
        } catch (\RuntimeException $exception) {
            $this->assertSame('Question creation failed.', $exception->getMessage());
        }

        $this->assertFalse($challenge->fresh()->survey_required);
        $this->assertSame(0, EngagementPostEventSurvey::count());
        $this->assertSame(0, EngagementPostEventQuestion::count());
    }

    public function test_api_failure_rolls_back_challenge_eligibility_and_survey_and_removes_banner(): void
    {
        Storage::fake('s3');
        $departmentId = DB::table('departments')->insertGetId(['name' => 'Test department']);
        $service = Mockery::mock(ChallengeSurveyService::class);
        $service->shouldReceive('createForChallenge')->once()->andReturnUsing(function ($challenge) {
            (new ChallengeSurveyService)->createForChallenge($challenge);
            throw new \RuntimeException('Survey workflow failed.');
        });
        $this->app->instance(ChallengeSurveyService::class, $service);
        $this->withoutExceptionHandling();

        try {
            $this->post('/api/engagement/reward-challenges', [
                ...$this->challengeData(),
                'all_employees' => false,
                'department_ids' => [$departmentId],
                'banner' => UploadedFile::fake()->image('banner.png'),
            ], ['Accept' => 'application/json']);
            $this->fail('Survey workflow failure must not be swallowed.');
        } catch (\RuntimeException $exception) {
            $this->assertSame('Survey workflow failed.', $exception->getMessage());
        }

        $this->assertSame(0, EngagementRewardChallenge::count());
        $this->assertSame(0, DB::table('engagement_department_reward_challenge')->count());
        $this->assertSame(0, EngagementPostEventSurvey::count());
        $this->assertSame(0, EngagementPostEventQuestion::count());
        $this->assertSame([], Storage::disk('s3')->allFiles());
    }

    public function test_event_survey_creation_listing_and_submission_remain_unchanged(): void
    {
        (new ChallengeSurveyService)->createForChallenge($this->createChallenge());
        $eventId = DB::table('engagement_post_events')->insertGetId(['title' => 'Event', 'category' => 'Event']);
        $created = $this->postJson('/api/engagement/surveys', [
            'engagement_post_event_id' => $eventId,
            'title' => 'Event survey',
            'questions' => [
                ['question_text' => 'Rate event', 'question_type' => 'rating', 'is_required' => true],
                ['question_text' => 'Your feedback', 'question_type' => 'paragraph', 'is_required' => false],
            ],
        ])->assertCreated();
        $id = $created->json('data.id');
        $questions = $created->json('data.questions');

        $this->getJson('/api/engagement/surveys')->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonFragment(['id' => $id]);
        $this->getJson("/api/engagement/surveys/$id")->assertOk()->assertJsonPath('data.user_has_responded', false);
        $this->postJson("/api/engagement/surveys/$id/submit", [
            'answers' => [$questions[0]['id'] => 5, $questions[1]['id'] => 'Great event.'],
        ])->assertOk();
        $this->getJson("/api/engagement/surveys/$id")->assertOk()->assertJsonPath('data.user_has_responded', true);
        $this->postJson("/api/engagement/surveys/$id/submit", ['answers' => [$questions[0]['id'] => 5]])->assertUnprocessable();

        $response = EngagementPostEventSurveyResponse::where('engagement_post_event_survey_id', $id)->firstOrFail();
        $this->assertNull($response->reward_challenge_participant_id);
        $this->assertSame(2, $response->answers()->count());
    }

    public function test_challenge_surveys_are_readable_but_mutations_stay_blocked_on_legacy_routes(): void
    {
        $challenge = $this->createChallenge();
        $survey = (new ChallengeSurveyService)->createForChallenge($challenge);
        $participant = EngagementRewardChallengeParticipant::create([
            'reward_challenge_id' => $challenge->id,
            'user_id' => auth()->id(),
            'status' => 'joined',
        ]);
        $this->getJson("/api/engagement/surveys/{$survey->id}/responses")->assertOk()
            ->assertJsonPath('data.total_employees', 1)
            ->assertJsonPath('data.response_tracker.0.status', 'Pending');
        EngagementPostEventSurveyResponse::create([
            'engagement_post_event_survey_id' => $survey->id,
            'reward_challenge_participant_id' => $participant->id,
            'user_id' => auth()->id(),
            'submitted_at' => now(),
        ]);
        $routes = collect($this->app['router']->getRoutes())->filter(
            fn ($route) => str_starts_with($route->uri(), 'api/engagement/surveys/{id}')
        );
        $this->assertCount(10, $routes);

        foreach ($routes as $route) {
            $this->assertTrue(collect($route->gatherMiddleware())->contains(
                fn ($middleware) => $middleware === EnsurePostEventSurvey::class
                    || str_starts_with($middleware, EnsurePostEventSurvey::class.':')
            ));
            $uri = str_replace(['{id}', '{userId}'], [$survey->id, auth()->id()], $route->uri());
            $method = $route->methods()[0];
            $response = $this->json($method, '/'.$uri, ['answers' => []]);
            if ($method === 'GET') {
                $this->assertNotSame(404, $response->getStatusCode(), $route->uri());
            } else {
                $response->assertNotFound();
            }
        }

        $this->getJson('/api/engagement/surveys')->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.reward_challenge_id', $challenge->id)
            ->assertJsonPath('data.0.challenge.id', $challenge->id)
            ->assertJsonPath('data.0.challenge.title', $challenge->title);
        $this->getJson("/api/engagement/surveys/{$survey->id}/responses")->assertOk()
            ->assertJsonPath('data.total_employees', 1)
            ->assertJsonPath('data.response_tracker.0.user_id', auth()->id())
            ->assertJsonPath('data.response_tracker.0.status', 'Completed')
            ->assertJsonPath('data.total_responses', 1);
        $this->getJson("/api/engagement/surveys/{$survey->id}/analytics")->assertOk()
            ->assertJsonPath('data.total_employees', 1);
        $this->assertSame(0, $participant->fresh()->survey_points_awarded);
        $this->assertNotNull($survey->fresh());
        $this->assertSame(7, $survey->questions()->count());
        $this->assertSame(1, $survey->responses()->count());
    }

    public function test_submission_payload_exposes_survey_required_and_pending_completed_state(): void
    {
        $participant = $this->surveyParticipant();
        $this->getJson('/api/engagement/reward-challenge-submissions')
            ->assertOk()
            ->assertJsonPath('data.0.challenge.survey_required', true)
            ->assertJsonPath('data.0.survey_completed', false);
        $this->submitSurvey($participant)->assertOk();
        $this->getJson('/api/engagement/reward-challenge-submissions')
            ->assertOk()
            ->assertJsonPath('data.0.challenge.survey_required', true)
            ->assertJsonPath('data.0.survey_completed', true);

        $legacyChallenge = EngagementRewardChallenge::create([
            ...$this->challengeData(),
            'created_by' => auth()->id(),
            'survey_required' => false,
        ]);
        $legacyParticipant = EngagementRewardChallengeParticipant::create([
            'reward_challenge_id' => $legacyChallenge->id,
            'user_id' => auth()->id(),
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);
        $this->getJson('/api/engagement/reward-challenge-submissions?challenge_id='.$legacyChallenge->id)
            ->assertOk()
            ->assertJsonPath('data.0.challenge.survey_required', false)
            ->assertJsonPath('data.0.survey_completed', false);
        $this->assertSame($legacyParticipant->id, (int) $this->getJson('/api/engagement/reward-challenge-submissions?challenge_id='.$legacyChallenge->id)->json('data.0.id'));
    }

    public function test_participant_response_relationships_and_database_uniqueness(): void
    {
        $challenge = $this->createChallenge();
        $survey = (new ChallengeSurveyService)->createForChallenge($challenge);
        $participant = EngagementRewardChallengeParticipant::create([
            'reward_challenge_id' => $challenge->id,
            'user_id' => auth()->id(),
            'status' => 'joined',
        ]);
        $response = EngagementPostEventSurveyResponse::create([
            'engagement_post_event_survey_id' => $survey->id,
            'reward_challenge_participant_id' => $participant->id,
            'user_id' => auth()->id(),
            'submitted_at' => now(),
        ]);

        $this->assertSame($participant->id, $response->participant->id);
        $this->assertSame($response->id, $participant->surveyResponse->id);
        $this->assertSame(0, $participant->fresh()->survey_points_awarded);
        $this->assertNull($participant->fresh()->survey_rewarded_at);

        $this->expectException(QueryException::class);
        EngagementPostEventSurveyResponse::create([
            'engagement_post_event_survey_id' => $survey->id,
            'reward_challenge_participant_id' => $participant->id,
            'user_id' => auth()->id(),
        ]);
    }

    public function test_existing_challenges_remain_optional_and_migration_is_reversible(): void
    {
        $challenge = $this->createChallenge();
        $this->assertFalse($challenge->fresh()->survey_required);
        $this->assertNull($challenge->survey);

        (new ChallengeSurveyService)->createForChallenge($challenge);
        $eventId = DB::table('engagement_post_events')->insertGetId(['title' => 'Existing event', 'category' => 'Event']);
        $eventSurvey = EngagementPostEventSurvey::create([
            'engagement_post_event_id' => $eventId,
            'title' => 'Keep this event survey',
            'status' => 'published',
        ]);
        $eventSurvey->questions()->create(['question' => 'Feedback', 'type' => 'paragraph', 'sort_order' => 0]);

        (require database_path('migrations/'.self::MIGRATION))->down();

        $this->assertFalse(Schema::hasColumn('engagement_post_event_surveys', 'reward_challenge_id'));
        $this->assertFalse(Schema::hasColumn('engagement_post_event_survey_responses', 'reward_challenge_participant_id'));
        $this->assertFalse(Schema::hasColumn('engagement_reward_challenges', 'survey_required'));
        $this->assertFalse(Schema::hasColumn('engagement_reward_challenge_participants', 'proof_approved_at'));
        $this->assertFalse(Schema::hasColumn('engagement_reward_challenge_participants', 'survey_points_awarded'));
        $this->assertFalse(Schema::hasColumn('engagement_reward_challenge_participants', 'survey_rewarded_at'));
        $this->assertSame(1, EngagementRewardChallenge::count());
        $this->assertSame(1, EngagementPostEventSurvey::count());
        $this->assertSame($eventSurvey->id, EngagementPostEventSurvey::firstOrFail()->id);
        $this->assertSame(1, EngagementPostEventQuestion::count());
    }
}
