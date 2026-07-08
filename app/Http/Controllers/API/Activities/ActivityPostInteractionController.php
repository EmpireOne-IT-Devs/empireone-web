<?php

namespace App\Http\Controllers\API\Activities;

use App\Http\Controllers\Controller;
use App\Models\Activities\ActivityPost;
use App\Models\Activities\ActivityPostComment;
use App\Models\Activities\ActivityPostReaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ActivityPostInteractionController extends Controller
{
    /**
     * Toggle a reaction (heart) on a post.
     * Returns updated reaction_count and user_has_reacted state.
     */
    public function toggle_reaction(Request $request, int $postId): JsonResponse
    {
        $request->validate(['type' => 'nullable|string|in:heart']);

        // Ensure the post exists before doing anything — returns 404 if not.
        ActivityPost::findOrFail($postId);

        $type = $request->input('type', 'heart');

        $existing = ActivityPostReaction::where([
            'activity_post_id' => $postId,
            'user_id'          => Auth::id(),
            'type'             => $type,
        ])->first();

        if ($existing) {
            $existing->delete();
            $reacted = false;
        } else {
            ActivityPostReaction::create([
                'activity_post_id' => $postId,
                'user_id'          => Auth::id(),
                'type'             => $type,
            ]);
            $reacted = true;
        }

        $count = ActivityPostReaction::where('activity_post_id', $postId)
            ->where('type', $type)
            ->count();

        return response()->json([
            'status' => 'success',
            'data'   => [
                'reaction_count'  => $count,
                'user_has_reacted' => $reacted,
            ],
        ]);
    }

    /**
     * Fetch all comments for a post along with the latest reaction state.
     * Used for initial load and polling (every 15 s on the frontend).
     */
    public function get_comments(int $postId): JsonResponse
    {
        $post = ActivityPost::with(['reactions:id,activity_post_id,user_id,type'])
            ->findOrFail($postId);

        $comments = ActivityPostComment::with('user:id,name,avatar')
            ->where('activity_post_id', $postId)
            ->latest()
            ->get()
            ->map(fn($c) => $this->formatComment($c));

        return response()->json([
            'status'           => 'success',
            'data'             => $comments,
            'reaction_count'   => $post->reactions->count(),
            'user_has_reacted' => $post->reactions->contains('user_id', Auth::id()),
        ]);
    }

    /**
     * Add a new comment to a post.
     */
    public function add_comment(Request $request, int $postId): JsonResponse
    {
        ActivityPost::findOrFail($postId); // 404 guard

        $validated = $request->validate([
            'body' => 'required|string|max:1000',
        ]);

        $comment = ActivityPostComment::create([
            'activity_post_id' => $postId,
            'user_id'          => Auth::id(),
            'body'             => $validated['body'],
        ]);

        $comment->load('user:id,name,avatar');

        return response()->json([
            'status' => 'success',
            'data'   => $this->formatComment($comment),
        ], 201);
    }

    /**
     * Delete a comment — only the comment owner may delete their own comment.
     */
    public function delete_comment(int $postId, int $commentId): JsonResponse
    {
        $comment = ActivityPostComment::where('id', $commentId)
            ->where('activity_post_id', $postId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $comment->delete();

        return response()->json(['status' => 'success']);
    }

    private function formatComment(ActivityPostComment $comment): array
    {
        $name   = $comment->user?->name ?? 'Unknown';
        $parts  = explode(' ', trim($name));
        $initials = strtoupper(
            mb_substr($parts[0] ?? '', 0, 1) .
            mb_substr($parts[1] ?? '', 0, 1)
        );

        return [
            'id'         => $comment->id,
            'body'       => $comment->body,
            'time_ago'   => $comment->created_at->diffForHumans(),
            'created_at' => $comment->created_at,
            'user_id'    => $comment->user_id,
            'author'     => [
                'name'     => $name,
                'avatar'   => $comment->user?->avatar,
                'initials' => $initials,
            ],
        ];
    }
}
