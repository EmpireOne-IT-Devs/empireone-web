<?php

namespace App\Http\Controllers\API\AssetInventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\AssetInventory\SearchAssetInventoryRequest;
use App\Http\Resources\AssetInventory\AssetInventorySearchResource;
use App\Services\AssetInventorySearch;
use Illuminate\Http\JsonResponse;

class AssetInventorySearchController extends Controller
{
    public function __invoke(SearchAssetInventoryRequest $request, AssetInventorySearch $search): JsonResponse
    {
        return AssetInventorySearchResource::collection($search->paginate($request->validated()))
            ->response()->header('Cache-Control', 'private, no-store');
    }
}
