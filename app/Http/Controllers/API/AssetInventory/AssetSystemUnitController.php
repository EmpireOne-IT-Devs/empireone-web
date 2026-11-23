<?php

namespace App\Http\Controllers\API\AssetInventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\AssetInventory\StoreAssetSystemUnitRequest;
use App\Http\Resources\AssetInventory\AssetSystemUnitResource;
use App\Models\AssetInventory\AssetSystemUnit;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class AssetSystemUnitController extends Controller
{
    public function get_all(Request $request)
    {
        Gate::authorize('viewAny', AssetSystemUnit::class);
        $filters = $request->validate([
            'page' => ['nullable', 'integer', 'min:1', 'max:1000000'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
            'search' => ['nullable', 'string', 'max:150'],
            'type' => ['nullable', Rule::in(AssetSystemUnit::TYPES)],
            'status' => ['nullable', Rule::in(AssetSystemUnit::STATUSES)],
            'location' => ['nullable', 'string', 'max:150'],
        ]);

        $query = AssetSystemUnit::query()->latest()->latest('id');
        if (($term = trim($filters['search'] ?? '')) !== '') {
            $query->where(function ($search) use ($term) {
                foreach (['name', 'asset_tag', 'cpu', 'os', 'station'] as $column) {
                    $search->orWhereLike($column, "%{$term}%");
                }
            });
        }
        foreach (['type' => 'system_type', 'status' => 'status', 'location' => 'location'] as $filter => $column) {
            if (isset($filters[$filter])) {
                $query->where($column, $filters[$filter]);
            }
        }

        // The stats cards describe the whole inventory, not the filtered page.
        $stats = [
            'total' => AssetSystemUnit::count(),
            'available' => AssetSystemUnit::where('status', 'Available')->count(),
            'assigned' => AssetSystemUnit::where('status', 'Assigned')->count(),
            'custom' => AssetSystemUnit::whereRaw('LOWER(name) LIKE ?', ['%custom%'])->count(),
        ];

        return AssetSystemUnitResource::collection(
            $query->paginate((int) ($filters['per_page'] ?? 10))->appends($filters),
        )->additional(['stats' => $stats]);
    }

    public function create_device(StoreAssetSystemUnitRequest $request)
    {
        $values = $request->validated();
        $attributes = [
            'name' => $values['name'],
            'system_type' => $values['type'],
            'cpu' => $values['cpu'],
            'ram' => $values['ram'],
            'storage' => $values['storage'],
            'os' => $values['os'],
            'status' => $values['status'],
            'location' => $values['location'],
            'station' => $values['station'] ?? null,
        ];

        // Two saves can pick the same asset tag; the unique index rejects one and it retries with the next tag.
        $unit = retry(
            3,
            fn () => AssetSystemUnit::create($attributes),
            0,
            fn ($error) => $error instanceof UniqueConstraintViolationException,
        );

        return (new AssetSystemUnitResource($unit))->response()->setStatusCode(201);
    }
}
