<?php

namespace App\Http\Controllers\API\Account;

use App\Http\Controllers\Controller;
use App\Http\Requests\ApproveAccountPendingRequest;
use App\Http\Resources\Account\AccountPendingResource;
use App\Mail\AccountPendingApprovedMail;
use App\Models\Account\AccountPending;
use App\Services\Account\ApproveAccountPendingService;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;

class AccountPendingApprovalController extends Controller
{
    public function __invoke(
        ApproveAccountPendingRequest $request,
        AccountPending $accountPending,
        ApproveAccountPendingService $approvalService,
    ) {
        $approvedPending = $approvalService->approve(
            $accountPending,
            $request->user(),
        );

        $emailSent = true;

        try {
            Mail::to($approvedPending->user->email)->send(
                new AccountPendingApprovedMail(
                    $approvedPending->user,
                    $approvedPending->eid,
                    config('accounts.pending_employee_initial_password'),
                    url('/auth/login'),
                ),
            );
        } catch (TransportExceptionInterface $exception) {
            report($exception);
            $emailSent = false;
        }

        return AccountPendingResource::make($approvedPending)
            ->additional([
                'message' => $emailSent
                    ? 'Employee account approved and credentials email sent.'
                    : 'Employee account approved, but the credentials email could not be sent.',
                'email_sent' => $emailSent,
            ])
            ->response();
    }
}
