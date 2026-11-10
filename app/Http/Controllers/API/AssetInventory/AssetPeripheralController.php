<?php

namespace App\Http\Controllers\API\AssetInventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\AssetInventory\StoreAssetPeripheralRequest;
use App\Http\Resources\AssetInventory\AssetPeripheralResource;
use App\Models\AssetInventory\AssetPeripheral;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AssetPeripheralController extends Controller
{
    public function get_all(Request $request)
    {
        Gate::authorize('viewAny', AssetPeripheral::class);

        $query = AssetPeripheral::query()->latest();

        if ($search = trim((string) $request->query('search', ''))) {
            $query->where(function ($q) use ($search) {
                $q->where('asset_tag', 'like', "%{$search}%")
                    ->orWhere('serial_number', 'like', "%{$search}%");
            });
        }

        foreach (['status', 'condition'] as $filter) {
            if ($value = $request->query($filter)) {
                $query->where($filter, $value);
            }
        }

        $perPage = min((int) $request->query('per_page', 10), 100);
        return AssetPeripheralResource::collection($query->paginate($perPage)->appends($request->query()));
    }

    public function create_device(StoreAssetPeripheralRequest $request)
    {
        Gate::authorize('create', AssetPeripheral::class);
        $model = AssetPeripheral::create($request->validated());
        return (new AssetPeripheralResource($model))->response()->setStatusCode(201);
    }

    public function get_device(AssetPeripheral $assetPeripheral)
    {
        Gate::authorize('view', $assetPeripheral);
        return new AssetPeripheralResource($assetPeripheral);
    }

    public function update_device(StoreAssetPeripheralRequest $request, AssetPeripheral $assetPeripheral)
    {
        Gate::authorize('update', $assetPeripheral);
        $assetPeripheral->update($request->validated());
        return new AssetPeripheralResource($assetPeripheral->fresh());
    }

    public function delete_device(AssetPeripheral $assetPeripheral)
    {
        Gate::authorize('delete', $assetPeripheral);
        $assetPeripheral->delete();
        return response()->json(null, 204);
    }
}