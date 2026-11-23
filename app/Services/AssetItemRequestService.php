<?php

namespace App\Services;

use App\Jobs\SendAssetItemRequestEmail;
use App\Models\Account\AccountEmployee;
use App\Models\AssetInventory\AssetItemRequest;
use App\Models\Department;
use App\Models\User;
use Aws\Exception\AwsException;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\QueryException;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Predis\PredisException;
use RedisException;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;

class AssetItemRequestService
{
    public function approvers(string $search = ''): array
    {
        $query = User::query()->where('role', User::ROLE_ADMIN)->whereNotNull('email_verified_at')
            ->whereHas('account_employee', function (Builder $employee) use ($search) {
                $employee->whereNotNull('eogs_email')->where('eogs_email', '<>', '');
                if ($search !== '') {
                    $employee->where('eogs_email', 'like', '%'.$search.'%');
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

    public function __construct(private AssetLiabilityFormService $liabilityForms) {}

    public function create(User $actor, array $values): AssetItemRequest
    {
        $approvers = $this->eligibleApprovers($values['approverIds']);
        if (count($approvers) !== 3) {
            throw ValidationException::withMessages(['approverIds' => 'Select three eligible administrators with usable EOGS emails.']);
        }
        return retry(3, fn () => DB::transaction(function () use ($actor, $values, $approvers) {
            $type = $values['assetType'];
            $asset = AssetItemRequest::availableAssets($type)->where('uuid', $values['assetUuid'])->lockForUpdate()->first();
            if (! $asset || AssetItemRequest::where('asset_type', $type)->where('asset_id', $asset->getKey())
                ->where('reservation_active', true)->lockForUpdate()->first(['id'])) {
                throw ValidationException::withMessages(['assetUuid' => 'This asset is no longer available.']);
            }

            $employee = $this->activeEmployees()->where('user_id', $values['assigneeId'])->with('user:id,name,email')->first();
            if (! $employee) {
                throw ValidationException::withMessages(['assigneeId' => 'Select an active employee with an employee number.']);
            }

            $prefix = 'IR-'.now()->format('Ym').'-';
            $latest = AssetItemRequest::whereLike('item_request_id', $prefix.'%')
                ->orderByRaw('LENGTH(item_request_id) DESC')->orderByDesc('item_request_id')->value('item_request_id');
            $number = $latest === null ? 1 : (int) substr($latest, strlen($prefix)) + 1;
            $request = AssetItemRequest::create([
                'uuid' => (string) Str::uuid(),
                'item_request_id' => sprintf('%s%04d', $prefix, $number),
                'requester_id' => $actor->getKey(),
                'requester_name' => $actor->name ?: $actor->email,
                'requester_email' => $actor->email,
                'assignee_id' => $employee->user_id,
                'assignee_name' => $employee->user->name ?: $employee->user->email,
                'assignee_email' => $employee->user->email,
                'employee_number' => $employee->employee_id,
                'department' => $employee->department_id === null ? null
                    : Department::whereKey($employee->department_id)->value('name'),
                'asset_type' => $type,
                'asset_id' => $asset->getKey(),
                'asset_tag' => $asset->asset_tag,
                'asset_name' => $this->assetName($type, $asset),
                'request_type' => $values['requestType'],
                'priority' => $values['priority'],
                'from_date' => $values['fromDate'] ?? null,
                'until_date' => $values['untilDate'] ?? null,
                'justification' => $values['justification'],
                'purpose' => $values['purpose'] ?? null,
                'status' => AssetItemRequest::PENDING,
                'reservation_active' => true,
            ]);

            $steps = config('item_request.steps');
            $position = 0;
            foreach ($steps as $key => $step) {
                $request->steps()->create([
                    'key' => $key, 'position' => ++$position, 'label' => $step['label'],
                    'description' => $step['description'], 'status' => 'pending',
                    'assigned_user_id' => $approvers[$position - 1]->getKey(),
                ]);
            }
            $this->queueEmail($request, array_key_first($steps));

            return $request->load('steps');
        }, 3), 0, fn ($error) => $error instanceof UniqueConstraintViolationException);
    }

    public function decide(AssetItemRequest $request, User $actor, string $key, ?string $remarks, bool $approve): AssetItemRequest
    {
        return DB::transaction(function () use ($request, $actor, $key, $remarks, $approve) {
            $locked = AssetItemRequest::lockForUpdate()->findOrFail($request->getKey());
            Gate::forUser($actor)->authorize('decide', [AssetItemRequest::class, $key, $locked]);
            $pending = $locked->steps()->where('status', 'pending')->limit(2)->get();
            $step = $pending->first();
            abort_unless($locked->isPending() && $step?->key === $key, 409, 'This approval step is no longer current. Reload the request.');

            $step->update([
                'status' => $approve ? 'approved' : 'rejected',
                'acted_by' => $actor->getKey(),
                'approver_name' => $actor->name ?: $actor->email,
                'acted_at' => now(),
                'remarks' => $remarks,
            ]);
            $next = $pending->get(1);
            $locked->update($approve ? [
                'status' => $next ? AssetItemRequest::IN_PROGRESS : AssetItemRequest::APPROVED,
            ] : [
                'status' => AssetItemRequest::REJECTED, 'reservation_active' => null,
            ]);
            if ($next && $approve) {
                $this->queueEmail($locked, $next->key);
            } elseif (! $approve) {
                $this->queueEmail($locked, null);
            } else {
                $this->liabilityForms->createForApprovedRequest($locked);
                $this->queueEmail($locked, null);
            }

            return $locked->load('steps');
        }, 3);
    }

    public function lookups(string $assetSearch, string $employeeSearch): array
    {
        $assets = new Collection;
        foreach (array_keys(AssetItemRequest::ASSETS) as $type) {
            $query = AssetItemRequest::availableAssets($type);
            $table = $query->getModel()->getTable();
            $query->whereNotExists(AssetItemRequest::selectRaw('1')->where('asset_type', $type)
                ->whereColumn('asset_id', $table.'.id')->where('reservation_active', true)->toBase());

            if ($assetSearch !== '') {
                $query->where(function (Builder $search) use ($type, $assetSearch) {
                    $term = "%{$assetSearch}%";
                    $columns = in_array($type, ['parts', 'other_assets'], true) ? ['name'] : ['brand', 'model'];
                    $search->whereLike('asset_tag', $term)->orWhereLike('serial_number', $term);
                    foreach ($columns as $column) {
                        $search->orWhereLike($column, $term);
                    }
                });
            }
            foreach ($query->orderBy('asset_tag')->limit(20)->get() as $asset) {
                $assets->push([
                    'uuid' => $asset->uuid, 'type' => $type,
                    'label' => $asset->asset_tag.' — '.$this->assetName($type, $asset),
                ]);
            }
        }

        $employees = $this->activeEmployees()->with('user:id,name,email');
        if ($employeeSearch !== '') {
            $term = "%{$employeeSearch}%";
            $employees->where(fn (Builder $query) => $query->whereLike('employee_id', $term)
                ->orWhereHas('user', fn (Builder $user) => $user->whereLike('name', $term)));
        }

        return [
            'assets' => $assets->sortBy('label')->take(20)->values(),
            'employees' => $employees->orderBy('employee_id')->orderBy('id')->limit(20)->get()
                ->map(fn (AccountEmployee $employee) => [
                    'id' => $employee->user_id,
                    'label' => ($employee->user->name ?: $employee->user->email).' ('.$employee->employee_id.')',
                ]),
        ];
    }

    private function activeEmployees(): Builder
    {
        return AccountEmployee::query()
            ->whereIn('status', ['Regular', 'Probationary', 'Extended Probationary', 'Contractual'])
            ->whereNull('employment_status')->whereNotNull('employee_id')->where('employee_id', '<>', '')
            ->whereHas('user', fn (Builder $user) => $user->whereIn('role', [User::ROLE_ADMIN, User::ROLE_EMPLOYEE]));
    }

    private function assetName(string $type, Model $asset): string
    {
        return match ($type) {
            'parts', 'other_assets' => $asset->name,
            'peripherals' => trim($asset->brand.' '.$asset->model) ?: $asset->peripheral_type,
            default => trim($asset->brand.' '.$asset->model),
        };
    }

    private function queueEmail(AssetItemRequest $request, ?string $step): void
    {
        $job = new SendAssetItemRequestEmail($request->uuid, $request->status, $step);
        DB::afterCommit(function () use ($job) {
            try {
                Bus::dispatch($job);
            } catch (QueryException|RedisException|PredisException|AwsException|TransportExceptionInterface $exception) {
                report($exception);
            }
        });
    }
}
