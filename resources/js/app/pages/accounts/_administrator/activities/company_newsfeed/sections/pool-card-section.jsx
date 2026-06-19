import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BarChart2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Card from "@/app/_components/card";
import ActivityPollCard from "../../_components/activity-poll-card";
import {
    get_activity_posts_thunk,
    cast_poll_vote_thunk,
} from "@/app/redux/activities-slice";

export default function PoolCardSection() {
    const dispatch = useDispatch();
    const { posts, postsLoading, pollVoting } = useSelector(
        (s) => s.activities,
    );
    const [pollIndex, setPollIndex] = useState(0);

    useEffect(() => {
        dispatch(get_activity_posts_thunk());
    }, [dispatch]);

    const polls = posts.filter((p) => p.type === "poll");

    // Keep index in bounds when the poll list changes.
    useEffect(() => {
        if (pollIndex >= polls.length && polls.length > 0) {
            setPollIndex(0);
        }
    }, [polls.length]);

    if (postsLoading && polls.length === 0) {
        return (
            <div className="w-full bg-[#f4f6f9] p-6 rounded-2xl font-sans antialiased">
                <div className="h-64 rounded-2xl bg-white animate-pulse" />
            </div>
        );
    }

    if (polls.length === 0) {
        return (
            <div className="w-full bg-[#f4f6f9] p-6 rounded-2xl font-sans antialiased">
                <Card
                    variant="default"
                    padding="p-6"
                    className="w-full bg-white border border-gray-100 shadow-sm"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#0b2265] flex items-center justify-center text-white shrink-0 shadow-sm">
                            <BarChart2
                                size={18}
                                className="transform rotate-90"
                            />
                        </div>
                        <span className="text-sm font-semibold text-gray-800">
                            Active Polls
                        </span>
                    </div>
                    <p className="text-sm text-gray-400 text-center py-8">
                        No active polls yet.
                    </p>
                </Card>
            </div>
        );
    }

    const currentPoll = polls[pollIndex] ?? polls[0];
    const handleVote = (optionId) => {
        if (pollVoting) return;
        dispatch(
            cast_poll_vote_thunk({ postId: currentPoll.id, optionId }),
        );
    };

    return (
        <div className="w-full bg-[#f4f6f9] p-6 rounded-2xl font-sans antialiased">
            <ActivityPollCard
                post={currentPoll}
                pollVoting={pollVoting}
                onVote={handleVote}
                headerActions={
                    <>
                        {polls.length > 1 && (
                            <div className="flex gap-1">
                                <button
                                    onClick={() =>
                                        setPollIndex((p) =>
                                            p === 0
                                                ? polls.length - 1
                                                : p - 1,
                                        )
                                    }
                                    className="p-1 rounded-lg border hover:bg-gray-50"
                                >
                                    <ChevronLeft size={14} />
                                </button>
                                <button
                                    onClick={() =>
                                        setPollIndex((p) =>
                                            p === polls.length - 1
                                                ? 0
                                                : p + 1,
                                        )
                                    }
                                    className="p-1 rounded-lg border hover:bg-gray-50"
                                >
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        )}
                    </>
                }
                footerMeta={
                    polls.length > 1 ? (
                        <span className="text-gray-400 font-medium">
                            {pollIndex + 1} / {polls.length}
                        </span>
                    ) : null
                }
            />
        </div>
    );
}
