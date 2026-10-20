<?php

namespace Tests\Feature;

use App\Models\Account\AccountPending;
use App\Models\User;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class AccountPendingHistoryTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config([
            'database.default' => 'account_pending_history_testing',
            'database.connections.account_pending_history_testing' => [
                'driver' => 'sqlite',
                'database' => ':memory:',
                'prefix' => '',
                'foreign_key_constraints' => true,
            ],
        ]);
        DB::purge('account_pending_history_testing');

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

    public function test_administrator_can_view_paginated_review_history_by_location(): void
    {
        $locationId = $this->createLocation('San Carlos');
        $otherLocationId = $this->createLocation('Bacolod');
        $admin = $this->createUser('admin@example.com', User::ROLE_ADMIN);

        foreach (range(1, 12) as $index) {
            $this->createAccount($locationId, $index % 2 === 0 ? 'approved' : 'declined', $index);
        }

        $this->createAccount($locationId, 'pending', 13);
        $this->createAccount($otherLocationId, 'approved', 14);

        $firstPage = $this->actingAs($admin, 'sanctum')
            ->getJson("/api/accounts/get_account_pending_history?location_id={$locationId}")
            ->assertOk()
            ->assertJsonPath('meta.total', 12)
            ->assertJsonPath('meta.per_page', 10)
            ->assertJsonCount(10, 'data');

        $secondPage = $this->getJson(
            "/api/accounts/get_account_pending_history?location_id={$locationId}&page=2",
        )
            ->assertOk()
            ->assertJsonPath('meta.total', 12)
            ->assertJsonCount(2, 'data');

        $accounts = [
            ...$firstPage->json('data'),
            ...$secondPage->json('data'),
        ];
        $statuses = array_column($accounts, 'status');
        $this->assertContains('approved', $statuses);
        $this->assertContains('declined', $statuses);

        foreach ($accounts as $account) {
            $this->assertSame($locationId, $account['location_id']);
            $this->assertContains($account['status'], ['approved', 'declined']);
        }
    }

    public function test_only_administrators_can_view_review_history(): void
    {
        $this->getJson('/api/accounts/get_account_pending_history')
            ->assertUnauthorized();

        $employee = $this->createUser('employee@example.com', User::ROLE_EMPLOYEE);

        $this->actingAs($employee, 'sanctum')
            ->getJson('/api/accounts/get_account_pending_history')
            ->assertForbidden();
    }

    private function createLocation(string $name): int
    {
        return DB::table('locations')->insertGetId([
            'name' => $name,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    private function createAccount(int $locationId, string $status, int $index): void
    {
        $reviewedAt = now()->subMinutes($index);
        AccountPending::create([
            'location_id' => $locationId,
            'full_name' => "Taylor Example {$index}",
            'eid' => "E{$index}",
            'employee_email' => "taylor{$index}@example.com",
            'position' => 'Coordinator',
            'status' => $status,
            'approved_at' => $status === 'approved' ? $reviewedAt : null,
            'declined_at' => $status === 'declined' ? $reviewedAt : null,
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
