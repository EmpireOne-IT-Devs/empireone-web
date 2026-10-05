import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trophy } from "lucide-react";
import Badge from "@/app/_components/badge";
import { get_engagement_reward_challenge_profile_summary_thunk } from "@/app/redux/engagement-thunk";

const STATUS_BADGE = {
    joined:    { label: "In progress",    variant: "info" },
    submitted: { label: "Pending review", variant: "warning" },
    approved:  { label: "Approved",       variant: "success" },
    declined:  { label: "Declined",       variant: "danger" },
};

function formatDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export default function PointsSummarySection() {
    const dispatch = useDispatch();
    const { challengeProfileSummary, challengeProfileSummaryLoading } = useSelector(
        (state) => state.engagement,
    );

    useEffect(() => {
        dispatch(get_engagement_reward_challenge_profile_summary_thunk());
    }, [dispatch]);

    const { total_points: totalPoints, challenge_history: history } = challengeProfileSummary;

    return (
        <div className="flex flex-col gap-3">
            {/* Hero points card */}
            <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[10px] bg-amber-50 text-amber-600">
                    <Trophy className="h-5 w-5" />
                </div>
                <div>
                    <p className="mb-0.5 text-xs tracking-wide text-gray-400">Total points</p>
                    <p className="text-3xl font-medium leading-none text-gray-900">
                        {totalPoints?.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Challenge history */}
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
                <div className="border-b border-gray-100 px-5 py-4">
                    <h3 className="text-xs font-medium text-gray-400">Challenge history</h3>
                </div>

                {challengeProfileSummaryLoading ? (
                    <p className="px-5 py-4 text-sm text-gray-400">Loading…</p>
                ) : history.length === 0 ? (
                    <p className="px-5 py-4 text-sm text-gray-400">
                        No challenges joined yet.
                    </p>
                ) : (
                    <ul className="divide-y divide-gray-50">
                        {history.map((item) => {
                            const badge = STATUS_BADGE[item.status] ?? STATUS_BADGE.joined;

                            return (
                                <li
                                    key={item.id}
                                    className="flex items-center justify-between gap-3 px-5 py-3.5"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-gray-900">
                                            {item.challenge_title}
                                        </p>
                                        <p className="mt-0.5 text-xs text-gray-400">
                                            {item.category} · Joined {formatDate(item.joined_at)}
                                        </p>
                                    </div>
                                    <div className="flex flex-shrink-0 items-center gap-2">
                                        <Badge label={badge.label} variant={badge.variant} />
                                        {item.status === "approved" && (
                                            <span className="text-xs font-medium text-emerald-600">
                                                +{item.points} pts
                                            </span>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}