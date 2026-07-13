<?php
namespace App\Http\Controllers\API\Engagement;

use App\Http\Controllers\Controller;
use App\Models\Engagement\EngagementPostEvent;
use App\Models\Engagement\EngagementPostEventComment;
use App\Models\Engagement\EngagementPostEventReact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EngagementPostEventCommentController extends Controller
{
    public function index($id)
    {
        EngagementPostEvent::findOrFail($id);

        $comments = EngagementPostEventComment::with('user:id,name,avatar')
            ->where('engagement_post_event_id', $id)
            ->latest()
            ->get()
            ->map(function ($comment) {
                $user  = $comment->user;
                $name  = $user?->name ?? 'Unknown';
                $parts = explode(' ', trim($name));
                $initials = strtoupper(
                    mb_substr($parts[0] ?? '', 0, 1) .
                    mb_substr($parts[1] ?? '', 0, 1)
                );
                return [
                    'id'       => $comment->id,
                    'user_id'  => $comment->user_id,
                    'body'     => $comment->comment,
                    'time_ago' => $comment->created_at->diffForHumans(),
                    'author'   => [
                        'name'     => $name,
                        'initials' => $initials,
                        'avatar'   => $user?->avatar,
                    ],
                ];
            });

        $reactionCount = EngagementPostEventReact::where('engagement_post_event_id', $id)->count();
        $userHasReacted = EngagementPostEventReact::where('engagement_post_event_id', $id)
            ->where('user_id', Auth::id())
            ->exists();

        return response()->json([
            'data'             => $comments,
            'reaction_count'   => $reactionCount,
            'user_has_reacted' => $userHasReacted,
        ]);
    }

    public function store(Request $request, $id)
    {
        $request->validate(['body' => ['required', 'string', 'max:1000']]);

        EngagementPostEvent::findOrFail($id);

        $comment = EngagementPostEventComment::create([
            'engagement_post_event_id' => $id,
            'user_id'                  => Auth::id(),
            'comment'                  => $request->body,
        ]);

        $comment->load('user:id,name,avatar');
        $user     = $comment->user;
        $name     = $user?->name ?? 'Unknown';
        $parts    = explode(' ', trim($name));
        $initials = strtoupper(
            mb_substr($parts[0] ?? '', 0, 1) .
            mb_substr($parts[1] ?? '', 0, 1)
        );

        return response()->json([
            'status' => 'success',
            'data'   => [
                'id'       => $comment->id,
                'user_id'  => $comment->user_id,
                'body'     => $comment->comment,
                'time_ago' => $comment->created_at->diffForHumans(),
                'author'   => [
                    'name'     => $name,
                    'initials' => $initials,
                    'avatar'   => $user?->avatar,
                ],
            ],
        ], 201);
    }

    public function destroy($id, $commentId)
    {
        $comment = EngagementPostEventComment::where('engagement_post_event_id', $id)
            ->where('id', $commentId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $comment->delete();

        return response()->json(['status' => 'success']);
    }
}

