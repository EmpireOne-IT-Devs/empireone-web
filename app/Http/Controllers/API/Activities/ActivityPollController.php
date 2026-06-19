<?php

namespace App\Http\Controllers\API\Activities;

use App\Http\Controllers\Controller;
use App\Models\Activities\ActivityPollOption;
use App\Models\Activities\ActivityPollVote;
use App\Models\Activities\ActivityPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ActivityPollController extends Controller
{
    /**
     * Cast a vote on a poll post.
     * One vote per user per poll — enforced at DB and application level.
     */
    public function vote(Request $request, ActivityPost $activityPost): JsonResponse
    {
        if ($activityPost->type !== 'poll') {
            return response()->json([
                'status'  => 'error',
                'message' => 'This post is not a poll.',
            ], 422);
        }

        $validated = $request->validate([
            'option_id' => 'required|integer|exists:activity_poll_options,id',
        ]);

        // Verify the option belongs to this specific poll.
        $option = ActivityPollOption::where('id', $validated['option_id'])
            ->where('activity_post_id', $activityPost->id)
            ->firstOrFail();

        // Prevent duplicate votes.
        $alreadyVoted = ActivityPollVote::where('activity_post_id', $activityPost->id)
            ->where('user_id', Auth::id())
            ->exists();

        if ($alreadyVoted) {
            return response()->json([
                'status'  => 'error',
                'message' => 'You have already voted on this poll.',
            ], 422);
        }

        ActivityPollVote::create([
            'activity_post_id'        => $activityPost->id,
            'activity_poll_option_id' => $option->id,
            'user_id'                 => Auth::id(),
        ]);

        // Return fresh poll state so the frontend can update immediately.
        $activityPost->load('pollOptions', 'pollVotes');

        $totalVotes      = $activityPost->pollVotes->count();
        $userVotedOption = $activityPost->pollVotes
            ->firstWhere('user_id', Auth::id())
            ?->activity_poll_option_id;

        return response()->json([
            'status'  => 'success',
            'message' => 'Vote cast successfully.',
            'data'    => [
                'total_votes'        => $totalVotes,
                'user_has_voted'     => true,
                'user_voted_option'  => $userVotedOption,
                'options'            => $activityPost->pollOptions->map(function ($opt) use ($activityPost, $totalVotes) {
                    $voteCount = $activityPost->pollVotes
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
                }),
            ],
        ], 201);
    }
}
