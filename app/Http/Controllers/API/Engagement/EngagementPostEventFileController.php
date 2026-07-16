<?php

namespace App\Http\Controllers\API\Engagement;

use App\Http\Controllers\Controller;
use App\Models\Engagement\EngagementPostEvent;
use App\Models\Engagement\EngagementPostEventFile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Exception;

class EngagementPostEventFileController extends Controller
{
    /**
     * Store multiple image files into S3 and link them to an Event Post.
     * POST /api/engagement/post_events/upload-gallery
     */
    public function store(Request $request): JsonResponse
    {
        // 1. Validation
        $validated = $request->validate([
            'title'      => ['required', 'string', 'max:255'],
            'event'      => ['required', 'integer', 'exists:engagement_post_events,id'],
            'driveLink'  => ['nullable', 'url', 'max:1000'],
            'images'     => ['required', 'array', 'min:1'],
            'images.*'   => ['required', 'image', 'mimes:jpg,jpeg,png,gif,webp,svg', 'max:5120'], // Max 5MB per file
        ]);

        $eventId = $validated['event'];
        $event = EngagementPostEvent::findOrFail($eventId);
        $uploadedFiles = [];

        // 2. Transaction Wrapper to protect S3/DB sync anomalies
        DB::beginTransaction();

        try {
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    if ($image->isValid()) {
                        // Store in AWS S3 or compatible storage engine
                        $path = $image->store('unified/engagement/galleries', 's3');
                        $url  = Storage::disk('s3')->url($path);

                        // Database record entry
                        $fileRecord = EngagementPostEventFile::create([
                            'engagement_post_event_id' => $event->id,
                            'name'                     => $image->getClientOriginalName(),
                            'url'                      => $url,
                        ]);

                        $uploadedFiles[] = [
                            'id'   => $fileRecord->id,
                            'name' => $fileRecord->name,
                            'url'  => $fileRecord->url,
                        ];
                    }
                }
            }

            // Sync the folder link if one was supplied
            if (!empty($validated['driveLink'])) {
                $event->update([
                    'drive_link' => $validated['driveLink']
                ]);
            }

            DB::commit();

            return response()->json([
                'status'  => 'success',
                'message' => 'Gallery images uploaded and linked successfully.',
                'data'    => [
                    'event_id'   => $event->id,
                    'title'      => $validated['title'],
                    'drive_link' => $event->drive_link,
                    'files'      => $uploadedFiles,
                ]
            ], 201);

        } catch (Exception $e) {
            DB::rollBack();

            // Cleanup any files successfully pushed to S3 during this failed batch attempt
            foreach ($uploadedFiles as $file) {
                $relativeS3Path = str_replace(Storage::disk('s3')->url(''), '', $file['url']);
                Storage::disk('s3')->delete($relativeS3Path);
            }

            return response()->json([
                'status'  => 'error',
                'message' => 'Upload batch execution failed. ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove a single image from the event gallery.
     * DELETE /api/engagement/post_events/files/{id}
     */
    public function destroy($id): JsonResponse
    {
        $file = EngagementPostEventFile::find($id);

        if (!$file) {
            return response()->json([
                'status'  => 'error',
                'message' => 'File not found.',
            ], 404);
        }

        try {
            // Deduce the clean storage key path from S3 public URL
            $s3UrlPrefix = Storage::disk('s3')->url('');
            $relativeKey = str_replace($s3UrlPrefix . '/', '', $file->url);

            if (Storage::disk('s3')->exists($relativeKey)) {
                Storage::disk('s3')->delete($relativeKey);
            }

            $file->delete();

            return response()->json([
                'status'  => 'success',
                'message' => 'File deleted successfully.',
            ]);

        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Failed to remove file asset. ' . $e->getMessage(),
            ], 500);
        }
    }
}