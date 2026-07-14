<?php

namespace App\Http\Controllers\API\Engagement;

use App\Http\Controllers\Controller;
use App\Models\Engagement\EngagementPostEvent;
use App\Models\Engagement\EngagementPostEventFile;
use App\Models\Engagement\EngagementPollOption;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class EngagementPostEventController extends Controller
{
    public function index(): JsonResponse
    {
        $userId = Auth::id();

        $posts = EngagementPostEvent::with([
            'user:id,name,avatar',
            'files',
            'pollOptions',
            'pollVotes',
        ])
            ->withCount(['reactions', 'comments'])
            ->withExists(['reactions as user_has_reacted' => fn($q) => $q->where('user_id', $userId)])
            ->where(function ($q) {
                // Published (immediate or scheduled-and-due) or legacy rows with no publish flag.
                $q->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            })
            ->latest()
            ->get()
            ->map(function ($post) use ($userId) {
                $user = $post->user;
                $name = $user?->name ?? 'Admin';
                $parts = explode(' ', trim($name));
                $initials = strtoupper(
                    mb_substr($parts[0] ?? '', 0, 1) .
                        mb_substr($parts[1] ?? '', 0, 1)
                );

                $isPoll     = $post->type === 'poll';
                $totalVotes = $isPoll ? $post->pollVotes->count() : 0;
                $userVote   = $isPoll ? $post->pollVotes->firstWhere('user_id', $userId) : null;

                return [
                    'id'                => $post->id,
                    'type'              => $post->type,
                    'title'             => $post->title,
                    'content'           => $post->content,
                    'category'          => $post->category,
                    'headline'          => $post->headline,
                    'message'           => $post->message,
                    'media_url'         => $post->media_path ? Storage::disk('s3')->url($post->media_path) : null,
                    'media_type'        => $post->media_type,
                    'month'             => $post->month,
                    'year'              => $post->year,
                    'publish_to'        => $post->publish_to,
                    'published_at'      => $post->published_at,
                    'files'             => $post->files->map(fn($f) => [
                        'id'   => $f->id,
                        'name' => $f->name,
                        'url'  => $f->url,
                    ])->values(),
                    // poll-specific
                    'options'           => $isPoll
                        ? $post->pollOptions->map(function ($opt) use ($post, $totalVotes) {
                            $voteCount = $post->pollVotes->where('engagement_poll_option_id', $opt->id)->count();
                            return [
                                'id'         => $opt->id,
                                'label'      => $opt->label,
                                'vote_count' => $voteCount,
                                'percentage' => $totalVotes > 0 ? round(($voteCount / $totalVotes) * 100) : 0,
                            ];
                        })->values()
                        : [],
                    'total_votes'       => $totalVotes,
                    'user_has_voted'    => $userVote !== null,
                    'user_voted_option' => $userVote?->engagement_poll_option_id,
                    'is_closed'         => $isPoll && $post->closed_at !== null,
                    // interaction
                    'reaction_count'    => $post->reactions_count,
                    'comment_count'     => $post->comments_count,
                    'user_has_reacted'  => (bool) $post->user_has_reacted,
                    'time_ago'          => ($post->published_at ?? $post->created_at)->diffForHumans(),
                    'created_at'        => $post->created_at,
                    'author'            => [
                        'name'     => $name,
                        'avatar'   => $user?->avatar,
                        'initials' => $initials,
                    ],
                ];
            });

        return response()->json([
            'status' => 'success',
            'data'   => $posts,
        ]);
    }

    public function upcoming_events(): JsonResponse
    {
        $events = EngagementPostEvent::whereNull('published_at')
            ->whereNotNull('scheduled_at')
            ->where('scheduled_at', '>', now())
            ->orderBy('scheduled_at', 'asc')
            ->get()
            ->map(function ($post) {
                $dt = $post->scheduled_at;
                return [
                    'id'           => $post->id,
                    'type'         => $post->type,
                    'headline'     => $post->headline ?? $post->title,
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

    public function create()
    {
        //
    }

    public function store(Request $request): JsonResponse
    {
        // Rich post types (general/birthday/poll) with optional media, scheduling & poll options.
        if ($request->filled('type')) {
            $validated = $request->validate([
                'type'         => 'required|string|in:birthday,general,poll',
                'category'     => 'nullable|string',
                'headline'     => 'required|string|max:255',
                'message'      => 'required|string',
                'month'        => 'nullable|string|max:20',
                'year'         => 'nullable|integer',
                'publish_to'   => 'required|string|in:All Employees,Department Only,Management',
                'scheduled_at' => 'nullable|date',
                'media'        => 'nullable|file|mimes:jpg,jpeg,png,gif,webp,mp4,mov,webm|max:51200',
                'options'      => 'required_if:type,poll|array|min:2',
                'options.*'    => 'required|string|max:255',
            ]);

            $mediaPath = null;
            $mediaType = null;
            if ($request->hasFile('media') && $request->file('media')->isValid()) {
                $file      = $request->file('media');
                $mediaType = str_starts_with($file->getMimeType(), 'video/') ? 'video' : 'photo';
                $mediaPath = $file->store('unified/engagement/media', 's3');
            }

            $post = EngagementPostEvent::create([
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

            if ($validated['type'] === 'poll' && !empty($validated['options'])) {
                foreach ($validated['options'] as $index => $label) {
                    EngagementPollOption::create([
                        'engagement_post_event_id' => $post->id,
                        'label'                    => trim($label),
                        'sort_order'               => $index,
                    ]);
                }
            }

            return response()->json([
                'status'  => 'success',
                'message' => 'Post published successfully.',
                'data'    => $post,
            ], 201);
        }

        // Simple title/content post with optional image gallery.
        $request->validate([
            'title'    => ['required', 'string', 'max:255'],
            'content'  => ['required', 'string'],
            'category' => ['required', 'in:Event,News,Milestone,Announcement'],
            'images'   => ['nullable', 'array'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,gif,webp', 'max:5120'],
        ]);

        $post = EngagementPostEvent::create([
            'title'        => $request->input('title'),
            'content'      => $request->input('content'),
            'category'     => $request->input('category'),
            'type'         => 'general',
            'user_id'      => Auth::id(),
            'published_at' => now(),
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                if ($image->isValid()) {
                    $path = $image->store('unified/engagement/posts', 's3');
                    $url  = Storage::disk('s3')->url($path);

                    EngagementPostEventFile::create([
                        'engagement_post_event_id' => $post->id,
                        'name'                     => $image->getClientOriginalName(),
                        'url'                      => $url,
                    ]);
                }
            }
        }

        $post->load(['user:id,name,avatar', 'files']);

        return response()->json([
            'status'  => 'success',
            'message' => 'Post created successfully.',
            'data'    => $post,
        ], 201);
    }

    public function show($id)
    {
        //
    }

    public function edit($id)
    {
        //
    }

    public function update(Request $request, $id): JsonResponse
    {
        // Fetch post explicitly by ID to bypass parameter binding mismatch
        $post = EngagementPostEvent::find($id);

        if (!$post) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Post not found.',
            ], 404);
        }

        $validated = $request->validate([
            'title'      => ['sometimes', 'string', 'max:255'],
            'content'    => ['sometimes', 'string'],
            'category'   => ['sometimes', 'string'],
            'headline'   => ['sometimes', 'string', 'max:255'],
            'message'    => ['sometimes', 'string'],
            'publish_to' => ['sometimes', 'string', 'in:All Employees,Department Only,Management'],
        ]);

        $post->update($validated);

        return response()->json([
            'status'  => 'success',
            'message' => 'Post updated successfully.',
            'data'    => $post->fresh(['user:id,name,avatar']),
        ]);
    }

    public function destroy($id): JsonResponse
    {

        $post = EngagementPostEvent::find($id);


        if (!$post) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Post not found.',
            ], 404);
        }


        if ($post->media_path) {
            Storage::disk('s3')->delete($post->media_path);
        }


        $post->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Post deleted successfully.',
        ]);
    }
}
