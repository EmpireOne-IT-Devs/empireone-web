<?php

namespace App\Http\Controllers\API\Account;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAccountPendingRequest;
use App\Http\Resources\Account\AccountPendingResource;
use App\Models\Account\AccountPending;

class AccountPendingController extends Controller
{
    public function store(StoreAccountPendingRequest $request)
    {
        $pendingAccount = AccountPending::create($request->validated())
            ->load('location');

        return AccountPendingResource::make($pendingAccount)
            ->additional(['message' => 'Registration submitted for review.'])
            ->response()
            ->setStatusCode(201);
    }
}
