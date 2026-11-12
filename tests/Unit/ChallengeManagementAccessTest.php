<?php

use App\Http\Middleware\EnsureChallengeManagementAccess;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Symfony\Component\HttpKernel\Exception\HttpException;

uses(Tests\TestCase::class);

it('allows challenge management only for departments 1 and 11', function () {
    Schema::create('account_employees', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('user_id');
        $table->unsignedBigInteger('department_id')->nullable();
    });

    DB::table('account_employees')->insert([
        ['user_id' => 101, 'department_id' => 1],
        ['user_id' => 111, 'department_id' => 11],
        ['user_id' => 102, 'department_id' => 2],
        ['user_id' => 112, 'department_id' => 2],
    ]);

    $middleware = new EnsureChallengeManagementAccess();
    $next = fn () => response('allowed');

    foreach ([101, 111] as $userId) {
        $request = Request::create('/');
        $request->setUserResolver(fn () => (object) ['id' => $userId, 'role' => 2]);

        expect($middleware->handle($request, $next)->getContent())->toBe('allowed');
    }

    $managerJoinRequest = Request::create('/accounts/administrator/rnr/challenges_events/join?challenge=5');
    $managerJoinRequest->setUserResolver(fn () => (object) ['id' => 111, 'role' => 2]);
    expect($middleware->handle($managerJoinRequest, $next, 'administrator')->getContent())
        ->toBe('allowed');

    $employeeJoinRequest = Request::create('/accounts/administrator/rnr/challenges_events/join?challenge=5&source=feed');
    $employeeJoinRequest->setUserResolver(fn () => (object) ['id' => 102, 'role' => 2]);
    $employeeJoinResponse = $middleware->handle($employeeJoinRequest, $next, 'administrator');
    expect(parse_url($employeeJoinResponse->headers->get('Location'), PHP_URL_PATH))
        ->toBe('/accounts/employee/rnr/challenge_event')
        ->and(parse_url($employeeJoinResponse->headers->get('Location'), PHP_URL_QUERY))
        ->toBe('challenge=5&source=feed');

    foreach ([102, 103, 112] as $userId) {
        $request = Request::create('/');
        $request->setUserResolver(fn () => (object) ['id' => $userId, 'role' => 2]);

        try {
            $middleware->handle($request, $next);
            $this->fail("User {$userId} should not have challenge management access.");
        } catch (HttpException $exception) {
            expect($exception->getStatusCode())->toBe(403);
        }
    }

    $administratorRequest = Request::create('/');
    $administratorRequest->setUserResolver(fn () => (object) ['id' => 112, 'role' => 1]);
    expect($middleware->handle($administratorRequest, $next, 'administrator')->getContent())
        ->toBe('allowed');

    $applicantRequest = Request::create('/accounts/administrator/rnr/challenges_events/join');
    $applicantRequest->setUserResolver(fn () => (object) ['id' => 101, 'role' => 3]);
    try {
        $middleware->handle($applicantRequest, $next, 'administrator');
        $this->fail('Applicants should not have access to the staff challenge join page.');
    } catch (HttpException $exception) {
        expect($exception->getStatusCode())->toBe(403);
    }

    Schema::drop('account_employees');
});
