<?php

namespace App\Http\Controllers\API\Activities;

use App\Http\Controllers\Controller;
use App\Models\Activities\ActivityPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ActivityPostController extends Controller
{
    /**
     * GET /api/activities/posts
     *
     * Returns all published posts, newest first.
     * Scheduled posts (published_at = null) are excluded until their time arrives.
     */
    public function index(): JsonResponse
    {
        $posts = ActivityPost::with('user:id,name,avatar')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->orderBy('published_at', 'desc')
            ->get()
            ->map(function ($post) {
                $user  = $post->user;
                $name  = $user?->name ?? 'Admin';
                $parts = explode(' ', trim($name));

                $initials = strtoupper(
                    mb_substr($parts[0] ?? '', 0, 1) .
                    mb_substr($parts[1] ?? '', 0, 1)
                );

                return [
                    'id'           => $post->id,
                    'type'         => $post->type,
                    'headline'     => $post->headline,
                    'message'      => $post->message,
                    'month'        => $post->month,
                    'year'         => $post->year,
                    'publish_to'   => $post->publish_to,
                    'published_at' => $post->published_at,
                    'time_ago'     => $post->published_at?->diffForHumans(),
                    'author'       => [
                        'name'     => $name,
                        'avatar'   => $user?->avatar,
                        'initials' => $initials,
                    ],
                ];
            });

        return response()->json([
            'status' => 'success',
            'data'   => $posts,
        ], 200);
    }

    /**
     * GET /api/activities/upcoming_events
     *
     * Returns scheduled (not yet published) activity posts ordered by scheduled_at.
     * These appear in the Upcoming Events sidebar.
     */
    public function upcoming_events(): JsonResponse
    {
        $events = ActivityPost::whereNull('published_at')
            ->whereNotNull('scheduled_at')
            ->where('scheduled_at', '>', now())
            ->orderBy('scheduled_at', 'asc')
            ->get()
            ->map(function ($post) {
                $dt = $post->scheduled_at;
                return [
                    'id'           => $post->id,
                    'type'         => $post->type,
                    'headline'     => $post->headline,
                    'month'        => $dt->format('M'),
                    'day'          => $dt->day,
                    'time'         => $dt->format('g:i A'),
                    'publish_to'   => $post->publish_to,
                    'month_name'   => $post->month,
                    'year'         => $post->year,
                    'scheduled_at' => $dt->toDateTimeString(),
                ];
            });

        return response()->json([
            'status' => 'success',
            'data'   => $events,
        ]);
    }

    /**
     * POST /api/activities/posts
     *
     * Publish a birthday (or general) activity post.
     * If scheduled_at is provided, published_at is kept null until that time.
     * If no schedule, published_at = now() so it appears in the feed immediately.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type'         => 'required|string|in:birthday,general',
            'headline'     => 'required|string|max:255',
            'message'      => 'required|string',
            'month'        => 'nullable|string|max:20',
            'year'         => 'nullable|integer',
            'publish_to'   => 'required|string|in:All Employees,Department Only,Management',
            'scheduled_at' => 'nullable|date',
        ]);

        ActivityPost::create([
            ...$validated,
            'user_id'      => Auth::id(),
            'published_at' => $validated['scheduled_at'] ? null : now(),
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Post published successfully.',
        ], 201);
    }

    /**
     * PUT /api/activities/posts/{activityPost}
     */
    public function update(Request $request, ActivityPost $activityPost): JsonResponse
    {
        $validated = $request->validate([
            'headline'   => 'required|string|max:255',
            'message'    => 'required|string',
            'publish_to' => 'required|string|in:All Employees,Department Only,Management',
        ]);

        $activityPost->update($validated);

        return response()->json([
            'status'  => 'success',
            'message' => 'Post updated successfully.',
            'data'    => $activityPost,
        ], 200);
    }

    /**
     * DELETE /api/activities/posts/{activityPost}
     */
    public function destroy(ActivityPost $activityPost): JsonResponse
    {
        $activityPost->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Post deleted successfully.',
        ], 200);
    }
}
