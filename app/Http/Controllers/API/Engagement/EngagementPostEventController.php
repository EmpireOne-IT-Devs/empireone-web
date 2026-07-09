<?php

namespace App\Http\Controllers\API\Engagement;

use App\Http\Controllers\Controller;

use App\Models\Engagement\EngagementPostEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EngagementPostEventController extends Controller
{

    public function index(): JsonResponse
    {
        $posts = EngagementPostEvent::with(['user:id,name,avatar'])
            ->latest()
            ->get()
            ->map(function ($post) {
                $user = $post->user;
                $name = $user?->name ?? 'Admin';
                $parts = explode(' ', trim($name));
                $initials = strtoupper(
                    mb_substr($parts[0] ?? '', 0, 1) .
                        mb_substr($parts[1] ?? '', 0, 1)
                );

                return [
                    'id'         => $post->id,
                    'title'      => $post->title,
                    'content'    => $post->content,
                    'category'   => $post->category,
                    'time_ago'   => $post->created_at->diffForHumans(),
                    'created_at' => $post->created_at,
                    'author'     => [
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


    public function create()
    {
        //
    }


    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'    => ['required', 'string', 'max:255'],
            'content'  => ['required', 'string'],
            'category' => ['required', 'in:Event,News,Milestone,Announcement'],
        ]);

        $post = EngagementPostEvent::create([
            ...$validated,
            'user_id' => Auth::id(),
        ]);

        $post->load('user:id,name,avatar');

        return response()->json([
            'status'  => 'success',
            'message' => 'Post created successfully.',
            'data'    => $post,
        ], 201);
    }


    public function show(EngagementPostEvent $engagementPostEvent)
    {
        //
    }


    public function edit(EngagementPostEvent $engagementPostEvent)
    {
        //
    }


    public function update(Request $request, EngagementPostEvent $engagementPostEvent): JsonResponse
    {
        $validated = $request->validate([
            'title'    => ['sometimes', 'string', 'max:255'],
            'content'  => ['sometimes', 'string'],
            'category' => ['sometimes', 'in:Event,News,Milestone,Announcement'],
        ]);

        $engagementPostEvent->update($validated);

        return response()->json([
            'status'  => 'success',
            'message' => 'Post updated successfully.',
            'data'    => $engagementPostEvent->fresh(['user:id,name,avatar']),
        ]);
    }


    public function destroy(EngagementPostEvent $engagementPostEvent): JsonResponse
    {
        $engagementPostEvent->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Post deleted successfully.',
        ]);
    }
}
