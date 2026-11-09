<?php

namespace App\Http\Controllers\API\AssetInventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\AssetInventory\ImportAssetDevicesRequest;
use App\Http\Requests\AssetInventory\StoreAssetDeviceRequest;
use App\Http\Resources\AssetInventory\AssetDeviceResource;
use App\Models\AssetInventory\AssetDevice;
use App\Services\AssetDeviceImportService;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;

class AssetDeviceController extends Controller
{
    public function get_all(Request $request)
    {
        Gate::authorize('viewAny', AssetDevice::class);

        $query = AssetDevice::query()->latest();

        if ($search = trim((string) $request->query('search', ''))) {
            $query->where(function ($q) use ($search) {
                $q->where('asset_tag', 'like', "%{$search}%")
                    ->orWhere('serial_number', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%")
                    ->orWhere('model', 'like', "%{$search}%")
                    ->orWhere('device_type', 'like', "%{$search}%")
                    ->orWhere('issued_to', 'like', "%{$search}%");
            });
        }

        foreach (['status', 'device_type', 'availability', 'condition'] as $filter) {
            if ($value = $request->query($filter)) {
                $query->where($filter, $value);
            }
        }

        $stats = [
            'total' => AssetDevice::count(),
            'working' => AssetDevice::where('status', 'Working')->count(),
            'needs_attention' => AssetDevice::whereIn('status', ['Defective', 'For Repair'])->count(),
            'laptops' => AssetDevice::where('device_type', 'Laptop')->count(),
            'desktops' => AssetDevice::where('device_type', 'Desktop')->count(),
            'mobile' => AssetDevice::whereIn('device_type', ['Mobile', 'Tablet'])->count(),
        ];

        $perPage = min((int) $request->query('per_page', 10), 100);
        $devices = $query->paginate($perPage)->appends($request->query());

        return AssetDeviceResource::collection($devices)->additional([
            'stats' => $stats,
        ]);
    }

    public function create_device(StoreAssetDeviceRequest $request)
    {
        Gate::authorize('create', AssetDevice::class);

        $device = AssetDevice::create($request->validated());

        return (new AssetDeviceResource($device))
            ->response()
            ->setStatusCode(201);
    }

    public function get_device(AssetDevice $assetDevice)
    {
        Gate::authorize('view', $assetDevice);

        return new AssetDeviceResource($assetDevice);
    }

    public function update_device(StoreAssetDeviceRequest $request, AssetDevice $assetDevice)
    {
        Gate::authorize('update', $assetDevice);

        $assetDevice->update($request->validated());

        return new AssetDeviceResource($assetDevice->fresh());
    }

    public function delete_device(AssetDevice $assetDevice)
    {
        Gate::authorize('delete', $assetDevice);

        $assetDevice->delete();

        return response()->json(null, 204);
    }

    public function import_devices(ImportAssetDevicesRequest $request, AssetDeviceImportService $service)
    {
        Gate::authorize('import', AssetDevice::class);

        $result = $service->import($request->validated('rows'));

        return response()->json($result, 200);
    }
}
