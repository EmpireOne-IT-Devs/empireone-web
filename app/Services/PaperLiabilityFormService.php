<?php

namespace App\Services;

use App\Models\Account\AccountEmployee;
use App\Models\AssetInventory\AssetLiabilityForm;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\QueryException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use League\Flysystem\FilesystemException;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PaperLiabilityFormService
{
    private const DISK = 'liability_paper_scans';

    public function employees(string $term): Collection
    {
        return $this->profiles()
            ->where(fn (Builder $query) => $query->whereLike('employee_id', "%{$term}%")
                ->orWhereHas('user', fn (Builder $user) => $user->whereLike('name', "%{$term}%")))
            ->orderBy('employee_id')->orderByDesc('id')->limit(20)->get();
    }

    public function create(User $recorder, array $values, ?UploadedFile $scan): AssetLiabilityForm
    {
        $profile = $this->profiles()->find($values['employeeProfileId']);
        if (! $profile) {
            throw ValidationException::withMessages(['employeeProfileId' => 'Select an employee from the search results.']);
        }

        $items = array_map(fn (array $item) => [
            'assetType' => $item['assetType'],
            'assetTag' => $item['assetTag'] ?? null,
            'brandModel' => $item['brandModel'],
            'serialNumber' => $item['serialNumber'] ?? null,
            'conditionAtIssuance' => $item['conditionAtIssuance'] ?? null,
            'purchaseValue' => $item['purchaseValue'] ?? null,
            'remarks' => $item['remarks'] ?? null,
        ], $values['items']);
        $uuid = (string) Str::uuid();
        $path = $scan ? $this->storeScan($uuid, $scan) : null;

        try {
            return AssetLiabilityForm::create([
                'uuid' => $uuid,
                'assignee_id' => $profile->user_id,
                'employee_name' => $profile->user->name,
                'employee_number' => $profile->employee_id,
                'asset_tag' => collect($items)->pluck('assetTag')->filter()->first() ?? '',
                'source' => AssetLiabilityForm::SOURCE_PAPER,
                'status' => AssetLiabilityForm::ACKNOWLEDGED,
                'template_version' => AssetLiabilityForm::TEMPLATE_VERSION,
                'issue_date' => $values['issueDate'] ?? null,
                'paper_signed_date' => $values['signedDate'],
                'recorded_by' => $recorder->getKey(),
                'paper_scan_path' => $path,
                'document' => [
                    'accountProgram' => $values['accountProgram'] ?? null,
                    'hireDate' => $values['hireDate'] ?? null,
                    'location' => $values['location'] ?? null,
                    'items' => $items,
                ],
            ]);
        } catch (QueryException $exception) {
            if ($path !== null) {
                try {
                    Storage::disk(self::DISK)->delete($path);
                } catch (FilesystemException $cleanupError) {
                    report($cleanupError);
                }
            }
            throw $exception;
        }
    }

    public function download(AssetLiabilityForm $form): StreamedResponse
    {
        $path = $form->paper_scan_path;
        $disk = Storage::disk(self::DISK);
        abort_unless($path && $disk->exists($path), 404, 'No paper scan is available.');

        return $disk->download($path, sprintf('LF-%04d-paper-scan.%s', $form->getKey(), pathinfo($path, PATHINFO_EXTENSION)), [
            'Cache-Control' => 'private, no-store',
            'Content-Type' => 'application/octet-stream',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    private function profiles(): Builder
    {
        return AccountEmployee::query()->whereNotNull('employee_id')->where('employee_id', '<>', '')
            ->whereHas('user', fn (Builder $user) => $user->whereNotNull('name')->where('name', '<>', ''))
            ->with('user:id,name');
    }

    private function storeScan(string $uuid, UploadedFile $scan): string
    {
        try {
            $path = Storage::disk(self::DISK)->putFileAs($uuid, $scan, 'scan.'.$scan->extension());
        } catch (FilesystemException $exception) {
            report($exception);
            abort(503, 'Unable to store the paper scan. Please try again.');
        }

        abort_if($path === false, 503, 'Unable to store the paper scan. Please try again.');

        return $path;
    }
}
