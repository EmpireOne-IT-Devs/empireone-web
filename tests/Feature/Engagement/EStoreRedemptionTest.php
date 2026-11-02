<?php

namespace Tests\Feature\Engagement;

use App\Models\Engagement\EngagementEStore;
use App\Models\Engagement\EngagementEStorePointTransaction;
use App\Models\Engagement\EngagementEStoreRedemption;
use App\Models\User;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class EStoreRedemptionTest extends TestCase
{
    private User $employee;
    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'database.default' => 'e_store_redemption_testing',
            'database.connections.e_store_redemption_testing' => [
                'driver' => 'sqlite',
                'database' => ':memory:',
                'prefix' => '',
                'foreign_key_constraints' => true,
            ],
        ]);
        DB::purge('e_store_redemption_testing');

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->unsignedTinyInteger('role')->default(2);
            $table->timestamps();
        });

        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->timestamps();
        });

        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->timestamps();
        });

        Schema::create('sites', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->timestamps();
        });

        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->timestamps();
        });

        Schema::create('e_r_leaders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->timestamps();
        });

        Schema::create('account_employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->string('employee_id')->nullable();
            $table->unsignedBigInteger('department_id')->nullable();
            $table->unsignedBigInteger('account_id')->nullable();
            $table->unsignedBigInteger('site_id')->nullable();
            $table->unsignedBigInteger('location_id')->nullable();
            $table->unsignedBigInteger('e_r_leader_id')->nullable();
            $table->unsignedBigInteger('department_manager_id')->nullable();
            $table->timestamps();
        });

        Schema::create('engagement_e_stores', function (Blueprint $table) {
            $table->id();
            $table->string('product_image', 2048)->nullable();
            $table->string('product_name');
            $table->text('customer_description')->nullable();
            $table->string('reward_type', 100);
            $table->unsignedInteger('point_cost');
            $table->unsignedInteger('quantity')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_unlimited_stock')->default(false);
            $table->foreignId('created_by')->nullable();
            $table->foreignId('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('engagement_e_store_redemptions', function (Blueprint $table) {
            $table->id();
            $table->string('reference', 32)->unique();
            $table->foreignId('user_id');
            $table->foreignId('engagement_e_store_id');
            $table->unsignedInteger('quantity');
            $table->unsignedInteger('unit_point_cost');
            $table->unsignedBigInteger('total_point_cost');
            $table->string('status', 20)->default('pending');
            $table->string('idempotency_key', 64);
            $table->foreignId('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('processed_by')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->foreignId('fulfilled_by')->nullable();
            $table->timestamp('fulfilled_at')->nullable();
            $table->foreignId('rejected_by')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->foreignId('cancelled_by')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->text('admin_notes')->nullable();
            $table->text('fulfillment_notes')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'idempotency_key']);
        });

        Schema::create('engagement_e_store_redemption_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('redemption_id');
            $table->string('from_status', 20)->nullable();
            $table->string('to_status', 20);
            $table->foreignId('actor_id')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('engagement_e_store_point_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->foreignId('redemption_id');
            $table->string('type', 20);
            $table->unsignedBigInteger('points');
            $table->foreignId('created_by')->nullable();
            $table->timestamps();

            $table->unique(['redemption_id', 'type']);
        });

        Schema::create('engagement_reward_challenges', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->unsignedInteger('points')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('engagement_reward_challenge_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reward_challenge_id');
            $table->foreignId('user_id');
            $table->string('status', 30)->default('joined');
            $table->unsignedInteger('points_awarded')->nullable();
            $table->unsignedInteger('bonus_points')->default(0);
            $table->unsignedInteger('survey_points_awarded')->nullable();
            $table->timestamps();
        });

        Schema::create('engagement_reward_challenge_team_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reward_challenge_id');
            $table->foreignId('leader_id');
            $table->unsignedInteger('team_points_awarded')->default(0);
            $table->timestamps();
        });

        $this->employee = User::create([
            'name' => 'Employee One',
            'email' => 'employee@example.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_EMPLOYEE,
        ]);
        DB::table('account_employees')->insert([
            'user_id' => $this->employee->id,
            'employee_id' => 'EO-1001',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->admin = User::create([
            'name' => 'Admin One',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_ADMIN,
        ]);
        DB::table('account_employees')->insert([
            'user_id' => $this->admin->id,
            'employee_id' => 'EO-9001',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    private function makeItem(array $overrides = []): EngagementEStore
    {
        return EngagementEStore::create(array_merge([
            'product_name' => 'Company Hoodie',
            'customer_description' => 'Warm hoodie',
            'reward_type' => 'Merchandise',
            'point_cost' => 100,
            'quantity' => 5,
            'is_active' => true,
            'is_unlimited_stock' => false,
            'created_by' => $this->admin->id,
        ], $overrides));
    }

    private function awardPoints(User $user, int $points): void
    {
        $challengeId = DB::table('engagement_reward_challenges')->insertGetId([
            'title' => 'Challenge',
            'points' => $points,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('engagement_reward_challenge_participants')->insert([
            'reward_challenge_id' => $challengeId,
            'user_id' => $user->id,
            'status' => 'approved',
            'points_awarded' => $points,
            'bonus_points' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    private function redeemPayload(EngagementEStore $item, array $overrides = []): array
    {
        return array_merge([
            'engagement_e_store_id' => $item->id,
            'quantity' => 1,
            'idempotency_key' => 'key-'.uniqid(),
        ], $overrides);
    }

    public function test_successful_redemption(): void
    {
        $this->awardPoints($this->employee, 500);
        $item = $this->makeItem(['point_cost' => 100, 'quantity' => 5]);

        $response = $this->actingAs($this->employee)
            ->postJson('/api/engagement/e-store-redemptions', $this->redeemPayload($item, ['quantity' => 2]));

        $response->assertCreated()
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('data.status', 'pending')
            ->assertJsonPath('data.unit_point_cost', 100)
            ->assertJsonPath('data.total_point_cost', 200);

        $this->assertDatabaseHas('engagement_e_store_redemptions', [
            'user_id' => $this->employee->id,
            'status' => 'pending',
            'total_point_cost' => 200,
        ]);
        $this->assertDatabaseHas('engagement_e_store_point_transactions', [
            'user_id' => $this->employee->id,
            'type' => 'deduction',
            'points' => 200,
        ]);
        $this->assertDatabaseHas('engagement_e_stores', ['id' => $item->id, 'quantity' => 3]);
        $this->assertDatabaseHas('engagement_e_store_redemption_histories', [
            'from_status' => null,
            'to_status' => 'pending',
        ]);
    }

    public function test_insufficient_points_rejected_without_side_effects(): void
    {
        $this->awardPoints($this->employee, 50);
        $item = $this->makeItem(['point_cost' => 100, 'quantity' => 5]);

        $response = $this->actingAs($this->employee)
            ->postJson('/api/engagement/e-store-redemptions', $this->redeemPayload($item));

        $response->assertStatus(422);
        $this->assertDatabaseCount('engagement_e_store_redemptions', 0);
        $this->assertDatabaseCount('engagement_e_store_point_transactions', 0);
        $this->assertDatabaseHas('engagement_e_stores', ['id' => $item->id, 'quantity' => 5]);
    }

    public function test_exactly_enough_points_succeeds(): void
    {
        $this->awardPoints($this->employee, 100);
        $item = $this->makeItem(['point_cost' => 100]);

        $this->actingAs($this->employee)
            ->postJson('/api/engagement/e-store-redemptions', $this->redeemPayload($item))
            ->assertCreated();

        $balance = $this->actingAs($this->employee)
            ->getJson('/api/engagement/e-store-redemptions/balance');
        $balance->assertOk()->assertJsonPath('data.available_points', 0);
    }

    public function test_inactive_reward_cannot_be_redeemed(): void
    {
        $this->awardPoints($this->employee, 500);
        $item = $this->makeItem(['is_active' => false]);

        $this->actingAs($this->employee)
            ->postJson('/api/engagement/e-store-redemptions', $this->redeemPayload($item))
            ->assertStatus(422);
        $this->assertDatabaseCount('engagement_e_store_redemptions', 0);
    }

    public function test_soft_deleted_reward_cannot_be_redeemed(): void
    {
        $this->awardPoints($this->employee, 500);
        $item = $this->makeItem();
        $item->delete();

        $response = $this->actingAs($this->employee)
            ->postJson('/api/engagement/e-store-redemptions', $this->redeemPayload($item));

        $this->assertContains($response->status(), [404, 422]);
        $this->assertDatabaseCount('engagement_e_store_redemptions', 0);
    }

    public function test_zero_stock_and_over_stock_rejected(): void
    {
        $this->awardPoints($this->employee, 1000);
        $item = $this->makeItem(['quantity' => 2]);

        $this->actingAs($this->employee)
            ->postJson('/api/engagement/e-store-redemptions', $this->redeemPayload($item, ['quantity' => 3]))
            ->assertStatus(422);

        $item->update(['quantity' => 0]);
        $this->actingAs($this->employee)
            ->postJson('/api/engagement/e-store-redemptions', $this->redeemPayload($item, ['quantity' => 1]))
            ->assertStatus(422);

        $this->assertDatabaseCount('engagement_e_store_redemptions', 0);
    }

    public function test_invalid_quantity_rejected(): void
    {
        $this->awardPoints($this->employee, 1000);
        $item = $this->makeItem();

        foreach ([0, -1, 100, 'abc'] as $quantity) {
            $this->actingAs($this->employee)
                ->postJson('/api/engagement/e-store-redemptions', $this->redeemPayload($item, ['quantity' => $quantity]))
                ->assertStatus(422);
        }
        $this->assertDatabaseCount('engagement_e_store_redemptions', 0);
    }

    public function test_unlimited_stock_does_not_decrement(): void
    {
        $this->awardPoints($this->employee, 500);
        $item = $this->makeItem(['quantity' => null, 'is_unlimited_stock' => true]);

        $this->actingAs($this->employee)
            ->postJson('/api/engagement/e-store-redemptions', $this->redeemPayload($item, ['quantity' => 3]))
            ->assertCreated();

        $this->assertDatabaseHas('engagement_e_stores', ['id' => $item->id, 'quantity' => null]);
    }

    public function test_duplicate_idempotency_key_returns_existing_redemption(): void
    {
        $this->awardPoints($this->employee, 500);
        $item = $this->makeItem(['point_cost' => 100, 'quantity' => 5]);
        $payload = $this->redeemPayload($item, ['idempotency_key' => 'same-key']);

        $first = $this->actingAs($this->employee)->postJson('/api/engagement/e-store-redemptions', $payload);
        $second = $this->actingAs($this->employee)->postJson('/api/engagement/e-store-redemptions', $payload);

        $first->assertCreated();
        $second->assertCreated();
        $this->assertSame(
            $first->json('data.reference'),
            $second->json('data.reference'),
        );
        $this->assertDatabaseCount('engagement_e_store_redemptions', 1);
        $this->assertDatabaseCount('engagement_e_store_point_transactions', 1);
        $this->assertDatabaseHas('engagement_e_stores', ['id' => $item->id, 'quantity' => 4]);
    }

    public function test_full_lifecycle_pending_to_completed(): void
    {
        $this->awardPoints($this->employee, 500);
        $item = $this->makeItem();
        $reference = $this->actingAs($this->employee)
            ->postJson('/api/engagement/e-store-redemptions', $this->redeemPayload($item))
            ->json('data.reference');

        $this->actingAs($this->admin)->postJson("/api/engagement/admin/e-store-redemptions/{$reference}/approve")->assertOk();
        $this->actingAs($this->admin)->postJson("/api/engagement/admin/e-store-redemptions/{$reference}/process")->assertOk();
        $this->actingAs($this->admin)->postJson("/api/engagement/admin/e-store-redemptions/{$reference}/complete")->assertOk();

        $redemption = EngagementEStoreRedemption::where('reference', $reference)->first();
        $this->assertSame('completed', $redemption->status);
        $this->assertSame($this->admin->id, $redemption->approved_by);
        $this->assertSame($this->admin->id, $redemption->fulfilled_by);
        $this->assertNotNull($redemption->approved_at);
        $this->assertNotNull($redemption->fulfilled_at);
        $this->assertDatabaseCount('engagement_e_store_redemption_histories', 4);
    }

    public function test_reject_refunds_points_and_restores_stock(): void
    {
        $this->awardPoints($this->employee, 500);
        $item = $this->makeItem(['point_cost' => 100, 'quantity' => 5]);
        $reference = $this->actingAs($this->employee)
            ->postJson('/api/engagement/e-store-redemptions', $this->redeemPayload($item))
            ->json('data.reference');

        $this->actingAs($this->admin)
            ->postJson("/api/engagement/admin/e-store-redemptions/{$reference}/reject", [])
            ->assertStatus(422);

        $this->actingAs($this->admin)
            ->postJson("/api/engagement/admin/e-store-redemptions/{$reference}/reject", ['rejection_reason' => 'Out of season'])
            ->assertOk();

        $this->assertDatabaseHas('engagement_e_store_redemptions', ['reference' => $reference, 'status' => 'rejected']);
        $this->assertDatabaseHas('engagement_e_store_point_transactions', ['type' => 'refund', 'points' => 100]);
        $this->assertDatabaseHas('engagement_e_stores', ['id' => $item->id, 'quantity' => 5]);

        $balance = $this->actingAs($this->employee)->getJson('/api/engagement/e-store-redemptions/balance');
        $balance->assertJsonPath('data.available_points', 500);
    }

    public function test_double_reject_is_blocked_and_refunds_once(): void
    {
        $this->awardPoints($this->employee, 500);
        $item = $this->makeItem(['point_cost' => 100]);
        $reference = $this->actingAs($this->employee)
            ->postJson('/api/engagement/e-store-redemptions', $this->redeemPayload($item))
            ->json('data.reference');

        $this->actingAs($this->admin)
            ->postJson("/api/engagement/admin/e-store-redemptions/{$reference}/reject", ['rejection_reason' => 'First'])
            ->assertOk();
        $this->actingAs($this->admin)
            ->postJson("/api/engagement/admin/e-store-redemptions/{$reference}/reject", ['rejection_reason' => 'Second'])
            ->assertStatus(422);

        $this->assertSame(1, EngagementEStorePointTransaction::where('type', 'refund')->count());
    }

    public function test_employee_cancel_pending_refunds_and_restores(): void
    {
        $this->awardPoints($this->employee, 500);
        $item = $this->makeItem(['point_cost' => 100, 'quantity' => 5]);
        $reference = $this->actingAs($this->employee)
            ->postJson('/api/engagement/e-store-redemptions', $this->redeemPayload($item))
            ->json('data.reference');

        $this->actingAs($this->employee)
            ->postJson("/api/engagement/e-store-redemptions/{$reference}/cancel")
            ->assertOk();

        $this->assertDatabaseHas('engagement_e_store_redemptions', ['reference' => $reference, 'status' => 'cancelled']);
        $this->assertDatabaseHas('engagement_e_store_point_transactions', ['type' => 'refund', 'points' => 100]);
        $this->assertDatabaseHas('engagement_e_stores', ['id' => $item->id, 'quantity' => 5]);
    }

    public function test_employee_cannot_cancel_after_approval(): void
    {
        $this->awardPoints($this->employee, 500);
        $item = $this->makeItem();
        $reference = $this->actingAs($this->employee)
            ->postJson('/api/engagement/e-store-redemptions', $this->redeemPayload($item))
            ->json('data.reference');

        $this->actingAs($this->admin)->postJson("/api/engagement/admin/e-store-redemptions/{$reference}/approve")->assertOk();

        $response = $this->actingAs($this->employee)
            ->postJson("/api/engagement/e-store-redemptions/{$reference}/cancel");
        $this->assertContains($response->status(), [403, 422]);
        $this->assertDatabaseHas('engagement_e_store_redemptions', ['reference' => $reference, 'status' => 'approved']);
    }

    public function test_completed_redemption_cannot_be_rejected_or_cancelled(): void
    {
        $this->awardPoints($this->employee, 500);
        $item = $this->makeItem();
        $reference = $this->actingAs($this->employee)
            ->postJson('/api/engagement/e-store-redemptions', $this->redeemPayload($item))
            ->json('data.reference');

        $this->actingAs($this->admin)->postJson("/api/engagement/admin/e-store-redemptions/{$reference}/approve");
        $this->actingAs($this->admin)->postJson("/api/engagement/admin/e-store-redemptions/{$reference}/process");
        $this->actingAs($this->admin)->postJson("/api/engagement/admin/e-store-redemptions/{$reference}/complete");

        $this->actingAs($this->admin)
            ->postJson("/api/engagement/admin/e-store-redemptions/{$reference}/reject", ['rejection_reason' => 'Too late'])
            ->assertStatus(422);
        $this->actingAs($this->admin)
            ->postJson("/api/engagement/admin/e-store-redemptions/{$reference}/cancel")
            ->assertStatus(422);
    }

    public function test_invalid_transitions_rejected(): void
    {
        $this->awardPoints($this->employee, 500);
        $item = $this->makeItem();
        $reference = $this->actingAs($this->employee)
            ->postJson('/api/engagement/e-store-redemptions', $this->redeemPayload($item))
            ->json('data.reference');

        $this->actingAs($this->admin)->postJson("/api/engagement/admin/e-store-redemptions/{$reference}/complete")->assertStatus(422);
        $this->actingAs($this->admin)->postJson("/api/engagement/admin/e-store-redemptions/{$reference}/process")->assertStatus(422);
        $this->assertDatabaseHas('engagement_e_store_redemptions', ['reference' => $reference, 'status' => 'pending']);
    }

    public function test_price_change_after_redemption_preserves_snapshot(): void
    {
        $this->awardPoints($this->employee, 500);
        $item = $this->makeItem(['point_cost' => 100]);
        $reference = $this->actingAs($this->employee)
            ->postJson('/api/engagement/e-store-redemptions', $this->redeemPayload($item))
            ->json('data.reference');

        $item->update(['point_cost' => 250]);

        $redemption = EngagementEStoreRedemption::where('reference', $reference)->first();
        $this->assertSame(100, $redemption->unit_point_cost);
        $this->assertSame(100, $redemption->total_point_cost);
    }

    public function test_employee_cannot_view_or_cancel_anothers_redemption(): void
    {
        $this->awardPoints($this->employee, 500);
        $other = User::create([
            'name' => 'Employee Two',
            'email' => 'employee2@example.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_EMPLOYEE,
        ]);
        DB::table('account_employees')->insert([
            'user_id' => $other->id,
            'employee_id' => 'EO-1002',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $item = $this->makeItem();
        $reference = $this->actingAs($this->employee)
            ->postJson('/api/engagement/e-store-redemptions', $this->redeemPayload($item))
            ->json('data.reference');

        $this->actingAs($other)->getJson("/api/engagement/e-store-redemptions/{$reference}")->assertForbidden();
        $this->actingAs($other)->postJson("/api/engagement/e-store-redemptions/{$reference}/cancel")->assertForbidden();

        $list = $this->actingAs($other)->getJson('/api/engagement/e-store-redemptions');
        $list->assertOk();
        $this->assertCount(0, $list->json('data'));
    }

    public function test_non_admin_cannot_access_admin_endpoints(): void
    {
        $this->awardPoints($this->employee, 500);
        $item = $this->makeItem();
        $reference = $this->actingAs($this->employee)
            ->postJson('/api/engagement/e-store-redemptions', $this->redeemPayload($item))
            ->json('data.reference');

        $this->actingAs($this->employee)->getJson('/api/engagement/admin/e-store-redemptions')->assertForbidden();
        $this->actingAs($this->employee)->getJson('/api/engagement/admin/e-store-redemptions/stats')->assertForbidden();
        $this->actingAs($this->employee)->postJson("/api/engagement/admin/e-store-redemptions/{$reference}/approve")->assertForbidden();
        $this->actingAs($this->employee)->postJson("/api/engagement/admin/e-store-redemptions/{$reference}/reject", ['rejection_reason' => 'x'])->assertForbidden();
    }

    public function test_unauthenticated_requests_are_rejected(): void
    {
        $this->getJson('/api/engagement/e-store-redemptions')->assertUnauthorized();
        $this->postJson('/api/engagement/e-store-redemptions', [])->assertUnauthorized();
        $this->getJson('/api/engagement/admin/e-store-redemptions')->assertUnauthorized();
    }

    public function test_profile_summary_reports_available_points(): void
    {
        $this->awardPoints($this->employee, 500);
        $item = $this->makeItem(['point_cost' => 100]);
        $this->actingAs($this->employee)
            ->postJson('/api/engagement/e-store-redemptions', $this->redeemPayload($item))
            ->assertCreated();

        $response = $this->actingAs($this->employee)
            ->getJson('/api/engagement/reward-challenges/profile-summary');

        $response->assertOk()
            ->assertJsonPath('data.total_points', 500)
            ->assertJsonPath('data.redeemed_points', 100)
            ->assertJsonPath('data.available_points', 400);
    }
}
