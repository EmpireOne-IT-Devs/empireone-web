import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Award } from "lucide-react";
import Badge from "@/app/_components/badge";
import { get_engagement_reward_challenge_profile_summary_thunk } from "@/app/redux/engagement-thunk";

const STATUS_BADGE = {
    joined: { label: "In Progress", variant: "info" },
    submitted: { label: "Pending Review", variant: "warning" },
    approved: { label: "Approved", variant: "success" },
    declined: { label: "Declined", variant: "danger" },
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
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                    <Award className="h-7 w-7" />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Total Points</p>
                    <p className="text-2xl font-bold text-gray-900">{totalPoints}</p>
                </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-sm font-bold text-gray-900">Challenge History</h3>

                {challengeProfileSummaryLoading ? (
                    <p className="text-sm text-gray-500">Loading...</p>
                ) : history.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        You haven&apos;t joined any challenges yet.
                    </p>
                ) : (
                    <div className="flex flex-col divide-y divide-gray-50">
                        {history.map((item) => {
                            const badge = STATUS_BADGE[item.status] ?? STATUS_BADGE.joined;

                            return (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between gap-3 py-3"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">
                                            {item.challenge_title}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {item.category} · Joined {formatDate(item.joined_at)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge label={badge.label} variant={badge.variant} />
                                        {item.status === "approved" && (
                                            <span className="text-sm font-semibold text-emerald-600">
                                                +{item.points} pts
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
