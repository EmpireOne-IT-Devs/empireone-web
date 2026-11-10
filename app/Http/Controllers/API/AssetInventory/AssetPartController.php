<?php

namespace App\Http\Controllers\API\AssetInventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\AssetInventory\StoreAssetPartRequest;
use App\Http\Resources\AssetInventory\AssetPartResource;
use App\Models\AssetInventory\AssetPart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AssetPartController extends Controller
{
    public function get_all(Request $request)
    {
        Gate::authorize('viewAny', AssetPart::class);

        $query = AssetPart::query()->latest();

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
        return AssetPartResource::collection($query->paginate($perPage)->appends($request->query()));
    }

    public function create_device(StoreAssetPartRequest $request)
    {
        Gate::authorize('create', AssetPart::class);
        $model = AssetPart::create($request->validated());
        return (new AssetPartResource($model))->response()->setStatusCode(201);
    }

    public function get_device(AssetPart $assetPart)
    {
        Gate::authorize('view', $assetPart);
        return new AssetPartResource($assetPart);
    }

    public function update_device(StoreAssetPartRequest $request, AssetPart $assetPart)
    {
        Gate::authorize('update', $assetPart);
        $assetPart->update($request->validated());
        return new AssetPartResource($assetPart->fresh());
    }

    public function delete_device(AssetPart $assetPart)
    {
        Gate::authorize('delete', $assetPart);
        $assetPart->delete();
        return response()->json(null, 204);
    }
}