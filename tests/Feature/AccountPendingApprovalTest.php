<?php

namespace Tests\Feature;

use App\Models\Account\AccountPending;
use App\Models\Account\AccountEmployee;
use App\Models\Account\AccountPersonalInformation;
use App\Mail\AccountPendingApprovedMail;
use App\Models\User;
use App\Http\Middleware\EnsureAccountEmployeeComplete;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;
use Symfony\Component\Mailer\Exception\TransportException;
use Tests\TestCase;

class AccountPendingApprovalTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config([
            'accounts.pending_employee_initial_password' => 'test-only-password',
            'database.default' => 'account_pending_approval_testing',
            'database.connections.account_pending_approval_testing' => [
                'driver' => 'sqlite',
                'database' => ':memory:',
                'prefix' => '',
                'foreign_key_constraints' => true,
            ],
        ]);
        DB::purge('account_pending_approval_testing');

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

        Schema::create('account_personal_information', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->string('first_name')->nullable();
            $table->string('middle_name')->nullable();
            $table->string('last_name')->nullable();
            $table->timestamps();
        });

        Schema::create('account_employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->string('employee_id')->unique();
            $table->foreignId('location_id')->nullable();
            $table->string('position')->nullable();
            $table->timestamps();
        });
    }

    public function test_administrator_approval_creates_employee_account_and_retains_audit_data(): void
    {
        config(['accounts.pending_employee_initial_password' => 'Business12']);
        Mail::fake();

        $locationId = DB::table('locations')->insertGetId([
            'name' => 'San Carlos',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $pending = $this->createPendingAccount($locationId);
        $admin = $this->createUser('admin@example.com', User::ROLE_ADMIN);

        $response = $this->actingAs($admin, 'sanctum')->postJson(
            "/api/accounts/account-pendings/{$pending->uuid}/approve",
        );

        $response
            ->assertOk()
            ->assertJsonPath('data.status', 'approved')
            ->assertJsonPath('email_sent', true);
        $this->assertIsInt($response->json('data.user_id'));

        $user = User::query()->where('email', 'taylor@example.com')->firstOrFail();
        $this->assertSame(User::ROLE_EMPLOYEE, $user->role);
        $this->assertTrue(
            Hash::check(config('accounts.pending_employee_initial_password'), $user->password),
        );
        Mail::assertSent(
            AccountPendingApprovedMail::class,
            fn ($mail) => $mail->hasTo($user->email)
                && $mail->initialPassword === 'Business12'
                && str_contains($mail->render(), 'Business12')
                && str_contains($mail->render(), 'E1024'),
        );

        $this->assertDatabaseHas('account_personal_information', [
            'user_id' => $user->id,
            'first_name' => 'Taylor',
            'middle_name' => null,
            'last_name' => 'Example',
        ], 'account_pending_approval_testing');

        $this->assertDatabaseHas('account_employees', [
            'user_id' => $user->id,
            'employee_id' => 'E1024',
            'location_id' => $locationId,
            'position' => 'Coordinator',
        ], 'account_pending_approval_testing');

        $this->assertDatabaseHas('account_pendings', [
            'id' => $pending->id,
            'status' => 'approved',
            'approved_by_user_id' => $admin->id,
            'user_id' => $user->id,
        ], 'account_pending_approval_testing');
        $this->assertNotNull($pending->fresh()->approved_at);

        $this->getJson('/api/accounts/get_account_pendings')
            ->assertOk()
            ->assertJsonCount(0, 'data');

        $user->setRelation(
            'account_employee',
            AccountEmployee::query()->where('user_id', $user->id)->firstOrFail(),
        );
        $personalInformation = AccountPersonalInformation::query()
            ->where('user_id', $user->id)
            ->firstOrFail();
        $user->setRelation('personal_information', $personalInformation);

        $request = Request::create('/accounts/employee/dashboard');
        $request->setUserResolver(fn () => $user);
        $setupResponse = app(EnsureAccountEmployeeComplete::class)->handle(
            $request,
            fn () => response()->noContent(),
        );
        $this->assertSame(
            '/accounts/employee/setup1',
            parse_url($setupResponse->getTargetUrl(), PHP_URL_PATH),
        );

        $personalInformation->forceFill([
            'date_of_birth' => '1990-01-01',
            'year_graduated' => '2012',
            'contact' => '09123456789',
            'region' => 'Region',
            'province' => 'Province',
            'city' => 'City',
            'barangay' => 'Barangay',
            'street' => 'Street',
            'zip_code' => '1000',
            'degree' => 'Degree',
            'school_name' => 'School',
            'course' => 'Course',
        ]);
        $request->setUserResolver(fn () => $user);
        $setupResponse = app(EnsureAccountEmployeeComplete::class)->handle(
            $request,
            fn () => response()->noContent(),
        );
        $this->assertSame(
            '/accounts/employee/setup2',
            parse_url($setupResponse->getTargetUrl(), PHP_URL_PATH),
        );
    }

    public function test_approval_is_rejected_for_non_administrators(): void
    {
        $locationId = DB::table('locations')->insertGetId([
            'name' => 'San Carlos',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $pending = $this->createPendingAccount($locationId);
        $employee = $this->createUser('employee@example.com', User::ROLE_EMPLOYEE);

        $this->actingAs($employee, 'sanctum')
            ->postJson("/api/accounts/account-pendings/{$pending->uuid}/approve")
            ->assertForbidden();

        $this->assertDatabaseCount('users', 1, 'account_pending_approval_testing');
        $this->assertSame('pending', $pending->fresh()->status);
    }

    public function test_approval_persists_when_credentials_email_delivery_fails(): void
    {
        $locationId = DB::table('locations')->insertGetId([
            'name' => 'San Carlos',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $pending = $this->createPendingAccount($locationId);
        $admin = $this->createUser('admin@example.com', User::ROLE_ADMIN);
        $mailer = \Mockery::mock();

        Mail::shouldReceive('to')
            ->once()
            ->with('taylor@example.com')
            ->andReturn($mailer);
        $mailer->shouldReceive('send')
            ->once()
            ->with(\Mockery::type(AccountPendingApprovedMail::class))
            ->andThrow(new TransportException('Mail transport unavailable.'));

        $this->actingAs($admin, 'sanctum')
            ->postJson("/api/accounts/account-pendings/{$pending->uuid}/approve")
            ->assertOk()
            ->assertJsonPath('data.status', 'approved')
            ->assertJsonPath('email_sent', false)
            ->assertJsonPath(
                'message',
                'Employee account approved, but the credentials email could not be sent.',
            );

        $this->assertDatabaseHas('account_pendings', [
            'id' => $pending->id,
            'status' => 'approved',
        ], 'account_pending_approval_testing');
        $this->assertDatabaseCount('account_employees', 1, 'account_pending_approval_testing');
    }

    public function test_approval_fails_without_a_configured_initial_password(): void
    {
        $locationId = DB::table('locations')->insertGetId([
            'name' => 'San Carlos',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $pending = $this->createPendingAccount($locationId);
        $admin = $this->createUser('admin@example.com', User::ROLE_ADMIN);
        config(['accounts.pending_employee_initial_password' => null]);

        $this->actingAs($admin, 'sanctum')
            ->postJson("/api/accounts/account-pendings/{$pending->uuid}/approve")
            ->assertStatus(503)
            ->assertJsonPath(
                'message',
                'The employee account initial password is not configured. Set ACCOUNT_PENDING_INITIAL_PASSWORD on the server.',
            );

        $this->assertSame('pending', $pending->fresh()->status);
        $this->assertDatabaseCount('account_employees', 0, 'account_pending_approval_testing');
    }

    public function test_approved_registration_cannot_create_a_second_account(): void
    {
        $locationId = DB::table('locations')->insertGetId([
            'name' => 'San Carlos',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $pending = $this->createPendingAccount($locationId);
        $admin = $this->createUser('admin@example.com', User::ROLE_ADMIN);
        $this->actingAs($admin, 'sanctum');

        $this->postJson("/api/accounts/account-pendings/{$pending->uuid}/approve")
            ->assertOk();

        $this->postJson("/api/accounts/account-pendings/{$pending->uuid}/approve")
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['account_pending']);

        $this->assertDatabaseCount('users', 2, 'account_pending_approval_testing');
        $this->assertDatabaseCount('account_employees', 1, 'account_pending_approval_testing');
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
            'password' => 'test-password',
            'role' => $role,
        ]);
    }
}
