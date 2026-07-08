<?php

namespace App\Http\Controllers\API\Activities;

use App\Http\Controllers\Controller;
use App\Models\Activities\ActivityPollOption;
use App\Models\Activities\ActivityPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ActivityPostController extends Controller
{
   
    public function index(): JsonResponse
    {
        $posts = ActivityPost::with([
                'user:id,name,avatar',
                'pollOptions',
                'pollVotes',
                'reactions:id,activity_post_id,user_id,type',
                'comments:id,activity_post_id',
            ])
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

                $isPoll      = $post->type === 'poll';
                $totalVotes  = $isPoll ? $post->pollVotes->count() : 0;
                $userVote    = $isPoll
                    ? $post->pollVotes->firstWhere('user_id', Auth::id())
                    : null;

                return [
                    'id'                 => $post->id,
                    'type'               => $post->type,
                    'category'           => $post->category ?? 'General',
                    'headline'           => $post->headline,
                    'message'            => $post->message,
                    'media_url'          => $post->media_path
                        ? asset('storage/' . $post->media_path)
                        : null,
                    'media_type'         => $post->media_type,
                    'month'              => $post->month,
                    'year'               => $post->year,
                    'publish_to'         => $post->publish_to,
                    'published_at'       => $post->published_at,
                    'time_ago'           => $post->published_at?->diffForHumans(),
                    'author'             => [
                        'name'     => $name,
                        'avatar'   => $user?->avatar,
                        'initials' => $initials,
                    ],
                    // ── poll-specific fields ──────────────────────────────
                    'options'            => $isPoll
                        ? $post->pollOptions->map(function ($opt) use ($post, $totalVotes) {
                            $voteCount = $post->pollVotes
                                ->where('activity_poll_option_id', $opt->id)
                                ->count();
                            return [
                                'id'         => $opt->id,
                                'label'      => $opt->label,
                                'vote_count' => $voteCount,
                                'percentage' => $totalVotes > 0
                                    ? round(($voteCount / $totalVotes) * 100)
                                    : 0,
                            ];
                        })
                        : [],
                    'total_votes'        => $totalVotes,
                    'user_has_voted'     => $userVote !== null,
                    'user_voted_option'  => $userVote?->activity_poll_option_id,
                    'is_closed'          => $isPoll && $post->closed_at !== null,
                    // ── interaction counts ────────────────────────────────
                    'reaction_count'     => $post->reactions->count(),
                    'comment_count'      => $post->comments->count(),
                    'user_has_reacted'   => $post->reactions->contains('user_id', Auth::id()),
                ];
            });

        return response()->json([
            'status' => 'success',
            'data'   => $posts,
        ], 200);
    }

   
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

   
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type'         => 'required|string|in:birthday,general,poll',
            'category'     => 'nullable|string|in:Pinned Announcement,Events,News,Milestone,General',
            'headline'     => 'required|string|max:255',
            'message'      => 'required|string',
            'month'        => 'nullable|string|max:20',
            'year'         => 'nullable|integer',
            'publish_to'   => 'required|string|in:All Employees,Department Only,Management',
            'scheduled_at' => 'nullable|date',
            'media'        => 'nullable|file|mimes:jpg,jpeg,png,gif,webp,mp4,mov,webm|max:51200',
            // Poll-specific: options are required when type is poll.
            'options'      => 'required_if:type,poll|array|min:2',
            'options.*'    => 'required|string|max:255',
        ]);

        $mediaPath = null;
        $mediaType = null;

        if ($request->hasFile('media') && $request->file('media')->isValid()) {
            $file      = $request->file('media');
            $mime      = $file->getMimeType();
            $mediaType = str_starts_with($mime, 'video/') ? 'video' : 'photo';
            $mediaPath = $file->store('activities/media', 'public');
        }

        $post = ActivityPost::create([
            'user_id'      => Auth::id(),
            'type'         => $validated['type'],
            'category'     => $validated['category'] ?? 'General',
            'headline'     => $validated['headline'],
            'message'      => $validated['message'],
            'media_path'   => $mediaPath,
            'media_type'   => $mediaType,
            'month'        => $validated['month'] ?? null,
            'year'         => $validated['year'] ?? null,
            'publish_to'   => $validated['publish_to'],
            'scheduled_at' => $validated['scheduled_at'] ?? null,
            'published_at' => !empty($validated['scheduled_at']) ? null : now(),
        ]);

        // Persist poll options in a dedicated table (not as embedded HTML).
        if ($validated['type'] === 'poll' && !empty($validated['options'])) {
            foreach ($validated['options'] as $index => $label) {
                ActivityPollOption::create([
                    'activity_post_id' => $post->id,
                    'label'            => trim($label),
                    'sort_order'       => $index,
                ]);
            }
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'Post published successfully.',
        ], 201);
    }

    public function update(Request $request, ActivityPost $activityPost): JsonResponse
    {
        $validated = $request->validate([
            'headline'   => 'required|string|max:255',
            'message'    => 'required|string',
            'category'   => 'nullable|string|in:Pinned Announcement,Events,News,Milestone,General',
            'publish_to' => 'required|string|in:All Employees,Department Only,Management',
        ]);

        $activityPost->update($validated);

        return response()->json([
            'status'  => 'success',
            'message' => 'Post updated successfully.',
            'data'    => $activityPost,
        ], 200);
    }

   
    public function destroy(ActivityPost $activityPost): JsonResponse
    {
        // Delete associated media file from storage before removing the record.
        if ($activityPost->media_path) {
            Storage::disk('public')->delete($activityPost->media_path);
        }

        $activityPost->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Post deleted successfully.',
        ], 200);
    }
}
