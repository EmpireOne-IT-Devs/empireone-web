<?php

namespace Tests\Unit;

use App\Http\Middleware\EnsurePostEventSurvey;
use App\Models\Engagement\EngagementPostEventAnswer;
use App\Models\Engagement\EngagementPostEventQuestion;
use App\Models\Engagement\EngagementPostEventSurvey;
use App\Models\Engagement\EngagementPostEventSurveyResponse;
use App\Models\Engagement\EngagementRewardChallenge;
use App\Models\Engagement\EngagementRewardChallengeDailyLog;
use App\Models\Engagement\EngagementRewardChallengeParticipant;
use App\Models\User;
use App\Services\ChallengeSurveyService;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Database\QueryException;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider;
use Illuminate\Http\UploadedFile;
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
            $table->unsignedBigInteger('department_id')->nullable();
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
            $table->string('employee_id')->nullable();
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

    private function submitSurvey(EngagementRewardChallengeParticipant $participant, ?array $answers = null)
    {
        return $this->postJson("/api/engagement/reward-challenges/{$participant->reward_challenge_id}/survey/submit", [
            'answers' => $answers ?? $this->surveyAnswers($participant),
        ]);
    }

    public function test_single_proof_approval_waits_for_survey_and_finalizes_once(): void
    {
        $participant = $this->surveyParticipant();
        $this->postJson("/api/engagement/reward-challenge-submissions/{$participant->id}/approve")
            ->assertOk()->assertJsonPath('data.status', 'approved')->assertJsonPath('data.participation_status', 'pending_survey');
        $this->assertSame('pending_survey', $participant->fresh()->status);
        $this->assertNull($participant->fresh()->points_awarded);
        $this->assertNotNull($participant->fresh()->proof_approved_at);

        $this->postJson("/api/engagement/reward-challenge-submissions/{$participant->id}/approve")->assertUnprocessable();
        $this->postJson("/api/engagement/reward-challenge-submissions/{$participant->id}/decline")->assertUnprocessable();
        $this->submitSurvey($participant)->assertOk()->assertJsonPath('data.participation_status', 'approved')
            ->assertJsonPath('data.challenge_points_awarded', 100)->assertJsonPath('data.survey_points_awarded', 15)
            ->assertJsonPath('data.total_points_awarded', 115);
        $rewardedAt = $participant->fresh()->survey_rewarded_at;
        $this->submitSurvey($participant)->assertOk()->assertJsonPath('data.total_points_awarded', 115);
        $this->assertEquals($rewardedAt, $participant->fresh()->survey_rewarded_at);
        $this->assertSame(1, $participant->surveyResponse()->count());
        $this->assertSame(7, $participant->surveyResponse->answers()->count());
        $this->getJson('/api/engagement/reward-challenges/profile-summary')->assertOk()->assertJsonPath('data.total_points', 115);
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
        $this->postJson("/api/engagement/reward-challenge-submissions/daily-{$logs[0]->id}/approve")->assertOk();
        $this->assertSame(1, $participant->fresh()->completed_days);
        $this->submitSurvey($participant)->assertUnprocessable();
        $this->postJson("/api/engagement/reward-challenge-submissions/daily-{$logs[0]->id}/approve")->assertUnprocessable();
        $this->assertSame(1, $participant->fresh()->completed_days);
        $this->postJson("/api/engagement/reward-challenge-submissions/daily-{$logs[1]->id}/approve")->assertOk();
        $this->assertSame('pending_survey', $participant->fresh()->status);
        $this->assertSame(2, $participant->fresh()->completed_days);
        $this->assertNull($participant->fresh()->points_awarded);
        $this->submitSurvey($participant)->assertOk()->assertJsonPath('data.total_points_awarded', 115);
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
        $this->postJson("/api/engagement/reward-challenge-submissions/{$participant->id}/decline")->assertOk();
        $this->assertSame('declined', $participant->fresh()->status);
        $this->deleteJson("/api/engagement/reward-challenges/{$participant->reward_challenge_id}/leave")->assertUnprocessable();
        Storage::fake('s3');
        $this->post("/api/engagement/reward-challenges/{$participant->reward_challenge_id}/submit", [
            'photo' => UploadedFile::fake()->image('proof.png'),
            'challenge_description' => 'Updated proof.',
        ], ['Accept' => 'application/json'])->assertOk();
        $this->submitSurvey($participant)->assertOk()->assertJsonPath('data.survey_points_awarded', 15);
        $this->postJson("/api/engagement/reward-challenge-submissions/{$participant->id}/approve")->assertOk();
        $this->assertSame(115, $participant->fresh()->total_points_awarded);
        $this->assertSame(1, $participant->surveyResponse()->count());
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
                $this->postJson("/api/engagement/reward-challenge-submissions/daily-{$log->id}/decline", ['review_note' => 'Insufficient proof'])
                    ->assertOk()->assertJsonPath('data.status', 'declined');
                $this->assertSame(0, $participant->fresh()->completed_days);
            } else {
                $this->postJson("/api/engagement/reward-challenge-submissions/daily-{$log->id}/approve")->assertOk();
            }
        }
        $this->assertSame('approved', $participant->fresh()->status);
        $this->assertSame(100, $participant->fresh()->points_awarded);
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
