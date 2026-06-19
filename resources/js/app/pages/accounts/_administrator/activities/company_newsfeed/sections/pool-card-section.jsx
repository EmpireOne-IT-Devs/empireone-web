import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { BarChart2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Card from "@/app/_components/card";
import Badge from "@/app/_components/badge";
import {
    get_activity_posts_thunk,
    cast_poll_vote_thunk,
} from "@/app/redux/activities-slice";

function formatDate(d) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

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
    const options = currentPoll.options ?? [];
    const totalVotes = currentPoll.total_votes ?? 0;
    const userHasVoted = currentPoll.user_has_voted ?? false;
    const userVotedOption = currentPoll.user_voted_option ?? null;

    // Strip HTML from the question message for plain text display.
    const questionText = currentPoll.message
        ? currentPoll.message.replace(/<[^>]+>/g, "").trim()
        : "";

    const handleVote = (optionId) => {
        if (userHasVoted || pollVoting) return;
        dispatch(
            cast_poll_vote_thunk({ postId: currentPoll.id, optionId }),
        );
    };

    return (
        <div className="w-full bg-[#f4f6f9] p-6 rounded-2xl font-sans antialiased">
            <Card
                variant="default"
                padding="p-6"
                className="w-full col-span-1 bg-white border border-gray-100 shadow-sm"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0b2265] flex items-center justify-center text-white shrink-0 shadow-sm">
                            <BarChart2
                                size={18}
                                className="transform rotate-90"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-800 leading-tight">
                                {currentPoll.author?.name ?? "HR Department"}
                            </span>
                            <span className="text-xs text-gray-400 mt-0.5">
                                {formatDate(currentPoll.published_at)}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge label="Poll" variant="purple" />
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
                    </div>
                </div>

                {/* Title & question */}
                <div className="mb-5">
                    <h3 className="text-base font-semibold text-gray-900 tracking-tight mb-2">
                        {currentPoll.headline}
                    </h3>
                    {questionText && (
                        <p className="text-sm text-gray-500 font-normal leading-relaxed">
                            {questionText}
                        </p>
                    )}
                </div>

                {/* Options */}
                <div className="flex flex-col gap-3 mb-6">
                    {options.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-4">
                            No options available.
                        </p>
                    )}

                    {options.map((option) => {
                        const isVoted = userVotedOption === option.id;
                        const pct = option.percentage ?? 0;

                        if (userHasVoted) {
                            // Show progress bar results.
                            return (
                                <div
                                    key={option.id}
                                    className={`relative w-full rounded-xl border overflow-hidden text-sm font-medium transition-all ${
                                        isVoted
                                            ? "border-blue-400 bg-blue-50/40 text-blue-700"
                                            : "border-gray-200 text-gray-700 bg-white"
                                    }`}
                                >
                                    {/* Progress fill */}
                                    <div
                                        className={`absolute inset-y-0 left-0 ${
                                            isVoted
                                                ? "bg-blue-100"
                                                : "bg-gray-100"
                                        } transition-all duration-500`}
                                        style={{ width: `${pct}%` }}
                                    />
                                    <div className="relative flex items-center justify-between px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {isVoted && (
                                                <CheckCircle2
                                                    size={15}
                                                    className="text-blue-500 shrink-0"
                                                />
                                            )}
                                            <span>{option.label}</span>
                                        </div>
                                        <span
                                            className={`text-xs font-semibold tabular-nums ${
                                                isVoted
                                                    ? "text-blue-600"
                                                    : "text-gray-500"
                                            }`}
                                        >
                                            {pct}%
                                        </span>
                                    </div>
                                </div>
                            );
                        }

                        // Show clickable option buttons before voting.
                        return (
                            <button
                                key={option.id}
                                type="button"
                                disabled={pollVoting}
                                onClick={() => handleVote(option.id)}
                                className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 text-sm font-medium ${
                                    pollVoting
                                        ? "opacity-60 cursor-not-allowed border-gray-200 text-gray-500"
                                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 text-gray-700 cursor-pointer"
                                }`}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs font-semibold text-gray-400">
                    <span>
                        {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
                    </span>
                    {polls.length > 1 && (
                        <span className="text-gray-400 font-medium">
                            {pollIndex + 1} / {polls.length}
                        </span>
                    )}
                </div>
            </Card>
        </div>
    );
}
