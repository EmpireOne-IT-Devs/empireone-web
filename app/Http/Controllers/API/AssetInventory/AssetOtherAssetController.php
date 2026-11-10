<?php

namespace App\Http\Controllers\API\AssetInventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\AssetInventory\StoreAssetOtherAssetRequest;
use App\Http\Resources\AssetInventory\AssetOtherAssetResource;
use App\Models\AssetInventory\AssetOtherAsset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AssetOtherAssetController extends Controller
{
    public function get_all(Request $request)
    {
        Gate::authorize('viewAny', AssetOtherAsset::class);

        $query = AssetOtherAsset::query()->latest();

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
        return AssetOtherAssetResource::collection($query->paginate($perPage)->appends($request->query()));
    }

    public function create_device(StoreAssetOtherAssetRequest $request)
    {
        Gate::authorize('create', AssetOtherAsset::class);
        $model = AssetOtherAsset::create($request->validated());
        return (new AssetOtherAssetResource($model))->response()->setStatusCode(201);
    }

    public function get_device(AssetOtherAsset $assetOtherAsset)
    {
        Gate::authorize('view', $assetOtherAsset);
        return new AssetOtherAssetResource($assetOtherAsset);
    }

    public function update_device(StoreAssetOtherAssetRequest $request, AssetOtherAsset $assetOtherAsset)
    {
        Gate::authorize('update', $assetOtherAsset);
        $assetOtherAsset->update($request->validated());
        return new AssetOtherAssetResource($assetOtherAsset->fresh());
    }

    public function delete_device(AssetOtherAsset $assetOtherAsset)
    {
        Gate::authorize('delete', $assetOtherAsset);
        $assetOtherAsset->delete();
        return response()->json(null, 204);
    }
}