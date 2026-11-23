<?php

namespace App\Services;

use App\Jobs\SendAssetPurchaseRequestEmail;
use App\Models\AssetInventory\AssetPurchaseRequest;
use App\Models\Account\AccountEmployee;
use App\Models\User;
use Aws\Exception\AwsException;
use Brick\Math\BigDecimal;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Database\QueryException;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;
use League\Flysystem\FilesystemException;
use Predis\PredisException;
use RedisException;
use RuntimeException;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Throwable;
use Illuminate\Database\Eloquent\Builder;

class AssetPurchaseRequestService
{
    public function approvers(string $search = ''): array
    {
        $query = User::query()->where('role', User::ROLE_ADMIN)->whereNotNull('email_verified_at')
            ->whereHas('account_employee', function (Builder $employee) use ($search) {
                $employee->whereNotNull('eogs_email')->where('eogs_email', '<>', '');
                if ($search !== '') {
                    $employee->where(function (Builder $profile) use ($search) {
                        $term = '%'.$search.'%';
                        $profile->where('eogs_email', 'like', $term)
                            ->orWhereHas('user', fn (Builder $user) => $user->where('name', 'like', $term));
                    });
                }
            })->with('account_employee:user_id,eogs_email')->orderBy('name')->limit(50);
        return $query->get()->map(fn (User $user) => [
            'id' => $user->getKey(),
            'label' => trim($user->name ?: $user->email).' — '.trim($user->account_employee->eogs_email),
        ])->all();
    }

    private function eligibleApprovers(array $ids): Collection
    {
        // The same person may be assigned to more than one step, so repeats are kept.
        $ids = array_values(array_map('intval', $ids));
        $users = User::query()->whereIn('id', $ids)->where('role', User::ROLE_ADMIN)
            ->whereNotNull('email_verified_at')->with('account_employee:user_id,eogs_email')
            ->get()->keyBy(fn (User $user) => $user->getKey());

        return collect($ids)->map(function (int $id) use ($users) {
            $user = $users->get($id);
            $eogs = trim((string) $user?->account_employee?->eogs_email);
            return $user && filter_var($eogs, FILTER_VALIDATE_EMAIL) !== false ? $user : null;
        })->filter()->values();
    }

    public function create(User $user, array $values, ?UploadedFile $quotation): AssetPurchaseRequest
    {
        $approvers = $this->eligibleApprovers($values['approverIds']);
        if (count($approvers) !== 3) {
            throw ValidationException::withMessages(['approverIds' => 'Select three eligible administrators with usable EOGS emails.']);
        }
        $uuid = (string) Str::uuid();
        $now = now();
        $path = null;
        $name = null;
        $disk = null;

        if ($quotation) {
            $disk = $this->quotationDisk();
            $extension = $quotation->guessExtension();
            $basename = Str::ascii(pathinfo($quotation->getClientOriginalName(), PATHINFO_FILENAME));
            $basename = trim(substr(preg_replace('/[^a-zA-Z0-9._-]+/', '-', $basename), 0, 100), '.-_');
            $name = ($basename ?: 'supplier-quotation').'.'.$extension;
            try {
                $path = $disk->putFileAs('purchase-requests/'.$uuid, $quotation, 'quotation.'.$extension, [
                    'ACL' => 'bucket-owner-full-control',
                    'CacheControl' => 'private, no-store',
                ]);
            } catch (FilesystemException $e) {
                report($e);
                abort(503, 'Unable to store the quotation. Please try again.');
            }
            if ($path === false) {
                report(new RuntimeException('Purchase request quotation storage returned false.'));
                abort(503, 'Unable to store the quotation. Please try again.');
            }
        }

        try {
            $save = function () use ($user, $values, $uuid, $now, $path, $name, $approvers) {
                $department = $values['department'];
                $code = config('purchase_request.departments')[$department];
                $createdAt = now();
                $items = isset($values['items']) ? array_map(static fn (array $item) => [
                    'description' => $item['description'],
                    'quantity' => (int) $item['quantity'],
                    'unit_cost' => (string) BigDecimal::of($item['unitCost'])->toScale(2),
                ], $values['items']) : null;
                // Preserve the first item in the legacy columns for older clients.
                $firstItem = $items[0] ?? null;
                $request = new AssetPurchaseRequest([
                    'uuid' => $uuid,
                    'purchase_request_id' => $this->nextPurchaseRequestId($createdAt->format('Ym')),
                    'requester_id' => $user->getKey(),
                    'requester_name' => trim((string) $user->name) !== '' ? $user->name : $user->email,
                    'requester_email' => $user->email,
                    'item_name' => $firstItem['description'] ?? $values['itemName'],
                    'items' => $items,
                    'justification' => $values['justification'],
                    'department' => $department,
                    'department_code' => "{$code}-{$now->year}-Q{$now->quarter}",
                    'category' => $values['category'],
                    'priority' => $values['priority'],
                    'quantity' => $firstItem['quantity'] ?? $values['quantity'],
                    'unit_price' => $firstItem['unit_cost'] ?? $values['unitPrice'],
                    'supplier' => $values['supplierName'] ?? null,
                    'purchase_date' => $now->copy()->addMonthNoOverflow()->toDateString(),
                    'status' => AssetPurchaseRequest::PENDING,
                    'quotation_path' => $path,
                    'quotation_name' => $name,
                ]);
                $request->created_at = $createdAt;
                $request->save();
                $position = 0;
                $steps = collect(config('purchase_request.steps'))->take(3)->all();
                foreach ($steps as $key => $step) {
                    $request->steps()->create([
                        'key' => $key, 'position' => ++$position,
                        'label' => $step['label'], 'description' => $step['description'],
                        'status' => 'pending', 'assigned_user_id' => $approvers[$position - 1]->getKey(),
                    ]);
                }

                $request->load('steps');
                if ($firstStep = $request->steps->first()) {
                    $this->queueEmail($request, $firstStep->key);
                }

                return $request;
            };

            // If two requests take the same number, the unique index rejects one and it retries with the next number.
            return retry(
                3,
                fn () => DB::transaction($save, 3),
                0,
                fn (Throwable $e) => $e instanceof UniqueConstraintViolationException,
            );
        } catch (Throwable $e) {
            if ($path !== null) {
                try {
                    if (! $disk->delete($path)) {
                        report(new RuntimeException('Unable to remove a quotation after its purchase request failed to save.'));
                    }
                } catch (FilesystemException $cleanupError) {
                    report($cleanupError);
                }
            }
            throw $e;
        }
    }

    // Format: PR-YYYYMM-0001. The number restarts at 0001 each month.
    private function nextPurchaseRequestId(string $month): string
    {
        $prefix = "PR-{$month}-";
        $latest = AssetPurchaseRequest::query()
            ->whereLike('purchase_request_id', $prefix.'%')
            ->orderByRaw('LENGTH(purchase_request_id) DESC')
            ->orderByDesc('purchase_request_id')
            ->value('purchase_request_id');
        $number = $latest === null ? 1 : (int) substr($latest, strlen($prefix)) + 1;

        return sprintf('%s%04d', $prefix, $number);
    }

    public function decide(AssetPurchaseRequest $request, User $user, string $key, ?string $remarks, bool $approve): AssetPurchaseRequest
    {
        return DB::transaction(function () use ($request, $user, $key, $remarks, $approve) {
            $locked = AssetPurchaseRequest::query()->lockForUpdate()->findOrFail($request->getKey());
            Gate::forUser($user)->authorize('view', $locked);
            $pending = $locked->steps()->where('status', 'pending')->lockForUpdate()->get();
            $step = $pending->first();

            abort_unless($locked->isPending() && $step && $step->key === $key, 409, 'This approval step is no longer current. Reload the request.');
            Gate::forUser($user)->authorize('decide', [AssetPurchaseRequest::class, $step->key, $locked]);

            $step->update([
                'status' => $approve ? 'approved' : 'rejected',
                'acted_by' => $user->getKey(),
                'approver_name' => $user->name ?: $user->email,
                'acted_at' => now(),
                'remarks' => $remarks,
            ]);
            $locked->update(['status' => ! $approve ? AssetPurchaseRequest::REJECTED
                : ($pending->count() === 1 ? AssetPurchaseRequest::APPROVED : AssetPurchaseRequest::IN_PROGRESS)]);

            $this->queueEmail($locked, $approve ? $pending->get(1)?->key : null);

            return $locked->load('steps');
        }, 3);
    }

    private function queueEmail(AssetPurchaseRequest $request, ?string $stepKey): void
    {
        $job = new SendAssetPurchaseRequestEmail($request->uuid, $request->status, $stepKey);
        DB::afterCommit(function () use ($job) {
            try {
                Bus::dispatch($job);
            } catch (QueryException|RedisException|PredisException|AwsException|TransportExceptionInterface $exception) {
                // The approval is already committed; report delivery setup failures without retrying the write.
                report($exception);
            }
        });
    }

    public function quotationUrl(AssetPurchaseRequest $request): string
    {
        abort_unless($request->quotation_path, 404, 'No quotation is attached to this purchase request.');
        $disk = $this->quotationDisk();

        return $disk->temporaryUrl($request->quotation_path, now()->addMinutes(5), [
            'ResponseContentDisposition' => 'attachment; filename="'.$request->quotation_name.'"',
            'ResponseCacheControl' => 'private, no-store',
            'ResponseContentType' => 'application/octet-stream',
        ]);
    }

    private function quotationDisk(): Filesystem
    {
        $bucket = config('filesystems.disks.purchase_quotations.bucket');
        abort_if(! $bucket || $bucket === config('filesystems.disks.s3.bucket'), 503, 'Private quotation storage is not configured.');

        try {
            return Storage::disk('purchase_quotations');
        } catch (InvalidArgumentException $e) {
            report($e);
            abort(503, 'Private quotation storage is unavailable.');
        }
    }
}
