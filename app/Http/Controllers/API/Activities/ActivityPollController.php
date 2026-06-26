<?php

namespace App\Http\Controllers\API\Activities;

use App\Http\Controllers\Controller;
use App\Models\Activities\ActivityPollOption;
use App\Models\Activities\ActivityPollVote;
use App\Models\Activities\ActivityPost;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ActivityPollController extends Controller
{
    public function index()
    {
        $polls = ActivityPost::where('type', 'poll')
            ->withCount([
                'pollOptions as total_options',
                'pollVotes as total_votes',
            ])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($poll) {
                return [
                    'id'            => $poll->id,
                    'poll_id'       => 'PID-' . optional($poll->created_at)->format('Ymd') . '-' . str_pad($poll->id, 3, '0', STR_PAD_LEFT),
                    'poll_title'    => $poll->headline,
                    'total_options' => $poll->total_options,
                    'total_votes'   => $poll->total_votes,
                    'created_date'  => optional($poll->created_at)->toDateString(),
                    'status'        => $poll->closed_at ? 'Closed' : 'Active',
                ];
            });

        return response()->json([
            'data'   => $polls,
            'status' => 'success',
        ], 200);
    }

    public function dashboard()
    {
        $total_polls     = ActivityPost::where('type', 'poll')->count();
        $total_votes     = ActivityPollVote::count();
        $total_employees = User::where('role', User::ROLE_EMPLOYEE)->count();
        $unique_voters   = ActivityPollVote::distinct('user_id')->count('user_id');

        $most_selected = ActivityPollOption::leftJoin(
                'activity_poll_votes',
                'activity_poll_votes.activity_poll_option_id',
                '=',
                'activity_poll_options.id'
            )
            ->select(
                'activity_poll_options.label',
                DB::raw('COUNT(activity_poll_votes.id) as vote_count')
            )
            ->groupBy('activity_poll_options.id', 'activity_poll_options.label')
            ->orderBy('vote_count', 'desc')
            ->first();

        $highest_engagement = ActivityPost::where('type', 'poll')
            ->withCount('pollVotes')
            ->orderBy('poll_votes_count', 'desc')
            ->first();

        $participation_rate = $total_employees > 0
            ? round(($unique_voters / $total_employees) * 100, 2)
            : 0;

        return response()->json([
            'data' => [
                'total_polls'                  => $total_polls,
                'total_votes'                  => $total_votes,
                'most_selected_option'         => $most_selected
                    ? ['label' => $most_selected->label, 'total_votes' => (int) $most_selected->vote_count]
                    : null,
                'participation_rate'           => $participation_rate,
                'poll_with_highest_engagement' => $highest_engagement
                    ? [
                        'poll_id'     => $highest_engagement->id,
                        'poll_title'  => $highest_engagement->headline,
                        'total_votes' => $highest_engagement->poll_votes_count,
                    ]
                    : null,
            ],
            'status' => 'success',
        ], 200);
    }

    public function show($id)
    {
        $poll = ActivityPost::where('id', $id)->where('type', 'poll')->first();

        if (!$poll) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Poll not found.',
            ], 404);
        }

        $poll->load(['pollOptions' => function ($q) {
            $q->orderBy('sort_order');
        }, 'pollVotes']);

        $total_votes = $poll->pollVotes->count();

        $results = $poll->pollOptions->map(function ($option) use ($poll, $total_votes) {
            $vote_count = $poll->pollVotes
                ->where('activity_poll_option_id', $option->id)
                ->count();

            return [
                'option_id'    => $option->id,
                'option_label' => $option->label,
                'vote_count'   => $vote_count,
                'percentage'   => $total_votes > 0
                    ? round(($vote_count / $total_votes) * 100, 2)
                    : 0,
            ];
        });

        return response()->json([
            'data' => [
                'poll_information' => [
                    'id'           => $poll->id,
                    'poll_id'      => 'PID-' . optional($poll->created_at)->format('Ymd') . '-' . str_pad($poll->id, 3, '0', STR_PAD_LEFT),
                    'poll_title'   => $poll->headline,
                    'created_date' => optional($poll->created_at)->toDateString(),
                    'total_votes'  => $total_votes,
                    'status'       => $poll->closed_at ? 'Closed' : 'Active',
                ],
                'poll_results' => $results,
            ],
            'status' => 'success',
        ], 200);
    }

    public function vote_records($id)
    {
        $poll = ActivityPost::where('id', $id)->where('type', 'poll')->first();

        if (!$poll) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Poll not found.',
            ], 404);
        }

        $records = ActivityPollVote::with(['option:id,label', 'user:id,name'])
            ->where('activity_post_id', $poll->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($vote) use ($poll) {
                return [
                    'employee_name'   => $vote->user?->name,
                    'user_id'         => $vote->user_id,
                    'selected_option' => $vote->option?->label,
                    'poll_id'         => $poll->id,
                    'voted_at'        => optional($vote->created_at)->toDateTimeString(),
                ];
            });

        return response()->json([
            'data'   => $records,
            'status' => 'success',
        ], 200);
    }

    public function export_vote_records($id)
    {
        $poll     = ActivityPost::where('id', $id)->where('type', 'poll')->firstOrFail();
        $filename = 'poll_' . $poll->id . '_vote_records_' . now()->format('Ymd_His') . '.csv';

        return response()->streamDownload(function () use ($poll) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Employee Name', 'User ID', 'Selected Option', 'Poll ID', 'Voted At']);

            ActivityPollVote::with(['option:id,label', 'user:id,name'])
                ->where('activity_post_id', $poll->id)
                ->orderBy('created_at', 'desc')
                ->chunk(500, function ($votes) use ($handle, $poll) {
                    foreach ($votes as $vote) {
                        fputcsv($handle, [
                            $vote->user?->name,
                            $vote->user_id,
                            $vote->option?->label,
                            $poll->id,
                            optional($vote->created_at)->toDateTimeString(),
                        ]);
                    }
                });

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }

    public function close_poll($id)
    {
        $poll = ActivityPost::where('id', $id)->where('type', 'poll')->first();

        if (!$poll) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Poll not found.',
            ], 404);
        }

        $poll->update(['closed_at' => now()]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Poll closed successfully.',
        ], 200);
    }

    public function reopen_poll($id)
    {
        $poll = ActivityPost::where('id', $id)->where('type', 'poll')->first();

        if (!$poll) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Poll not found.',
            ], 404);
        }

        $poll->update(['closed_at' => null]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Poll reopened successfully.',
        ], 200);
    }

    public function vote(Request $request, $id)
    {
        $poll = ActivityPost::where('id', $id)->where('type', 'poll')->first();

        if (!$poll) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Poll not found.',
            ], 404);
        }

        if ($poll->closed_at) {
            return response()->json([
                'status'  => 'error',
                'message' => 'This poll is already closed.',
            ], 422);
        }

        $request->validate([
            'option_id' => 'required|integer|exists:activity_poll_options,id',
        ]);

        $option = ActivityPollOption::where('id', $request->option_id)
            ->where('activity_post_id', $poll->id)
            ->first();

        if (!$option) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Invalid poll option.',
            ], 422);
        }

        ActivityPollVote::updateOrCreate(
            [
                'activity_post_id' => $poll->id,
                'user_id'          => Auth::id(),
            ],
            [
                'activity_poll_option_id' => $option->id,
            ]
        );

        $poll->load('pollOptions', 'pollVotes');

        $total_votes       = $poll->pollVotes->count();
        $user_voted_option = $poll->pollVotes
            ->firstWhere('user_id', Auth::id())
            ?->activity_poll_option_id;

        return response()->json([
            'data' => [
                'total_votes'       => $total_votes,
                'user_has_voted'    => true,
                'user_voted_option' => $user_voted_option,
                'options'           => $poll->pollOptions->map(function ($opt) use ($poll, $total_votes) {
                    $vote_count = $poll->pollVotes
                        ->where('activity_poll_option_id', $opt->id)
                        ->count();
                    return [
                        'id'         => $opt->id,
                        'label'      => $opt->label,
                        'vote_count' => $vote_count,
                        'percentage' => $total_votes > 0
                            ? round(($vote_count / $total_votes) * 100)
                            : 0,
                    ];
                }),
            ],
            'status'  => 'success',
            'message' => 'Vote cast successfully.',
        ], 201);
    }
}
