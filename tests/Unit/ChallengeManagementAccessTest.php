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
    ]);

    $middleware = new EnsureChallengeManagementAccess();
    $next = fn () => response('allowed');

    foreach ([101, 111] as $userId) {
        $request = Request::create('/');
        $request->setUserResolver(fn () => (object) ['id' => $userId]);

        expect($middleware->handle($request, $next)->getContent())->toBe('allowed');
    }

    foreach ([102, 103] as $userId) {
        $request = Request::create('/');
        $request->setUserResolver(fn () => (object) ['id' => $userId]);

        try {
            $middleware->handle($request, $next);
            $this->fail("User {$userId} should not have challenge management access.");
        } catch (HttpException $exception) {
            expect($exception->getStatusCode())->toBe(403);
        }
    }

    Schema::drop('account_employees');
});
