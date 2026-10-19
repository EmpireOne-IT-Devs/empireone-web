<?php

namespace Tests\Feature;

use App\Models\Account\AccountPending;
use App\Models\User;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class AccountPendingDeclineTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config([
            'database.default' => 'account_pending_decline_testing',
            'database.connections.account_pending_decline_testing' => [
                'driver' => 'sqlite',
                'database' => ':memory:',
                'prefix' => '',
                'foreign_key_constraints' => true,
            ],
        ]);
        DB::purge('account_pending_decline_testing');

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->unsignedTinyInteger('role');
            $table->timestamps();
        });

        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('account_pendings', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('location_id');
            $table->string('full_name');
            $table->string('eid');
            $table->string('employee_email');
            $table->string('position');
            $table->string('status')->default('pending');
            $table->foreignId('approved_by_user_id')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('declined_by_user_id')->nullable();
            $table->timestamp('declined_at')->nullable();
            $table->foreignId('user_id')->nullable();
            $table->timestamps();
        });
    }

    public function test_administrator_decline_retains_the_record_and_audit_data(): void
    {
        $locationId = $this->createLocation();
        $pending = $this->createPendingAccount($locationId);
        $admin = $this->createUser('admin@example.com', User::ROLE_ADMIN);

        $this->actingAs($admin, 'sanctum')
            ->postJson("/api/accounts/account-pendings/{$pending->uuid}/decline")
            ->assertOk()
            ->assertJsonPath('data.status', 'declined')
            ->assertJsonPath('data.declined_by_user_id', $admin->id);

        $this->assertDatabaseHas('account_pendings', [
            'id' => $pending->id,
            'status' => 'declined',
            'declined_by_user_id' => $admin->id,
        ], 'account_pending_decline_testing');
        $this->assertNotNull($pending->fresh()->declined_at);

        $this->getJson('/api/accounts/get_account_pendings')
            ->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_non_administrators_cannot_decline_a_registration(): void
    {
        $locationId = $this->createLocation();
        $pending = $this->createPendingAccount($locationId);
        $employee = $this->createUser('employee@example.com', User::ROLE_EMPLOYEE);

        $this->actingAs($employee, 'sanctum')
            ->postJson("/api/accounts/account-pendings/{$pending->uuid}/decline")
            ->assertForbidden();

        $this->assertSame('pending', $pending->fresh()->status);
    }

    public function test_registration_cannot_be_declined_more_than_once(): void
    {
        $locationId = $this->createLocation();
        $pending = $this->createPendingAccount($locationId);
        $admin = $this->createUser('admin@example.com', User::ROLE_ADMIN);
        $this->actingAs($admin, 'sanctum');

        $this->postJson("/api/accounts/account-pendings/{$pending->uuid}/decline")
            ->assertOk();

        $this->postJson("/api/accounts/account-pendings/{$pending->uuid}/decline")
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['account_pending']);

        $this->assertDatabaseCount('account_pendings', 1, 'account_pending_decline_testing');
    }

    private function createLocation(): int
    {
        return DB::table('locations')->insertGetId([
            'name' => 'San Carlos',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    private function createPendingAccount(int $locationId): AccountPending
    {
        return AccountPending::create([
            'location_id' => $locationId,
            'full_name' => 'Taylor Example',
            'eid' => 'E1024',
            'employee_email' => 'taylor@example.com',
            'position' => 'Coordinator',
        ]);
    }

    private function createUser(string $email, int $role): User
    {
        return User::create([
            'name' => $email,
            'email' => $email,
            'password' => 'test-only-password',
            'role' => $role,
        ]);
    }
}
