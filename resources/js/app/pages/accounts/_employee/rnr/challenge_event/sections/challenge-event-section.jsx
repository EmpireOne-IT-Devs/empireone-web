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

    useEffect(() => {
        dispatch(get_my_engagement_reward_challenges_thunk());
    }, [dispatch]);

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
        <div className="flex flex-col gap-4">
            <HeaderSection
                activeCount={activeCount}
                joinedCount={joinedCount}
                filter={filter}
                onFilterChange={setFilter}
            />
            <div className="flex items-center gap-2">
                {viewTabs.map((tab) => {
                    const Icon = tab.icon;
                    const active = showArchived === tab.archived;
                    return (
                        <button
                            key={tab.label}
                            type="button"
                            onClick={() => setShowArchived(tab.archived)}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                                active
                                    ? "bg-gray-900 text-white"
                                    : "bg-white text-gray-500 hover:text-gray-700"
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
            />
        </div>
    );
}
