<?php

namespace App\Http\Controllers\API\Engagement;

use App\Http\Controllers\Controller;
use App\Models\Engagement\CompanyGallery;
use App\Models\Engagement\EngagementPostEventFile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Exception;

class EngagementCompanyGalleryController extends Controller
{
    public function index(): JsonResponse
    {
        $galleries = CompanyGallery::with(['files'])->latest()->get()->map(function ($gallery) {
            return [
                'id' => $gallery->id,
                'title' => $gallery->title,
                'description' => $gallery->description,
                'drive_link' => $gallery->drive_link,
                'created_by' => $gallery->created_by,
                'created_at' => $gallery->created_at,
                'updated_at' => $gallery->updated_at,
                'files' => $gallery->files->map(fn($file) => [
                    'id' => $file->id,
                    'name' => $file->name,
                    'url' => $file->url,
                ])->values(),
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $galleries,
        ]);
    }

    public function show($id): JsonResponse
    {
        $gallery = CompanyGallery::with(['files'])->find($id);

        if (!$gallery) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gallery not found.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'id' => $gallery->id,
                'title' => $gallery->title,
                'description' => $gallery->description,
                'drive_link' => $gallery->drive_link,
                'created_by' => $gallery->created_by,
                'created_at' => $gallery->created_at,
                'updated_at' => $gallery->updated_at,
                'files' => $gallery->files->map(fn($file) => [
                    'id' => $file->id,
                    'name' => $file->name,
                    'url' => $file->url,
                ])->values(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'driveLink' => ['nullable', 'url', 'max:1000'],
            'images' => ['required', 'array', 'min:1'],
            'images.*' => ['required', 'image', 'mimes:jpg,jpeg,png,gif,webp,svg', 'max:5120'],
        ]);

        DB::beginTransaction();

        try {
            $gallery = CompanyGallery::create([
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'drive_link' => $validated['driveLink'] ?? null,
                'created_by' => Auth::id(),
            ]);

            $uploadedFiles = [];

            foreach ($request->file('images') as $image) {
                if (!$image->isValid()) {
                    continue;
                }

                $path = $image->store('unified/engagement/company_galleries', 's3');
                $url = Storage::disk('s3')->url($path);

                $record = EngagementPostEventFile::create([
                    'company_gallery_id' => $gallery->id,
                    'engagement_post_event_id' => null,
                    'name' => $image->getClientOriginalName(),
                    'url' => $url,
                ]);

                $uploadedFiles[] = [
                    'id' => $record->id,
                    'name' => $record->name,
                    'url' => $record->url,
                ];
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Company gallery created successfully.',
                'data' => [
                    'id' => $gallery->id,
                    'title' => $gallery->title,
                    'description' => $gallery->description,
                    'drive_link' => $gallery->drive_link,
                    'created_by' => $gallery->created_by,
                    'created_at' => $gallery->created_at,
                    'files' => $uploadedFiles,
                ],
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();

            foreach ($uploadedFiles as $file) {
                $relativePath = str_replace(Storage::disk('s3')->url(''), '', $file['url']);
                Storage::disk('s3')->delete($relativePath);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Gallery upload failed. ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        $gallery = CompanyGallery::find($id);
        if (!$gallery) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gallery not found.',
            ], 404);
        }

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'driveLink' => ['nullable', 'url', 'max:1000'],
        ]);

        $gallery->update([
            'title' => $validated['title'] ?? $gallery->title,
            'description' => array_key_exists('description', $validated) ? $validated['description'] : $gallery->description,
            'drive_link' => $validated['driveLink'] ?? $gallery->drive_link,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Gallery updated successfully.',
            'data' => $gallery->load('files'),
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $gallery = CompanyGallery::find($id);
        if (!$gallery) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gallery not found.',
            ], 404);
        }

        $gallery->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Gallery deleted successfully.',
        ]);
    }

    public function destroyFile($id): JsonResponse
    {
        $file = EngagementPostEventFile::find($id);
        if (!$file) {
            return response()->json([
                'status' => 'error',
                'message' => 'File not found.',
            ], 404);
        }

        try {
            $s3UrlPrefix = Storage::disk('s3')->url('');
            $relativeKey = str_replace($s3UrlPrefix, '', $file->url);
            if (str_starts_with($relativeKey, '/')) {
                $relativeKey = ltrim($relativeKey, '/');
            }

            if (Storage::disk('s3')->exists($relativeKey)) {
                Storage::disk('s3')->delete($relativeKey);
            }

            $file->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'File deleted successfully.',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete file. ' . $e->getMessage(),
            ], 500);
        }
    }
}
