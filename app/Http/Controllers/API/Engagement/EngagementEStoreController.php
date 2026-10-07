<?php

namespace App\Http\Controllers\API\Engagement;

use App\Http\Controllers\Controller;
use App\Models\Engagement\EngagementEStore;
use App\Models\Engagement\EngagementPostEventFile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EngagementEStoreController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'reward_type' => ['nullable', 'string', 'max:100'],
        ]);

        $search = trim((string) ($validated['search'] ?? ''));
        $rewardType = $validated['reward_type'] ?? null;

        $items = EngagementEStore::query()
            ->with('files:id,engagement_e_store_id,name,url')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('product_name', 'like', "%{$search}%")
                        ->orWhere('customer_description', 'like', "%{$search}%")
                        ->orWhere('reward_type', 'like', "%{$search}%");
                });
            })
            ->when($rewardType, fn ($query, $value) => $query->where('reward_type', $value))
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $items,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'product_name' => ['required', 'string', 'max:255'],
            'customer_description' => ['nullable', 'string', 'max:5000'],
            'reward_type' => ['required', 'string', 'max:100'],
            'point_cost' => ['required', 'integer', 'min:0'],
            'quantity' => ['nullable', 'integer', 'min:0'],
        ]);

        $item = EngagementEStore::create([
            'product_name' => $validated['product_name'],
            'customer_description' => $validated['customer_description'] ?? null,
            'reward_type' => $validated['reward_type'],
            'point_cost' => $validated['point_cost'],
            'quantity' => $validated['quantity'] ?? null,
            'created_by' => auth()->id(),
        ]);

        if ($request->hasFile('product_image') && $request->file('product_image')->isValid()) {
            $image = $request->file('product_image');
            $path = $image->store('unified/engagement/e_store', 's3');
            $url = Storage::disk('s3')->url($path);

            EngagementPostEventFile::create([
                'engagement_e_store_id' => $item->id,
                'name' => $image->getClientOriginalName(),
                'url' => $url,
            ]);

            $item->product_image = $url;
            $item->save();
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Reward item created successfully.',
            'data' => $item->load('files:id,engagement_e_store_id,name,url'),
        ], 201);
    }

    public function show(EngagementEStore $engagementEStore): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $engagementEStore->load('files:id,engagement_e_store_id,name,url'),
        ]);
    }

    public function update(Request $request, EngagementEStore $engagementEStore): JsonResponse
    {
        $validated = $request->validate([
            'product_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'product_name' => ['sometimes', 'string', 'max:255'],
            'customer_description' => ['nullable', 'string', 'max:5000'],
            'reward_type' => ['sometimes', 'string', 'max:100'],
            'point_cost' => ['sometimes', 'integer', 'min:0'],
            'quantity' => ['nullable', 'integer', 'min:0'],
        ]);

        $engagementEStore->update([
            'product_name' => $validated['product_name'] ?? $engagementEStore->product_name,
            'customer_description' => array_key_exists('customer_description', $validated)
                ? $validated['customer_description']
                : $engagementEStore->customer_description,
            'reward_type' => $validated['reward_type'] ?? $engagementEStore->reward_type,
            'point_cost' => $validated['point_cost'] ?? $engagementEStore->point_cost,
            'quantity' => array_key_exists('quantity', $validated)
                ? $validated['quantity']
                : $engagementEStore->quantity,
        ]);

        if ($request->hasFile('product_image') && $request->file('product_image')->isValid()) {
            $image = $request->file('product_image');
            $path = $image->store('unified/engagement/e_store', 's3');
            $url = Storage::disk('s3')->url($path);

            EngagementPostEventFile::create([
                'engagement_e_store_id' => $engagementEStore->id,
                'name' => $image->getClientOriginalName(),
                'url' => $url,
            ]);

            $engagementEStore->product_image = $url;
            $engagementEStore->save();
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Reward item updated successfully.',
            'data' => $engagementEStore->fresh()->load('files:id,engagement_e_store_id,name,url'),
        ]);
    }

    public function destroy(EngagementEStore $engagementEStore): JsonResponse
    {
        $engagementEStore->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Reward item deleted successfully.',
        ]);
    }
}
