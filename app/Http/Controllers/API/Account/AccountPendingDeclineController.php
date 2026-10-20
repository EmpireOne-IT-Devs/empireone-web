<?php

namespace App\Http\Controllers\API\Account;

use App\Http\Controllers\Controller;
use App\Http\Requests\DeclineAccountPendingRequest;
use App\Http\Resources\Account\AccountPendingResource;
use App\Models\Account\AccountPending;
use App\Services\Account\DeclineAccountPendingService;

class AccountPendingDeclineController extends Controller
{
    public function __invoke(
        DeclineAccountPendingRequest $request,
        AccountPending $accountPending,
        DeclineAccountPendingService $declineService,
    ) {
        $declinedPending = $declineService->decline(
            $accountPending,
            $request->user(),
        );

        return AccountPendingResource::make($declinedPending)
            ->additional(['message' => 'Registration declined successfully.'])
            ->response();
    }
}
