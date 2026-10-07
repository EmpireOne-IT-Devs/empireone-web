import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LayoutGrid, Archive } from "lucide-react";
import { get_my_engagement_reward_challenges_thunk } from "@/app/redux/engagement-thunk";
import HeaderSection from "./header-section";
import ChallengeCardSection from "./challenge-card-section";

export default function ChallengeEventSection() {
    const dispatch = useDispatch();
    const { myRewardChallenges, myRewardChallengesLoading } = useSelector(
        (state) => state.engagement,
    );
    const [filter, setFilter] = useState("All");
    const [showArchived, setShowArchived] = useState(false);
    const [sharedId] = useState(() =>
        Number(new URLSearchParams(window.location.search).get("challenge")) || null,
    );
    const [highlightId, setHighlightId] = useState(null);

    useEffect(() => {
        dispatch(get_my_engagement_reward_challenges_thunk());
    }, [dispatch]);

    // Shared link (?challenge=ID): show the right tab, then scroll to and highlight the card once.
    useEffect(() => {
        if (!sharedId || highlightId !== null || myRewardChallengesLoading) return;
        const shared = myRewardChallenges.find((challenge) => challenge.id === sharedId);
        if (!shared) return;
        setFilter("All");
        setShowArchived(shared.status === "Completed");
        setHighlightId(sharedId);
    }, [sharedId, highlightId, myRewardChallenges, myRewardChallengesLoading]);

    useEffect(() => {
        if (!highlightId) return;
        const frame = requestAnimationFrame(() => {
            document
                .getElementById(`challenge-${highlightId}`)
                ?.scrollIntoView({ behavior: "smooth", block: "center" });
        });
        const timer = setTimeout(() => setHighlightId(0), 4000);
        return () => {
            cancelAnimationFrame(frame);
            clearTimeout(timer);
        };
    }, [highlightId]);

    const activeCount = useMemo(
        () => myRewardChallenges.filter((challenge) => challenge.status === "Active").length,
        [myRewardChallenges],
    );

    const joinedCount = useMemo(
        () => myRewardChallenges.filter((challenge) => challenge.is_joined).length,
        [myRewardChallenges],
    );

    const filteredChallenges = useMemo(() => {
        // Ended challenges (status "Completed") are auto-archived out of the main list.
        const byArchive = myRewardChallenges.filter((challenge) =>
            showArchived
                ? challenge.status === "Completed"
                : challenge.status !== "Completed",
        );
        return filter === "All"
            ? byArchive
            : byArchive.filter((challenge) => challenge.type === filter);
    }, [myRewardChallenges, filter, showArchived]);

    const viewTabs = [
        { label: "All Challenges", icon: LayoutGrid, archived: false },
        { label: "Archive", icon: Archive, archived: true },
    ];

    return (
        <div className="flex flex-col gap-6 min-h-screen p-6 bg-gradient-to-br from-slate-50 via-indigo-50/40 to-white border border-slate-200 rounded-lg">
            <HeaderSection
                activeCount={activeCount}
                joinedCount={joinedCount}
                filter={filter}
                onFilterChange={setFilter}
            />
            <div className="flex items-center gap-2 border-b border-white pb-3">
                {viewTabs.map((tab) => {
                    const Icon = tab.icon;
                    const active = showArchived === tab.archived;
                    return (
                        <button
                            key={tab.label}
                            type="button"
                            onClick={() => setShowArchived(tab.archived)}
                            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all shadow-sm ${
                                active
                                    ? "bg-gray-900 text-white shadow-gray-200"
                                    : "bg-white text-gray-600 hover:text-gray-900 hover:bg-slate-50 border border-slate-200/80"
                            }`}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>
            <ChallengeCardSection
                challenges={filteredChallenges}
                loading={myRewardChallengesLoading}
                archived={showArchived}
                highlightId={highlightId}
            />
        </div>
    );
}