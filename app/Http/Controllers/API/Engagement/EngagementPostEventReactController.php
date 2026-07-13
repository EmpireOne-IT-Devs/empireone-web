<?php
namespace App\Http\Controllers\API\Engagement;

use App\Http\Controllers\Controller;
use App\Models\Engagement\EngagementPostEvent;
use App\Models\Engagement\EngagementPostEventReact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EngagementPostEventReactController extends Controller
{
    public function toggle($id)
    {
        EngagementPostEvent::findOrFail($id);

        $existing = EngagementPostEventReact::where('engagement_post_event_id', $id)
            ->where('user_id', Auth::id())
            ->first();

        if ($existing) {
            $existing->delete();
            $userHasReacted = false;
        } else {
            EngagementPostEventReact::create([
                'engagement_post_event_id' => $id,
                'user_id'                  => Auth::id(),
                'react'                    => 'Heart',
            ]);
            $userHasReacted = true;
        }

        $reactionCount = EngagementPostEventReact::where('engagement_post_event_id', $id)->count();

        return response()->json([
            'status' => 'success',
            'data'   => [
                'reaction_count'   => $reactionCount,
                'user_has_reacted' => $userHasReacted,
            ],
        ]);
    }
}

