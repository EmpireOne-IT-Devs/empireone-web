<?php

namespace Tests\Feature;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class AccountPendingRegistrationTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config([
            'database.default' => 'account_pending_testing',
            'database.connections.account_pending_testing' => [
                'driver' => 'sqlite',
                'database' => ':memory:',
                'prefix' => '',
                'foreign_key_constraints' => true,
            ],
        ]);
        DB::purge('account_pending_testing');

        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('account_pendings', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('location_id')->constrained()->restrictOnDelete();
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

    public function test_registration_is_saved_as_pending_for_selected_location(): void
    {
        $locationId = DB::table('locations')->insertGetId([
            'name' => 'San Carlos',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this->postJson('/api/account-pendings', [
            'location_id' => $locationId,
            'full_name' => 'Taylor Example',
            'eid' => 'E1024',
            'employee_email' => 'taylor@example.com',
            'position' => 'Coordinator',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.location_id', $locationId)
            ->assertJsonPath('data.status', 'pending')
            ->assertJsonPath('data.location_name', 'San Carlos');

        $this->assertDatabaseHas('account_pendings', [
            'location_id' => $locationId,
            'full_name' => 'Taylor Example',
            'eid' => 'E1024',
            'employee_email' => 'taylor@example.com',
            'position' => 'Coordinator',
        ], 'account_pending_testing');
    }

    public function test_registration_rejects_an_unknown_location(): void
    {
        $response = $this->postJson('/api/account-pendings', [
            'location_id' => 9999,
            'full_name' => 'Taylor Example',
            'eid' => 'E1024',
            'employee_email' => 'taylor@example.com',
            'position' => 'Coordinator',
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['location_id']);

        $this->assertDatabaseCount('account_pendings', 0, 'account_pending_testing');
    }
}
