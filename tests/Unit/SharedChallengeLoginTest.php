<?php

use App\Models\User;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Laravel\Socialite\Facades\Socialite;

uses(Tests\TestCase::class);

beforeEach(function () {
    Schema::create('users', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('email');
        $table->string('password')->nullable();
        $table->unsignedInteger('role');
        $table->string('google_id')->nullable();
        $table->string('avatar')->nullable();
        $table->rememberToken();
        $table->timestamps();
    });
});

afterEach(function () {
    Schema::dropIfExists('users');
});

function sharedChallengeUser(int $role = User::ROLE_EMPLOYEE): User
{
    return User::create([
        'name' => 'Challenge User',
        'email' => 'challenge@example.test',
        'password' => 'password',
        'role' => $role,
    ]);
}

function mockSharedChallengeGoogleUser(): void
{
    $provider = Mockery::mock();
    $provider->shouldReceive('user')->once()->andReturn([
        'email' => 'challenge@example.test',
        'sub' => 'google-test-id',
        'name' => 'Challenge User',
    ]);
    Socialite::shouldReceive('driver')->once()->with('google')->andReturn($provider);
}

it('preserves a guest challenge URL through password login', function () {
    sharedChallengeUser();

    $this->get('/accounts/employee/rnr/challenge_event?challenge=6')
        ->assertRedirect('/auth/login')
        ->assertSessionHas('url.intended', url('/accounts/employee/rnr/challenge_event?challenge=6'));

    $this->post('/login', [
        'login_id' => 'challenge@example.test',
        'password' => 'password',
    ])->assertRedirect(url('/accounts/employee/rnr/challenge_event?challenge=6'));

    $this->assertAuthenticated();
});

it('returns Google users to their intended challenge URL', function () {
    sharedChallengeUser();
    $provider = Mockery::mock();
    $provider->shouldReceive('redirect')->once()->andReturn(redirect('https://accounts.google.com/'));
    $provider->shouldReceive('user')->once()->andReturn([
        'email' => 'challenge@example.test',
        'sub' => 'google-test-id',
        'name' => 'Challenge User',
    ]);
    Socialite::shouldReceive('driver')->twice()->with('google')->andReturn($provider);
    $intended = url('/accounts/employee/rnr/challenge_event?challenge=6');

    $this->get('/accounts/employee/rnr/challenge_event?challenge=6')
        ->assertRedirect('/auth/login')
        ->assertSessionHas('url.intended', $intended);

    $this->get('/api/auth/google/web')
        ->assertRedirect('https://accounts.google.com/')
        ->assertSessionHas('url.intended', $intended);

    $this->get('/api/auth/google/callback')->assertRedirect($intended);

    $this->assertAuthenticated();
});

it('uses the dashboard for password login without a destination', function () {
    sharedChallengeUser();

    $this->post('/login', [
        'login_id' => 'challenge@example.test',
        'password' => 'password',
    ])->assertRedirect('/dashboard');
});

it('uses the role dashboard for Google login without a destination', function () {
    sharedChallengeUser();
    mockSharedChallengeGoogleUser();

    $this->get('/api/auth/google/callback')
        ->assertRedirect('/accounts/employee/dashboard');
});

it('rejects external Google login destinations', function (string $destination) {
    sharedChallengeUser();
    mockSharedChallengeGoogleUser();

    $this->withSession(['url.intended' => $destination])
        ->get('/api/auth/google/callback')
        ->assertRedirect('/accounts/employee/dashboard')
        ->assertSessionMissing('url.intended');
})->with([
    'external absolute URL' => 'https://example.com/steal',
    'protocol-relative URL' => '//example.com/steal',
    'backslash URL' => '/\\example.com/steal',
]);

it('redirects administrators from employee challenge links to their join page', function () {
    $admin = sharedChallengeUser(User::ROLE_ADMIN);

    $this->actingAs($admin)
        ->withoutMiddleware(\App\Http\Middleware\EnsureAccountEmployeeComplete::class)
        ->get('/accounts/employee/rnr/challenge_event?challenge=6')
        ->assertRedirect('/accounts/administrator/rnr/challenges_events/join?challenge=6');
});
