<?php

namespace App\Http\Controllers\API\AssetInventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\AssetInventory\StoreAssetMonitorRequest;
use App\Http\Resources\AssetInventory\AssetMonitorResource;
use App\Models\AssetInventory\AssetMonitor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AssetMonitorController extends Controller
{
    public function get_all(Request $request)
    {
        Gate::authorize('viewAny', AssetMonitor::class);

        $query = AssetMonitor::query()->latest();

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
        return AssetMonitorResource::collection($query->paginate($perPage)->appends($request->query()));
    }

    public function create_device(StoreAssetMonitorRequest $request)
    {
        Gate::authorize('create', AssetMonitor::class);
        $model = AssetMonitor::create($request->validated());
        return (new AssetMonitorResource($model))->response()->setStatusCode(201);
    }

    public function get_device(AssetMonitor $assetMonitor)
    {
        Gate::authorize('view', $assetMonitor);
        return new AssetMonitorResource($assetMonitor);
    }

    public function update_device(StoreAssetMonitorRequest $request, AssetMonitor $assetMonitor)
    {
        Gate::authorize('update', $assetMonitor);
        $assetMonitor->update($request->validated());
        return new AssetMonitorResource($assetMonitor->fresh());
    }

    public function delete_device(AssetMonitor $assetMonitor)
    {
        Gate::authorize('delete', $assetMonitor);
        $assetMonitor->delete();
        return response()->json(null, 204);
    }
}