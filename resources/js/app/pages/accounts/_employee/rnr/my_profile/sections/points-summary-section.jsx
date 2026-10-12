import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trophy } from "lucide-react";
import Badge from "@/app/_components/badge";
import Button from "@/app/_components/button";
import Pagination from "@/app/_components/pagination";
import { Link } from "@inertiajs/react";
import { get_engagement_reward_challenge_profile_summary_thunk } from "@/app/redux/engagement-thunk";

const STATUS_BADGE = {
    joined:    { label: "In progress",    variant: "info" },
    submitted: { label: "Pending review", variant: "warning" },
    pending_survey: { label: "Survey required", variant: "warning" },
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
    const { challengeProfileSummary, challengeProfileSummaryLoading, challengeProfileSummaryError } = useSelector(
        (state) => state.engagement,
    );
    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(get_engagement_reward_challenge_profile_summary_thunk());
    }, [dispatch]);

    const { total_points: totalPoints, challenge_history: history } = challengeProfileSummary;
    const lastPage = Math.max(1, Math.ceil(history.length / 10));
    const currentPage = Math.min(page, lastPage);
    const visibleHistory = history.slice((currentPage - 1) * 10, currentPage * 10);

    return (
        <div className="flex flex-col gap-3">
            {challengeProfileSummaryError && (
                <div role="alert" className="space-y-2 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                    <p>{challengeProfileSummaryError.message || "Unable to refresh points and challenge history."}</p>
                    <Button outlined loading={challengeProfileSummaryLoading} onClick={() => dispatch(get_engagement_reward_challenge_profile_summary_thunk())}>
                        Retry
                    </Button>
                </div>
            )}
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
                ) : challengeProfileSummaryError && history.length === 0 ? (
                    <p className="px-5 py-4 text-sm text-red-700">Challenge history could not be loaded.</p>
                ) : history.length === 0 ? (
                    <div className="space-y-2 px-5 py-4 text-sm text-gray-400">
                        No challenges joined yet.
                        <Link href={`/accounts/${window.location.pathname.split("/")[2]}/rnr/challenge_event`} className="block text-purple-700 underline">
                            Explore challenges
                        </Link>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-50">
                        {visibleHistory.map((item) => {
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
                                        {(item.total_points_awarded ?? (item.status === "approved" ? item.points : 0)) > 0 && (
                                            <span className="text-xs font-medium text-emerald-600">
                                                +{item.total_points_awarded ?? item.points} pts
                                                {item.survey_points_awarded > 0 && (
                                                    <span className="block text-purple-700">
                                                        {item.survey_points_awarded} survey pts
                                                    </span>
                                                )}
                                            </span>
                                        )}
                                    </div>
                                    {lastPage > 1 && <Pagination data={{ current_page: currentPage, last_page: lastPage }} onPageChange={setPage} />}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}