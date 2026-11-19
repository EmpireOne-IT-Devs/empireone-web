<?php

namespace App\Services;

use App\Jobs\SendAssetPurchaseRequestEmail;
use App\Models\AssetInventory\AssetPurchaseRequest;
use App\Models\User;
use Aws\Exception\AwsException;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Database\QueryException;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use InvalidArgumentException;
use League\Flysystem\FilesystemException;
use Predis\PredisException;
use RedisException;
use RuntimeException;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Throwable;

class AssetPurchaseRequestService
{
    public function create(User $user, array $values, ?UploadedFile $quotation): AssetPurchaseRequest
    {
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
            $save = function () use ($user, $values, $uuid, $now, $path, $name) {
                $department = $values['department'];
                $code = config('purchase_request.departments')[$department];
                $createdAt = now();
                $request = new AssetPurchaseRequest([
                    'uuid' => $uuid,
                    'purchase_request_id' => $this->nextPurchaseRequestId($createdAt->format('Ym')),
                    'requester_id' => $user->getKey(),
                    'requester_name' => $values['requesterName'] ?? ($user->name ?: $user->email),
                    'requester_email' => $user->email,
                    'item_name' => $values['itemName'],
                    'department' => $department,
                    'department_code' => "{$code}-{$now->year}-Q{$now->quarter}",
                    'category' => $values['category'],
                    'priority' => $values['priority'],
                    'quantity' => $values['quantity'],
                    'unit_price' => $values['unitPrice'],
                    'supplier' => $values['supplierName'] ?? null,
                    'purchase_date' => $now->copy()->addMonthNoOverflow()->toDateString(),
                    'status' => AssetPurchaseRequest::PENDING,
                    'quotation_path' => $path,
                    'quotation_name' => $name,
                ]);
                $request->created_at = $createdAt;
                $request->save();
                $position = 0;
                foreach (config('purchase_request.steps') as $key => $step) {
                    $request->steps()->create([
                        'key' => $key, 'position' => ++$position,
                        'label' => $step['label'], 'description' => $step['description'],
                        'status' => 'pending',
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
            Gate::forUser($user)->authorize('decide', [AssetPurchaseRequest::class, $step->key]);

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
