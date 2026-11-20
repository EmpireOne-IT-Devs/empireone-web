<?php

namespace App\Services;

use App\Jobs\SendAssetLiabilityFormEmail;
use App\Models\Account;
use App\Models\Account\AccountEmployee;
use App\Models\AssetInventory\AssetItemRequest;
use App\Models\AssetInventory\AssetLiabilityForm;
use App\Models\Location;
use App\Models\User;
use Aws\Exception\AwsException;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Predis\PredisException;
use RedisException;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;

class AssetLiabilityFormService
{
    public function createForApprovedRequest(AssetItemRequest $request): void
    {
        // The caller holds the request lock and commits the form with the final decision.
        $asset = AssetItemRequest::availableAssets($request->asset_type)->find($request->asset_id);
        abort_unless($asset && $request->reservation_active, 409, 'The reserved asset is no longer available.');
        $employee = $this->employeeProfile($request->assignee_id, $request->employee_number);
        abort_unless($employee, 409, 'The assigned employee record has changed.');

        $form = $request->liabilityForm()->create([
            'uuid' => (string) Str::uuid(),
            'assignee_id' => $request->assignee_id,
            'employee_name' => $request->assignee_name,
            'employee_number' => $request->employee_number,
            'asset_tag' => $asset->asset_tag,
            'source' => 'digital',
            'status' => AssetLiabilityForm::PENDING,
            'template_version' => AssetLiabilityForm::TEMPLATE_VERSION,
            'document' => [
                'accountProgram' => $employee->account_id === null ? null : Account::whereKey($employee->account_id)->value('name'),
                'hireDate' => $employee->started_at,
                'location' => $employee->location_id === null ? $asset->location : Location::whereKey($employee->location_id)->value('name'),
                'items' => [$this->assetSnapshot($request, $asset)],
            ],
        ]);
        DB::afterCommit(function () use ($form) {
            // Until the signing page is deployed, leave the form pending without sending a dead link.
            if (! Route::has(AssetLiabilityForm::SIGNING_ROUTE)) {
                Log::info('Liability form email deferred: signing page unavailable.', ['form_uuid' => $form->uuid]);

                return;
            }
            try {
                $this->dispatchEmail($form);
            } catch (QueryException|RedisException|PredisException|AwsException|TransportExceptionInterface $exception) {
                report($exception);
            }
        });
    }

    public function acknowledge(AssetLiabilityForm $form, User $actor, string $templateVersion): AssetLiabilityForm
    {
        Gate::forUser($actor)->authorize('acknowledge', $form);
        $request = $form->itemRequest()->first();
        abort_unless($request, 409, 'This form is not linked to an item request.');

        return DB::transaction(function () use ($form, $actor, $templateVersion, $request) {
            // Creation locks inventory before looking up its reservation. Use the same order here.
            $asset = AssetItemRequest::availableAssets($request->asset_type)->lockForUpdate()->find($request->asset_id);
            $itemRequest = AssetItemRequest::lockForUpdate()->findOrFail($request->getKey());
            $locked = AssetLiabilityForm::lockForUpdate()->findOrFail($form->getKey());
            Gate::forUser($actor)->authorize('acknowledge', $locked);
            if ($locked->status === AssetLiabilityForm::ACKNOWLEDGED) {
                return $locked;
            }
            abort_unless($locked->status === AssetLiabilityForm::PENDING
                && $itemRequest->status === AssetItemRequest::APPROVED && $itemRequest->reservation_active,
                409, 'This form is no longer pending acknowledgment.');
            abort_unless($locked->template_version === $templateVersion, 409, 'The form version has changed. Reload the form.');
            $storedItem = $locked->document['items'][0];
            $currentItem = $asset ? $this->assetSnapshot($itemRequest, $asset) : [];
            ksort($storedItem);
            ksort($currentItem);
            abort_unless($asset && $storedItem === $currentItem,
                409, 'The reserved asset has changed. Contact the asset custodian.');

            $employee = $this->employeeProfile($actor->getKey(), $locked->employee_number);
            $signature = $employee?->signature;
            if (! $this->isPngSignature($signature)) {
                throw ValidationException::withMessages([
                    'signature' => 'A valid signature is required in your employee profile before acknowledging.',
                ]);
            }

            match ($itemRequest->asset_type) {
                'devices', 'monitors' => $asset->update(['availability' => 'Assigned', 'issued_to' => $locked->employee_name]),
                'other_assets' => $asset->update(['assigned_to' => $locked->employee_name]),
                'parts', 'peripherals' => $asset->decrement('quantity'),
            };
            $itemRequest->update(['status' => AssetItemRequest::ISSUED, 'reservation_active' => null]);
            $now = now();
            $locked->update([
                'status' => AssetLiabilityForm::ACKNOWLEDGED,
                'issue_date' => $now->toDateString(),
                'acknowledged_by' => $actor->getKey(),
                'printed_name' => $locked->employee_name,
                'signature' => $signature,
                'acknowledged_at' => $now,
            ]);

            return $locked;
        }, 3);
    }

    public function void(AssetLiabilityForm $form, User $actor, string $reason): AssetLiabilityForm
    {
        return DB::transaction(function () use ($form, $actor, $reason) {
            $request = $form->itemRequest()->lockForUpdate()->first();
            $locked = AssetLiabilityForm::lockForUpdate()->findOrFail($form->getKey());
            Gate::forUser($actor)->authorize('void', $locked);
            abort_unless($locked->status === AssetLiabilityForm::PENDING && $request?->status === AssetItemRequest::APPROVED,
                409, 'Only pending forms may be voided.');
            $request->update(['status' => AssetItemRequest::CANCELLED, 'reservation_active' => null]);
            $locked->update([
                'status' => AssetLiabilityForm::VOIDED,
                'void_reason' => $reason,
                'voided_by' => $actor->getKey(),
                'voided_at' => now(),
            ]);

            return $locked;
        }, 3);
    }

    public function resend(AssetLiabilityForm $form): void
    {
        abort_unless($form->status === AssetLiabilityForm::PENDING, 409, 'Only pending forms can be resent.');
        abort_unless(Route::has(AssetLiabilityForm::SIGNING_ROUTE), 409, 'The employee signing page is not available yet.');
        $recipient = User::find($form->assignee_id);
        abort_unless($recipient && Gate::forUser($recipient)->allows('acknowledge', $form),
            409, 'The assigned employee does not have a verified account.');
        $this->dispatchEmail($form);
    }

    private function employeeProfile(int $userId, string $employeeNumber): ?AccountEmployee
    {
        return AccountEmployee::where('user_id', $userId)->where('employee_id', $employeeNumber)
            ->whereIn('status', ['Regular', 'Probationary', 'Extended Probationary', 'Contractual'])
            ->whereNull('employment_status')->latest('id')->first();
    }

    private function assetSnapshot(AssetItemRequest $request, Model $asset): array
    {
        $rawType = $asset->device_type ?? $asset->monitor_type ?? $asset->peripheral_type ?? $asset->part_type ?? $asset->category;
        $type = match (strtolower((string) $rawType)) {
            'laptop' => 'Laptop',
            'mobile', 'tablet', 'mobile device' => 'Mobile Device',
            'headset' => 'Headset',
            'id & lanyard' => 'ID & Lanyard',
            'access badge/rfid' => 'Access Badge/RFID',
            default => 'Other Equipment',
        };

        return [
            'assetTag' => $asset->asset_tag,
            'assetType' => $type,
            'brandModel' => trim($asset->brand.' '.$asset->model) ?: $request->asset_name,
            'serialNumber' => $asset->serial_number,
            'conditionAtIssuance' => $asset->condition,
            'purchaseValue' => $asset->price,
            'remarks' => $type === 'Other Equipment' ? $rawType : null,
        ];
    }

    private function isPngSignature(?string $signature): bool
    {
        $prefix = 'data:image/png;base64,';
        if ($signature === null || strlen($signature) > 1024 * 1024 || ! str_starts_with($signature, $prefix)) {
            return false;
        }
        $bytes = base64_decode(substr($signature, strlen($prefix)), true);

        return $bytes !== false && str_starts_with($bytes, "\x89PNG\r\n\x1a\n")
            && (@getimagesizefromstring($bytes)[2] ?? null) === IMAGETYPE_PNG;
    }

    private function dispatchEmail(AssetLiabilityForm $form): void
    {
        SendAssetLiabilityFormEmail::dispatch($form->uuid);
    }
}
