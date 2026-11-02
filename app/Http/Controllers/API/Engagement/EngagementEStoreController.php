<?php

namespace App\Http\Controllers\API\Engagement;

use App\Http\Controllers\Controller;
use App\Http\Requests\Engagement\AdjustEStoreStockRequest;
use App\Models\Engagement\EngagementEStore;
use App\Models\Engagement\EngagementPostEventFile;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
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
            ->when($request->user()->role !== User::ROLE_ADMIN, fn ($query) => $query->active())
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
            'is_active' => ['sometimes', 'boolean'],
            'is_unlimited_stock' => ['sometimes', 'boolean'],
        ]);

        $isUnlimited = array_key_exists('is_unlimited_stock', $validated)
            ? (bool) $validated['is_unlimited_stock']
            : ! isset($validated['quantity']);

        $item = EngagementEStore::create([
            'product_name' => $validated['product_name'],
            'customer_description' => $validated['customer_description'] ?? null,
            'reward_type' => $validated['reward_type'],
            'point_cost' => $validated['point_cost'],
            'quantity' => $isUnlimited ? null : ($validated['quantity'] ?? null),
            'is_active' => $validated['is_active'] ?? true,
            'is_unlimited_stock' => $isUnlimited,
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
            'is_active' => ['sometimes', 'boolean'],
            'is_unlimited_stock' => ['sometimes', 'boolean'],
        ]);

        $isUnlimited = array_key_exists('is_unlimited_stock', $validated)
            ? (bool) $validated['is_unlimited_stock']
            : $engagementEStore->is_unlimited_stock;

        $quantity = array_key_exists('quantity', $validated)
            ? $validated['quantity']
            : $engagementEStore->quantity;

        if ($isUnlimited) {
            $quantity = null;
        } elseif ($quantity === null) {
            // Switching from unlimited to limited without a quantity must not
            // fall back to the legacy "NULL means unlimited" convention.
            $quantity = 0;
        }

        $engagementEStore->update([
            'product_name' => $validated['product_name'] ?? $engagementEStore->product_name,
            'customer_description' => array_key_exists('customer_description', $validated)
                ? $validated['customer_description']
                : $engagementEStore->customer_description,
            'reward_type' => $validated['reward_type'] ?? $engagementEStore->reward_type,
            'point_cost' => $validated['point_cost'] ?? $engagementEStore->point_cost,
            'quantity' => $quantity,
            'is_active' => $validated['is_active'] ?? $engagementEStore->is_active,
            'is_unlimited_stock' => $isUnlimited,
            'updated_by' => auth()->id(),
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

    public function stock(Request $request): JsonResponse
    {
        Gate::authorize('viewAnyAdmin', \App\Models\Engagement\EngagementEStoreRedemption::class);

        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'reward_type' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'string', 'in:in_stock,low_stock,out_of_stock,unlimited'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $search = trim((string) ($validated['search'] ?? ''));
        $rewardType = $validated['reward_type'] ?? null;
        $status = $validated['status'] ?? null;
        $lowThreshold = 5;

        $query = EngagementEStore::query()
            ->with('files:id,engagement_e_store_id,name,url')
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($inner) use ($search) {
                    $inner->where('product_name', 'like', "%{$search}%")
                        ->orWhere('customer_description', 'like', "%{$search}%")
                        ->orWhere('reward_type', 'like', "%{$search}%");
                });
            })
            ->when($rewardType, fn ($q, $value) => $q->where('reward_type', $value))
            ->when($status === 'unlimited', fn ($q) => $q->where('is_unlimited_stock', true))
            ->when($status === 'in_stock', fn ($q) => $q->where('is_unlimited_stock', false)->where('quantity', '>', $lowThreshold))
            ->when($status === 'low_stock', fn ($q) => $q->where('is_unlimited_stock', false)->whereBetween('quantity', [1, $lowThreshold]))
            ->when($status === 'out_of_stock', fn ($q) => $q->where('is_unlimited_stock', false)->where('quantity', '<=', 0))
            ->latest();

        $items = $query->paginate($validated['per_page'] ?? 15);

        $all = EngagementEStore::query()->get(['quantity', 'is_unlimited_stock']);
        $stats = [
            'total_rewards' => $all->count(),
            'needs_attention' => $all->filter(fn ($i) => ! $i->is_unlimited_stock && (int) $i->quantity <= $lowThreshold)->count(),
            'total_units' => $all->filter(fn ($i) => ! $i->is_unlimited_stock)->sum(fn ($i) => (int) $i->quantity),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $items->items(),
            'meta' => [
                'current_page' => $items->currentPage(),
                'last_page' => $items->lastPage(),
                'per_page' => $items->perPage(),
                'total' => $items->total(),
            ],
            'stats' => $stats,
        ]);
    }

    public function adjustStock(AdjustEStoreStockRequest $request, EngagementEStore $engagementEStore): JsonResponse
    {
        Gate::authorize('viewAnyAdmin', \App\Models\Engagement\EngagementEStoreRedemption::class);

        $validated = $request->validated();

        $item = DB::transaction(function () use ($engagementEStore, $validated) {
            $locked = EngagementEStore::query()->whereKey($engagementEStore->id)->lockForUpdate()->firstOrFail();

            $makeUnlimited = array_key_exists('is_unlimited_stock', $validated)
                ? (bool) $validated['is_unlimited_stock']
                : $locked->is_unlimited_stock;

            if ($makeUnlimited) {
                $locked->is_unlimited_stock = true;
                $locked->quantity = null;
            } else {
                $current = (int) ($locked->quantity ?? 0);
                $quantity = (int) $validated['quantity'];

                $newQuantity = match ($validated['action']) {
                    'set' => $quantity,
                    'add' => $current + $quantity,
                    'subtract' => $current - $quantity,
                };

                abort_unless($newQuantity >= 0, 422, 'Stock cannot go below zero.');

                $locked->is_unlimited_stock = false;
                $locked->quantity = $newQuantity;
            }

            $locked->updated_by = auth()->id();
            $locked->save();

            return $locked->fresh('files:id,engagement_e_store_id,name,url');
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Stock updated successfully.',
            'data' => $item,
        ]);
    }
}
