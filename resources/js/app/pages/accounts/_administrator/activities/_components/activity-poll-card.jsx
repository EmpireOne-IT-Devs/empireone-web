import React, { useState } from "react";
import { BarChart2, CheckCircle2 } from "lucide-react";
import Card from "@/app/_components/card";
import Badge from "@/app/_components/badge";

function formatDate(d) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function stripHtml(html) {
    return html ? html.replace(/<[^>]+>/g, "").trim() : "";
}

function WysiwygContent({ html }) {
    return (
        <div
            className="text-sm text-gray-500 font-normal leading-relaxed break-words overflow-x-hidden [&_*]:max-w-full [&_a]:break-all [&_a]:text-blue-600 [&_a]:underline [&_b]:font-bold [&_blockquote]:border-l-4 [&_blockquote]:border-gray-200 [&_blockquote]:pl-4 [&_blockquote]:italic [&_em]:italic [&_h1]:text-lg [&_h1]:font-bold [&_h2]:text-base [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-bold [&_i]:italic [&_img]:hidden [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 [&_strong]:font-bold [&_strong]:text-gray-700 [&_table]:hidden [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: html ?? "" }}
        />
    );
}

export default function ActivityPollCard({ post, pollVoting, onVote, headerActions = null, footerMeta = null }) {
    const options = post.options ?? [];
    const totalVotes = post.total_votes ?? 0;
    const userHasVoted = post.user_has_voted ?? false;
    const userVotedOption = post.user_voted_option ?? null;
    const hasQuestion = Boolean(stripHtml(post.message));

    // selectedOption: the option the user has highlighted but not yet submitted
    const [selectedOption, setSelectedOption] = useState(null);
    // isChangingVote: true when the user clicks "Change vote" after already voting
    const [isChangingVote, setIsChangingVote] = useState(false);

    const showVotingUI = !userHasVoted || isChangingVote;

    function handleSelect(optionId) {
        setSelectedOption(optionId);
    }

    function handleSubmit() {
        if (!selectedOption || !onVote) return;
        onVote(selectedOption);
        setSelectedOption(null);
        setIsChangingVote(false);
    }

    function handleChangeVote() {
        setSelectedOption(userVotedOption); // pre-highlight current choice
        setIsChangingVote(true);
    }

    function handleCancel() {
        setSelectedOption(null);
        setIsChangingVote(false);
    }

    return (
        <Card
            variant="default"
            padding="p-6"
            className="w-full bg-white border border-gray-100 shadow-sm"
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
                            {post.author?.name ?? "HR Department"}
                        </span>
                        <span className="text-xs text-gray-400 mt-0.5">
                            {formatDate(post.published_at)}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge label="Poll" variant="purple" />
                    {headerActions}
                </div>
            </div>

            {/* Title & question */}
            <div className="mb-5">
                <h3 className="text-base font-semibold text-gray-900 tracking-tight mb-2">
                    {post.headline}
                </h3>
                {hasQuestion && (
                    <WysiwygContent html={post.message} />
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
                    const isSelected = selectedOption === option.id;
                    const pct = option.percentage ?? 0;

                    // ── Results view (voted, not changing) ──────────────
                    if (!showVotingUI) {
                        return (
                            <div
                                key={option.id}
                                className={`relative w-full rounded-xl border overflow-hidden text-sm font-medium transition-all ${
                                    isVoted
                                        ? "border-blue-400 bg-blue-50/40 text-blue-700"
                                        : "border-gray-200 text-gray-700 bg-white"
                                }`}
                            >
                                <div
                                    className={`absolute inset-y-0 left-0 ${
                                        isVoted ? "bg-blue-100" : "bg-gray-100"
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
                                            isVoted ? "text-blue-600" : "text-gray-500"
                                        }`}
                                    >
                                        {pct}%
                                    </span>
                                </div>
                            </div>
                        );
                    }

                    // ── Selection view (not yet voted, or changing vote) ─
                    return (
                        <button
                            key={option.id}
                            type="button"
                            disabled={pollVoting}
                            onClick={() => handleSelect(option.id)}
                            className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 text-sm font-medium ${
                                isSelected
                                    ? "border-blue-400 bg-blue-50/30 text-blue-700"
                                    : pollVoting
                                    ? "opacity-60 cursor-not-allowed border-gray-200 text-gray-500"
                                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 text-gray-700 cursor-pointer"
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                {isSelected && (
                                    <CheckCircle2 size={14} className="text-blue-500 shrink-0" />
                                )}
                                {option.label}
                            </span>
                        </button>
                    );
                })}

                {/* Submit / Cancel row — only shown in voting/changing mode */}
                {showVotingUI && (
                    <div className="flex items-center gap-2 pt-1">
                        <button
                            type="button"
                            disabled={!selectedOption || pollVoting}
                            onClick={handleSubmit}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                selectedOption && !pollVoting
                                    ? "bg-[#0b2265] text-white hover:bg-[#0d2a7a] cursor-pointer"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                        >
                            {pollVoting ? "Submitting…" : "Submit Vote"}
                        </button>
                        {isChangingVote && (
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs font-semibold text-gray-400">
                <span>
                    {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
                </span>
                <div className="flex items-center gap-3">
                    {footerMeta}
                    {userHasVoted && onVote && !isChangingVote && (
                        <button
                            type="button"
                            onClick={handleChangeVote}
                            className="text-xs font-medium text-blue-500 hover:text-blue-700 transition underline underline-offset-2"
                        >
                            Change vote
                        </button>
                    )}
                </div>
            </div>
        </Card>
    );
}